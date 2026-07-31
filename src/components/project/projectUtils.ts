import type {
  ImageLayout,
  Project,
} from "./projectTypes";

export const imageLayouts: ImageLayout[] = [
  {
    row: "justify-start",
    offset:
      "translate-x-0 sm:translate-x-10 lg:translate-x-20",
    size: "max-w-[280px] sm:max-w-[360px] lg:max-w-[560px] xl:max-w-[640px]",
  },
  {
    row: "justify-end",
    offset:
      "translate-x-0 sm:-translate-x-12 lg:-translate-x-32",
    size: "max-w-[240px] sm:max-w-[330px] lg:max-w-[390px]",
  },
  {
    row: "justify-center",
    offset:
      "translate-x-0 sm:-translate-x-24 lg:-translate-x-40",
    size: "max-w-[260px] sm:max-w-[350px] lg:max-w-[420px]",
  },
  {
    row: "justify-end",
    offset:
      "translate-x-0 sm:-translate-x-4 lg:-translate-x-16",
    size: "max-w-[300px] sm:max-w-[380px] lg:max-w-[460px]",
  },
  {
    row: "justify-start",
    offset:
      "translate-x-0 sm:translate-x-32 lg:translate-x-56",
    size: "max-w-[230px] sm:max-w-[320px] lg:max-w-[380px]",
  },
  {
    row: "justify-center",
    offset:
      "translate-x-0 sm:translate-x-24 lg:translate-x-44",
    size: "max-w-[270px] sm:max-w-[360px] lg:max-w-[440px]",
  },
  {
    row: "justify-start",
    offset:
      "translate-x-0 sm:translate-x-4 lg:translate-x-24",
    size: "max-w-[250px] sm:max-w-[340px] lg:max-w-[400px]",
  },
  {
    row: "justify-end",
    offset:
      "translate-x-0 sm:-translate-x-20 lg:-translate-x-48",
    size: "max-w-[280px] sm:max-w-[370px] lg:max-w-[430px]",
  },
  {
    row: "justify-center",
    offset:
      "translate-x-0 sm:translate-x-8 lg:translate-x-16",
    size: "max-w-[240px] sm:max-w-[330px] lg:max-w-[390px]",
  },
];

export const getProjectImages = (
  project: Project,
): string[] => {
  return [
    project.src,
    project.src2,
    project.src3,
    project.src4,
    project.src5,
    project.src6,
    project.src7,
    project.src8,
    project.src9,
  ].filter((src): src is string => Boolean(src));
};

export const getTitleLines = (title: string) => {
  const words = title
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length <= 1) {
    return title;
  }

  if (words.length === 2) {
    return `${words[0]}\n${words[1]}`;
  }

  if (words.length === 3) {
    return `${words[0]}\n${words[1]}\n${words[2]}`;
  }

  const firstLineCount = Math.ceil(words.length / 2);

  return `${words
    .slice(0, firstLineCount)
    .join(" ")}\n${words
    .slice(firstLineCount)
    .join(" ")}`;
};

export const getProjectTags = (
  tags?: string | string[] | null,
): string[] => {
  if (!tags) {
    return [];
  }

  const parsedTags = Array.isArray(tags)
    ? tags
    : tags.split(",");

  return parsedTags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter(
      (tag, index, allTags) =>
        allTags.indexOf(tag) === index,
    );
};

export const formatProjectTag = (tag: string) => {
  return tag.replaceAll("-", " ");
};

export const formatCount = (count: number) => {
  return String(count).padStart(2, "0");
};