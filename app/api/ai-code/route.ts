import { GenAICode } from "@/configs/AIModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { prompt } = await req.json();
  try {
    const result = await GenAICode.sendMessage(prompt);
    const res = result.response.text();
    return NextResponse.json(JSON.parse(res));
  } catch (error){
    console.log('error',error)
    return NextResponse.json({ error: "error sending message",errorDetail:error });
  }
}
