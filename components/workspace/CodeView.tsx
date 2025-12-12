"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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
import { useParams, useSearchParams } from "next/navigation";
import Prompt from "@/data/Prompt";
import JSZip from "jszip";
import { Loader2Icon } from "lucide-react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { toast } from "sonner";

type FileSet = Record<string, { code: string } | string>;

const CodeView: React.FC = () => {
  const searchParams = useSearchParams();
  const newMessageTrigger = searchParams.get("newUserMessage");

  // user
  const userCtx = useContext(UserDetailContext);
  if (!userCtx) throw new Error("UserDetailContext missing");
  const { userDetail, setUserDetail } = userCtx;

  // messages
  const messageCtx = useContext(MessageContext);
  if (!messageCtx) throw new Error("MessageContext missing");
  const { messages } = messageCtx;

  const { id } = useParams();
  const convex = useConvex();
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const UpdateTokensForChat = useMutation(api.user.UpdateTokensForChat);

  const [files, setFiles] = useState<FileSet>(LOOKUP.DEFAULT_FILE);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [loading, setLoading] = useState(false);

  // download loading state
  const [downloadLoading, setDownloadLoading] = useState(false);

  // prevent double-calls
  const lastProcessedIndexRef = useRef(-1);
  const processingRef = useRef(false);

  /** -----------------------------------------
   * LOAD WORKSPACE FILES
   ------------------------------------------*/
  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const result = await convex.query(api.workspace.GetUserWorkSpace, {
          workspaceId: id as Id<"workspaces">,
        });

        if (mounted) {
          setFiles({ ...(result?.fileData || {}) });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load workspace files");
      } finally {
        mounted && setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id, convex]);

  /** -----------------------------------------
   * AI CODE GENERATION 
   ------------------------------------------*/
  const GenerateAiCode = React.useCallback(
    async () => {
      if (processingRef.current) return;
      processingRef.current = true;

      setActiveTab("code");
      setLoading(true);

      try {
        const PROMPT = JSON.stringify(messages) + "\n" + Prompt.CODE_GEN_PROMPT;

        const { data } = await axios.post("/api/ai-code", { prompt: PROMPT });

        const aiFiles = data?.files || {};
        const tokensUsed = data?.tokensUsed ?? data?.tokenUsed ?? 0;

        // merge locally
        const mergedFiles = { ...files, ...aiFiles };
        setFiles(mergedFiles);

        // persist merged files to backend
        await UpdateFiles({
          workspaceId: id as Id<"workspaces">,
          fileData: mergedFiles,
        });

        // update tokens
        if (tokensUsed && userDetail?.email) {
          await UpdateTokensForChat({
            tokens: tokensUsed,
            // @ts-ignore
            email: userDetail.email,
          });
        }
      } catch (err) {
        console.error("AI generation error:", err);
        toast.error("AI Code generation failed!");
      } finally {
        processingRef.current = false;
        setLoading(false); // loader stops only after all async ops finish
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, id, messages, UpdateFiles, UpdateTokensForChat, userDetail]
  );

  useEffect(() => {
    if (newMessageTrigger === "1") {
      setLoading(true); // show loader immediately
      GenerateAiCode();
    }
  }, [newMessageTrigger, GenerateAiCode]);

  /** -----------------------------------------
   * TRIGGER ON NEW USER MESSAGE (ONCE)
   ------------------------------------------*/
  useEffect(() => {
    if (!messages?.length) return;

    const lastIndex = messages.length - 1;

    // skip if already processed
    if (lastProcessedIndexRef.current === lastIndex) return;

    const last = messages[lastIndex];

    if (last.role === "user") {
      lastProcessedIndexRef.current = lastIndex;
      GenerateAiCode();
    } else {
      lastProcessedIndexRef.current = lastIndex;
    }
  }, [messages, GenerateAiCode]);

  /** -----------------------------------------
   * DOWNLOAD PROJECT AS ZIP
   * Uses JSZip dynamically from CDN; falls back to JSON if unavailable
   ------------------------------------------*/
  

const handleDownload = useCallback(async () => {
  if (downloadLoading) return;
  setDownloadLoading(true);

  try {
    const zip = new JSZip();

    // Merge workspace files with default files (workspace files override defaults)
    const allFiles: FileSet = { ...LOOKUP.DEFAULT_FILE, ...files };

    // Ensure package.json exists using LOOKUP.DEPENDENCY
    if (!allFiles["/package.json"]) {
      allFiles["/package.json"] = {
        code: JSON.stringify(
          {
            name: "project",
            version: "1.0.0",
            private: true,
            scripts: {
              start: "vite",
              build: "vite build",
              dev: "vite",
            },
            dependencies: LOOKUP.DEPENDENCY,
          },
          null,
          2
        ),
      };
    }

    // Ensure src/index.js exists
    if (!allFiles["/index.js"]) {
      allFiles["/index.js"] = {
        code: `import React from "react";
import ReactDOM from "react-dom/client";
import App from "../App.js";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);`,
      };
    }

    // Ensure App.css exists
    if (!allFiles["/App.css"]) {
      allFiles["/App.css"] = {
        code: `
@tailwind base;
@tailwind components;
@tailwind utilities;`,
      };
    }

    // Helper: add files to ZIP
    const addFilesToZip = (filesObj: FileSet, parentPath = "") => {
      Object.entries(filesObj).forEach(([path, file]) => {
        const fullPath = parentPath + (path.startsWith("/") ? path.slice(1) : path);

        if (typeof file === "string") {
          zip.file(fullPath, file);
        } else if (file && (file as any).code) {
          zip.file(fullPath, (file as any).code);
        } else if (typeof file === "object") {
          // Nested folder structure
          addFilesToZip(file as FileSet, fullPath + "/");
        }
      });
    };

    addFilesToZip(allFiles);

    // Project name from package.json
    let projectName = "project";
    const pkgFile = allFiles["/package.json"];
    if (pkgFile && (pkgFile as any).code) {
      try {
        const pkg = JSON.parse((pkgFile as any).code);
        if (pkg?.name) projectName = pkg.name.replace(/\s+/g, "-");
      } catch {}
    }

    // Generate ZIP and download
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("ZIP download error:", err);
    toast.error("Failed to create ZIP file.");
  } finally {
    setDownloadLoading(false);
  }
}, [files, downloadLoading]);



  /** -----------------------------------------
   * RENDER
   ------------------------------------------*/
  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2 -mt-10 border">
        <div className="flex items-center justify-center gap-3 bg-black p-1 rounded-full mx-auto max-w-[760px]">
          <div className="flex gap-2 items-center">
            <h2
              onClick={() => setActiveTab("code")}
              className={`cursor-pointer px-3 py-1 rounded-full ${
                activeTab === "code" ? "text-white bg-blue-500/25" : "text-gray-300"
              }`}
            >
              Code
            </h2>

            <h2
              onClick={() => setActiveTab("preview")}
              className={`cursor-pointer px-3 py-1 rounded-full ${
                activeTab === "preview" ? "text-white bg-blue-500/25" : "text-gray-300"
              }`}
            >
              Preview
            </h2>
          </div>

          {/* spacer */}
          <div className="flex-1" />

          {/* Download button */}
          <div className="flex items-center gap-2 pr-2">
            <button
              onClick={handleDownload}
              disabled={downloadLoading}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
            >
              {downloadLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
                    ></path>
                  </svg>
                  <span>Packaging...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 4a1 1 0 011-1h3v2H5v10h10V5h-2V3h3a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                    <path d="M9 7h2v6H9z" />
                  </svg>
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <SandpackProvider
        template="react"
        theme="dark"
        files={files}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
          // @ts-ignore
          showConsole: true,
        }}
        customSetup={{
          dependencies: {
            ...LOOKUP.DEPENDENCY,
          },
        }}
      >
        <SandpackLayout>
          {activeTab === "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "74vh" }} />
              <SandpackCodeEditor style={{ height: "74vh" }} />
            </>
          ) : (
            <SandpackPreview style={{ height: "74vh" }} showNavigator />
          )}
        </SandpackLayout>
      </SandpackProvider>

      {loading && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
          <Loader2Icon className="animate-spin w-10 h-10 text-white" />
          <p className="text-white mt-2 text-xl font-semibold">Generating code...</p>
        </div>
      )}
    </div>
  );
};

export default CodeView;

