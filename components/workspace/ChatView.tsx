"use client";

import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { ArrowRight, Loader2Icon, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { MessageContext } from "@/providers/MessageContext";
import { UserDetailContext } from "@/context/UserDetailContext";

import { LOOKUP } from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import { useSidebar } from "../ui/sidebar";

const ChatView = () => {
  const { id } = useParams();
  const router = useRouter();
  const convex = useConvex();

  const messageContext = useContext(MessageContext);
  const userDetailContext = useContext(UserDetailContext);

  if (!messageContext || !userDetailContext) {
    console.error("Missing required providers");
    return null;
  }

  const { messages, setMessages } = messageContext;
  const { userDetail } = userDetailContext;

  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const UpdateMessages = useMutation(api.workspace.UpdateMessages);

  const lastProcessedIndexRef = useRef(-1);

  // Redirect if not logged in
  useEffect(() => {
    if (userDetail === null) return;
    if (!userDetail?.name) router.push("/");
  }, [userDetail, router]);

  // Fetch workspace messages
  const GetWorkspaceData = useCallback(async () => {
    try {
      const result = await convex.query(api.workspace.GetUserWorkSpace, {
        workspaceId: id as Id<"workspaces">,
      });

      setMessages(result?.message || []);
      lastProcessedIndexRef.current = (result?.message || []).length - 1;

    } catch (error) {
      console.error("Error loading workspace:", error);
    }
  }, [convex, id, setMessages]);

  useEffect(() => {
    if (id) GetWorkspaceData();
  }, [id, GetWorkspaceData]);

  // AI Response Generator
  const GetAiResponse = useCallback(async () => {
    setLoading(true);
    try {
      const PROMPT = JSON.stringify(messages) + "\n" + Prompt.CHAT_PROMPT;

      const result = await axios.post("/api/ai-chat", { prompt: PROMPT });

      const aiResponse = {
        role: "ai",
        content: result.data.result,
      };

      setMessages((prev) => {
        const updated = [...prev, aiResponse];

        UpdateMessages({
          message: updated,
          workspaceId: id as Id<"workspaces">,
        });

        return updated;
      });

    } catch (error) {
      console.error("AI Error:", error);
      toast.error("AI failed to generate response.");
    } finally {
      setLoading(false);
    }
  }, [messages, id, setMessages, UpdateMessages]);

  // Trigger AI only once per new user message
  useEffect(() => {
    if (messages.length === 0) return;

    const lastIndex = messages.length - 1;
    const last = messages[lastIndex];

    // Already processed → skip
    if (lastProcessedIndexRef.current === lastIndex) return;

    if (last.role === "user") {
      lastProcessedIndexRef.current = lastIndex;
      GetAiResponse();
    } else {
      lastProcessedIndexRef.current = lastIndex;
    }

  }, [messages, GetAiResponse]);

  // User submits message
  const onGenerate = (input: string) => {
    if (!input.trim()) return;

    if (userDetail && userDetail.tokens <= 0) {
      toast.error("You don't have enough tokens to chat.");
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setUserInput("");
  };

  return (
    <div className="relative h-[76vh] flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-scroll no-scrollbar px-8 ">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="bg-[#272727] p-3 rounded-lg m-2 flex gap-4 items-start"
          >
            {msg.role === "user" && userDetail?.pic && (
              <Image
                src={userDetail.pic}
                width={35}
                height={35}
                alt="User"
                className="rounded-full"
              />
            )}

            <h2 className="mt-1 whitespace-pre-line">{msg.content}</h2>
          </div>
        ))}

        {loading && (
          <div className="bg-[#272727] p-3 rounded-lg m-2 flex gap-5 items-start">
            <Loader2Icon className="animate-spin" />
            <h2>Generating response...</h2>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-5 border rounded-xl max-w-xl w-full mt-3 bg-[#151515]">
        <div className="flex gap-2">
          <textarea
            placeholder={LOOKUP.INPUT_PLACEHOLDER}
            className="outline-none bg-transparent w-full h-24 max-h-56 resize-none"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onGenerate(userInput);
              }
            }}
          />

          {userInput.trim() && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer hover:bg-blue-600"
            />
          )}
        </div>

        <div>
          <LinkIcon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default ChatView;

