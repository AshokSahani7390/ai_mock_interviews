import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HomePage = async () => {
  const user = await getCurrentUser();
  const userId = user?.id || "user1";

  const userInterviews = await getInterviewsByUserId(userId);
  const latestInterviews = await getLatestInterviews({ userId });

  const hasUserInterviews = userInterviews && userInterviews.length > 0;
  const hasLatestInterviews = latestInterviews && latestInterviews.length > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real-world interview questions with our voice AI and get instant scoring and feedback reports.
          </p>
          <Button asChild className="btn-primary max-sm:full">
            <Link href="/interview">Create / Start an Interview</Link>
          </Button>
        </div>
        <Image src="/robot.png" alt="robo-dude" width={400} height={400} className="max-sm:hidden" />
      </section>

      {/* User's Created / Completed Interviews */}
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews & History</h2>
        <div className="interviews-section">
          {hasUserInterviews ? (
            userInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                userId={userId}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            dummyInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                userId={userId}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          )}
        </div>
      </section>

      {/* Explore / Practice Available Interviews */}
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Community Interviews</h2>
        <div className="interviews-section">
          {hasLatestInterviews ? (
            latestInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                userId={userId}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            dummyInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                userId={userId}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;
