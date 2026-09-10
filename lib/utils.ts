import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

export const normalizeTechName = (tech: string) => {
  if (!tech) return "";
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings] || key;
};

export const getTechLogos = (techArray?: string[]) => {
  if (!techArray || !Array.isArray(techArray)) return [];

  return techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: normalized
        ? `${techIconBaseURL}/${normalized}/${normalized}-original.svg`
        : "/tech.svg",
    };
  });
};

/**
 * Deterministically returns a cover image based on an ID/role seed
 * to avoid server/client hydration mismatches caused by Math.random().
 */
export const getRandomInterviewCover = (seed?: string) => {
  if (!seed) return `/covers${interviewCovers[0]}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % interviewCovers.length;
  return `/covers${interviewCovers[index]}`;
};
