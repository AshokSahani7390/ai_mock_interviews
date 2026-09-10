import { cn, getTechLogos } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const DisplayTechIcons = ({ techStack }: TechIconProps) => {
  const safeTechStack = Array.isArray(techStack)
    ? techStack
    : typeof techStack === "string"
    ? (techStack as string).split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const techIcons = getTechLogos(safeTechStack);

  if (!techIcons || techIcons.length === 0) {
    return <div className="flex flex-row" />;
  }

  return (
    <div className="flex flex-row items-center">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={`${tech}-${index}`}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2 text-center flex items-center justify-center",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="tech-tooltip">{tech}</span>
          <Image
            src={url}
            alt={tech}
            width={20}
            height={20}
            className="size-5 object-contain"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;