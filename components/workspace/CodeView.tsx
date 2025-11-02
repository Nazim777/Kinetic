"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";

import { LOOKUP } from "@/data/Lookup";
import axios from "axios";
import { MessageContext } from "@/providers/MessageContext";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import Prompt from "@/data/Prompt";
import { Loader2Icon } from "lucide-react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { toast } from "sonner";

const CodeView = () => {
  const context = useContext(UserDetailContext);
  if (!context) throw new Error("UserDetail context not available");
  const { userDetail, setUserDetail } = context;
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("code");
  const [Files, setFiles] = useState(LOOKUP.DEFAULT_FILE);
  const messageContext = useContext(MessageContext);
  const messages = messageContext?.messages || [];
  const setMessages = messageContext?.setMessages || (() => {});
  const [loading, setLoading] = useState(false);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const UpdateTokensForChat = useMutation(api.user.UpdateTokensForChat);
  const convex = useConvex();

  useEffect(() => {
    id && GetFiles();
  }, [id]);

  const GetFiles = async () => {
    setLoading(true);
    const result = await convex.query(api.workspace.GetUserWorkSpace, {
      workspaceId: id as Id<"workspaces">,
    });
    const mergeFiles = { ...result?.fileData };
    setFiles(mergeFiles);
    setLoading(false);
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role === "user") {
        GenerateAiCode();
      }
    }
  }, [messages]);
 

  const GenerateAiCode = async () => {
    setActiveTab("code");
    setLoading(true);

    const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;

    try {
      const result = await axios.post("/api/ai-code", { prompt: PROMPT });
      console.log('result',result)
      const aiResponse = result.data;
      console.log('response ai',aiResponse)

      // Merge files
      const mergeFiles = { ...Files, ...aiResponse?.files };
      setFiles(mergeFiles);

      // Update workspace
      await UpdateFiles({
        workspaceId: id as Id<"workspaces">,
        fileData: aiResponse?.files,
      });

      // Deduct tokens dynamically based on usage

      console.log("tokenUsed", aiResponse.tokenUsed);
      const tokensUsed = aiResponse?.tokensUsed || 4000; // if your API returns actual tokens used
      const updatedUser = await UpdateTokensForChat({
        tokens: tokensUsed,
        // @ts-ignore
        email: userDetail?.email,
      });

      if (updatedUser) {
        // @ts-ignore
        setUserDetail(updatedUser);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2 border -mt-10">
        <div className="flex gap-3 items-center justify-center flex-wrap shrink-0 bg-black p-1 w-[140px] rounded-full">
          <h2
            className={`text-sm cursor-pointer ${activeTab == "code" && "text-white bg-blue-500 bg-opacity-25  p-1 px-2 rounded-full  "}`}
            onClick={() => setActiveTab("code")}
          >
            Code
          </h2>
          <h2
            className={`text-sm cursor-pointer ${activeTab == "preview" && "text-white bg-blue-500 bg-opacity-25  p-1 px-2 rounded-full  "}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider
        template="react"
        theme={"dark"}
        files={Files}
        options={{
          externalResources: ["https://unpkg.com/@tailwindcss/browser@4"],
        }}
        customSetup={{
          dependencies: {
            ...LOOKUP.DEPENDENCY,
          },
        }}
      >
        <SandpackLayout>
          {activeTab == "code" && (
            <>
              <SandpackFileExplorer
                style={{ height: "74vh" }}
                initialCollapsedFolder={["components/", "/public/"]}
              />
              <SandpackCodeEditor style={{ height: "74vh" }} />
            </>
          )}

          {activeTab == "preview" && (
            <>
              <SandpackPreview
                style={{ height: "74vh" }}
                showNavigator={true}
              />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>
      {loading && (
        <div className="p-10 bg-gray-900 opacity-60 gap-1 absolute top-0 rounded-lg w-full h-full flex items-center justify-center">
          <Loader2Icon className={`animate-spin  h-10 w-10 text-white `} />
          <h2 className="text-white font-semibold text-xl">
            Generating code...
          </h2>
        </div>
      )}
    </div>
  );
};

export default CodeView;
