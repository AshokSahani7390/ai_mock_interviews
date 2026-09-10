import { db } from "@/firebase/admin";
import { getLLMModel } from "@/lib/ai";
import { getRandomInterviewCover } from "@/lib/utils";
import { generateText } from "ai";

export async function GET() {
  return Response.json({ success: true, data: "THANK YOU!" }, { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { type, role, level, techstack, amount } = body;
  const user_id = body.userid || body.userId || "candidate-user";
  const numAmount = parseInt(String(amount || 5), 10) || 5;

  try {
    const { text: rawQuestions } = await generateText({
      model: getLLMModel(),
      prompt: `Prepare ${numAmount} realistic job interview questions.
        The job role is: ${role}.
        The job experience level is: ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        
        Guidelines:
        - The questions will be read by a voice assistant, so do not include special characters like "/", "*", or markdown symbols.
        - Return ONLY a valid JSON array of strings containing the questions.
        - Example format: ["Tell me about a challenging project you worked on.", "How do you handle state management in React?"]
      `,
    });

    // Clean JSON response if wrapped in markdown code blocks
    const cleaned = rawQuestions
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsedQuestions: string[] = [];
    try {
      parsedQuestions = JSON.parse(cleaned);
    } catch {
      // Fallback line split if JSON parse fails
      parsedQuestions = cleaned
        .split("\n")
        .map((q) => q.replace(/^\d+[\.\)]\s*/, "").replace(/^["'\[\]]+|["'\[\],]+$/g, "").trim())
        .filter((q) => q.length > 0);
    }

    const interview = {
      role: role || "Software Engineer",
      type: type || "Mixed",
      level: level || "Mid",
      techstack: Array.isArray(techstack) ? techstack : (techstack || "").split(",").map((s: string) => s.trim()).filter(Boolean),
      questions: parsedQuestions,
      userId: user_id,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interview);

    return Response.json({ success: true, id: docRef.id, interview }, { status: 200 });
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}