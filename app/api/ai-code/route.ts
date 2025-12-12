




import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { GenAICode } from "@/configs/AIModel";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Call your AI model helper. Ensure GenAICode.sendMessage exists and returns a response with .response.text()
    const result = await GenAICode.sendMessage(prompt);
    const raw = await result.response.text();

    // Many AI SDKs return stringified JSON payloads; attempt parse safely.
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      // If it's not JSON, return text as `message`.
      console.warn("AI returned non-JSON response; returning raw text.");
      return NextResponse.json({ files: {}, message: raw });
    }

    // Normalize shape: prefer parsed.files and parsed.tokensUsed
    const files = parsed.files ?? parsed.fileData ?? {};
    const tokensUsed = parsed.tokensUsed ?? parsed.tokenUsed ?? 4000;

    return NextResponse.json({ files, tokensUsed });
  } catch (err: unknown) {
    console.error("API /ai-code error:", err);
    // Send a safe error message
    return NextResponse.json(
      { error: "Failed to generate AI code", detail: String(err) },
      { status: 500 }
    );
  }
}

