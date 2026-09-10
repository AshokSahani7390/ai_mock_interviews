import DisplayTechIcons from "@/components/DisplayTechIcons";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/general.action";
import { cn, getRandomInterviewCover } from "@/lib/utils";
import { AlertCircle, Award, BarChart3, CheckCircle2, Home, RotateCcw, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import dayjs from "dayjs";

interface FeedbackPageProps {
  params: Promise<{ id: string }>;
}

const InterviewFeedbackPage = async ({ params }: FeedbackPageProps) => {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const interview = await getInterviewById(id);
  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  if (!interview && !feedback) {
    redirect("/");
  }

  const roleTitle = interview?.role || "Software Engineer";
  const formattedDate = dayjs(feedback?.createdAt || interview?.createdAt || Date.now()).format("MMMM D, YYYY");

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-8 px-4">
      {/* Header Banner */}
      <div className="card-border w-full">
        <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={interview?.coverImage || getRandomInterviewCover()}
              alt="Interview Cover"
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2 text-primary-100 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="size-4" /> Performance Evaluation
              </div>
              <h2 className="text-2xl font-bold text-white capitalize">
                {roleTitle} Interview Feedback
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Taken on {formattedDate}
              </p>
            </div>
          </div>
          {interview?.techstack && <DisplayTechIcons techStack={interview.techstack} />}
        </div>
      </div>

      {feedback ? (
        <div className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-8 shadow-2xl">
          {/* Overall Score Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 text-primary-100 mb-1">
                <Award className="size-6" />
                <span className="text-sm font-semibold uppercase tracking-wider">Overall Score</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">Executive Candidate Evaluation</h3>
            </div>

            <div className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 px-6 py-4 rounded-2xl">
              <div className="text-right">
                <p className="text-xs text-neutral-400 uppercase font-medium">Final Rating</p>
                <p className="text-3xl font-extrabold text-primary-100">
                  {feedback.totalScore}<span className="text-lg text-neutral-400 font-normal">/100</span>
                </p>
              </div>
              <div className="h-10 w-px bg-neutral-700" />
              <div className="text-center">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase",
                    feedback.totalScore >= 80
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : feedback.totalScore >= 60
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  )}
                >
                  {feedback.totalScore >= 80 ? "Pass" : feedback.totalScore >= 60 ? "Average" : "Needs Work"}
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
              {feedback.categoryScores?.map((cat, idx) => (
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
                {feedback.strengths?.map((str, i) => (
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
                {feedback.areasForImprovement?.map((area, i) => (
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
            <p className="text-sm text-neutral-300 leading-relaxed">{feedback.finalAssessment}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-800">
            <Link
              href={`/interview/${id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="size-4" /> Retake This Interview
            </Link>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Link
                href="/interview"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Create New Interview
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary-100 hover:bg-primary-200 text-neutral-950 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="size-4" /> Dashboard
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-border w-full text-center p-12 flex flex-col items-center gap-4">
          <p className="text-neutral-400">No feedback report recorded for this interview yet.</p>
          <Link href={`/interview/${id}`} className="btn-primary">
            Start This Interview Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default InterviewFeedbackPage;
