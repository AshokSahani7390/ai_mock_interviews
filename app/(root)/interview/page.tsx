import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import React from "react";

const CreateInterviewPage = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto py-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Create a New Mock Interview</h2>
        <p className="text-neutral-400">
          Speak with our AI Assistant to personalize your job role, tech stack, and difficulty level.
        </p>
      </div>

      <Agent
        userName={user?.name || "Candidate"}
        userId={user?.id || "user1"}
        type="generate"
      />
    </div>
  );
};

export default CreateInterviewPage;