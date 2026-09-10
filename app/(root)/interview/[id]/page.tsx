import Agent from "@/components/Agent";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById } from "@/lib/actions/general.action";
import { getRandomInterviewCover } from "@/lib/utils";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const InterviewSessionPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const user = await getCurrentUser();
  const interview = await getInterviewById(id);

  if (!interview) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-6">
      {/* Header Info */}
      <div className="card-border w-full">
        <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={interview.coverImage || getRandomInterviewCover()}
              alt="Interview Cover"
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-white capitalize">
                {interview.role} Mock Interview
              </h2>
              <p className="text-sm text-neutral-400 capitalize">
                Level: <span className="text-primary-100 font-semibold">{interview.level}</span> • Type:{" "}
                <span className="text-primary-100 font-semibold">{interview.type}</span>
              </p>
            </div>
          </div>
          <DisplayTechIcons techStack={interview.techstack} />
        </div>
      </div>

      {/* Voice Agent Mock Interviewer */}
      <Agent
        userName={user?.name || "Candidate"}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
      />
    </div>
  );
};

export default InterviewSessionPage;
