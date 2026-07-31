export const PROJECTS_PER_VIEW = 5;

export const projectsEase = [0.22, 1, 0.36, 1] as const;

export const formatProjectTag = (tag: string) => {
  return tag.replaceAll("-", " ");
};