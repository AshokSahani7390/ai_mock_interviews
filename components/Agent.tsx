"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, Award, BarChart3, RotateCcw, Home, Sparkles } from "lucide-react";
import Link from "next/link";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface FeedbackData {
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage: SavedMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error("Vapi Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }
  }, [messages]);

  const generateFeedbackReport = async (transcriptMessages: SavedMessage[]) => {
    setIsGeneratingFeedback(true);
    try {
      const messagesToAnalyze = transcriptMessages.length > 0 
        ? transcriptMessages 
        : [
            { role: "assistant" as const, content: "Hello! Tell me about yourself and your background." },
            { role: "user" as const, content: `I am ${userName}. I participated in this mock interview.` }
          ];

      const res = await createFeedback({
        interviewId: interviewId || `interview-${Date.now()}`,
        userId: userId || "user-1",
        transcript: messagesToAnalyze,
        feedbackId,
      });

      if (res?.success && res.feedback) {
        setFeedbackData(res.feedback as FeedbackData);
        toast.success("Interview summary & feedback generated successfully!");
      } else {
        toast.info("Interview concluded. Thank you for practicing!");
      }
    } catch (err) {
      console.error("Failed to generate feedback:", err);
      toast.error("Could not generate summary report.");
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    setFeedbackData(null);

    try {
      if (!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN) {
        toast.error("Please add NEXT_PUBLIC_VAPI_WEB_TOKEN to your .env.local file");
        setCallStatus(CallStatus.INACTIVE);
        return;
      }

      if (type === "generate") {
        const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
        if (!workflowId) {
          toast.error("Please add NEXT_PUBLIC_VAPI_WORKFLOW_ID to your .env.local file");
          setCallStatus(CallStatus.INACTIVE);
          return;
        }

        await vapi.start(workflowId, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        const interviewerAssistantId = process.env.NEXT_PUBLIC_VAPI_INTERVIEWER_ID;

        if (interviewerAssistantId) {
          await vapi.start(interviewerAssistantId, {
            variableValues: {
              questions: formattedQuestions,
            },
          });
        } else {
          await vapi.start(interviewer, {
            variableValues: {
              questions: formattedQuestions,
            },
          });
        }
      }
    } catch (err: any) {
      console.error("Vapi call error:", err);
      toast.error(err?.message || "Failed to start call");
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    try {
      vapi.stop();
    } catch (e) {
      console.error("Error stopping vapi:", e);
    }
    await generateFeedbackReport(messages);
  };

  const restartInterview = () => {
    setCallStatus(CallStatus.INACTIVE);
    setFeedbackData(null);
    setMessages([]);
    setLastMessage("");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto gap-8 my-6">
      {/* Active Call / Video Avatar View */}
      <div className="call-view w-full">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="AI Interviewer"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/candidate-avatar.jpg"
              alt="Candidate"
              width={120}
              height={120}
              className="rounded-full object-cover size-[120px] shadow-lg border-2 border-primary-100/30"
              priority
              unoptimized
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {/* Live Transcript Display */}
      {messages.length > 0 && !feedbackData && (
        <div className="transcript-border w-full">
          <div className="transcript max-h-48 overflow-y-auto">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0 text-gray-200",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons (Call / End) */}
      {!feedbackData && (
        <div className="w-full flex justify-center">
          {callStatus !== CallStatus.ACTIVE ? (
            <button
              className="relative btn-call flex items-center justify-center cursor-pointer"
              onClick={handleCall}
              disabled={isGeneratingFeedback}
            >
              <span
                className={cn(
                  "absolute animate-ping rounded-full opacity-75",
                  callStatus !== CallStatus.CONNECTING && "hidden"
                )}
              />
              <span className="relative font-semibold">
                {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED
                  ? "Start Call"
                  : ". . ."}
              </span>
            </button>
          ) : (
            <button
              className="btn-disconnect cursor-pointer font-semibold px-8 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg"
              onClick={handleDisconnect}
            >
              End Interview & View Summary
            </button>
          )}
        </div>
      )}

      {/* Loading State for AI Summary */}
      {isGeneratingFeedback && (
        <div className="w-full p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center flex flex-col items-center gap-4 animate-pulse">
          <Sparkles className="size-10 text-primary-100 animate-spin" />
          <h3 className="text-xl font-bold text-white">Analyzing Your Interview...</h3>
          <p className="text-neutral-400 text-sm max-w-md">
            Our AI engine is evaluating your answers across communication, technical depth, problem-solving, and confidence.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Professional Interview Summary & Feedback Card */}
      {/* ========================================================================= */}
      {feedbackData && (
        <div className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-2xl animate-fadeIn">
          {/* Header & Overall Score */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 text-primary-100 mb-1">
                <Award className="size-6" />
                <span className="text-sm font-semibold uppercase tracking-wider">Interview Performance Report</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Executive Evaluation Summary</h2>
            </div>

            <div className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 px-6 py-4 rounded-2xl">
              <div className="text-right">
                <p className="text-xs text-neutral-400 uppercase font-medium">Overall Score</p>
                <p className="text-3xl font-extrabold text-primary-100">
                  {feedbackData.totalScore}<span className="text-lg text-neutral-400 font-normal">/100</span>
                </p>
              </div>
              <div className="h-10 w-px bg-neutral-700" />
              <div className="text-center">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase",
                    feedbackData.totalScore >= 80
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : feedbackData.totalScore >= 60
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  )}
                >
                  {feedbackData.totalScore >= 80 ? "Pass" : feedbackData.totalScore >= 60 ? "Average" : "Needs Work"}
                </span>
              </div>
            </div>
          </div>

          {/* Category Scores Grid */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="size-5 text-primary-100" /> Category Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbackData.categoryScores?.map((cat, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-xl flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-neutral-200">{cat.name}</span>
                    <span className="text-sm font-bold text-primary-100">{cat.score}%</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary-100 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(cat.score, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">{cat.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Areas for Improvement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-5 flex flex-col gap-3">
              <h4 className="text-emerald-400 font-bold flex items-center gap-2 text-sm uppercase tracking-wide">
                <CheckCircle2 className="size-4" /> Key Strengths
              </h4>
              <ul className="space-y-2">
                {feedbackData.strengths?.map((str, i) => (
                  <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-5 flex flex-col gap-3">
              <h4 className="text-amber-400 font-bold flex items-center gap-2 text-sm uppercase tracking-wide">
                <AlertCircle className="size-4" /> Areas for Improvement
              </h4>
              <ul className="space-y-2">
                {feedbackData.areasForImprovement?.map((area, i) => (
                  <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Final Assessment */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 flex flex-col gap-2">
            <h4 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Final Assessment & Recommendation</h4>
            <p className="text-sm text-neutral-300 leading-relaxed">{feedbackData.finalAssessment}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-800">
            <button
              onClick={restartInterview}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="size-4" /> Retake Interview
            </button>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {interviewId && (
                <Link
                  href={`/interview/${interviewId}/feedback`}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors text-center"
                >
                  View Saved Report
                </Link>
              )}
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary-100 hover:bg-primary-200 text-neutral-950 text-sm font-bold flex items-center justify-center gap-2 transition-colors text-center"
              >
                <Home className="size-4" /> Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agent;
