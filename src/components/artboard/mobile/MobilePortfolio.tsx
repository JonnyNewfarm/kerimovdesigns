"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import type { InfiniteProject } from "../infinite-projects/types";
import SitePreloader from "../scene/SitePreloader";
import ScrollSection from "@/components/SmoothScroll";

type Props = {
  projects: InfiniteProject[];
};

const ease = [0.16, 1, 0.3, 1] as const;

const services = [
  {
    title: "Visual Identities",
    src: "/visual-identity.jpg",
    type: "image",
    description:
      "Building distinctive visual systems that give brands a clear and recognizable voice. From typography and color to composition and visual direction.",
  },
  {
    title: "Logo Design",
    src: "/logo-design.jpg",
    type: "image",
    description:
      "Creating memorable marks that turn ideas into recognizable visual signatures through shape, proportion and typography.",
  },
  {
    title: "Art Direction",
    src: "/art-direction.jpg",
    type: "image",
    description:
      "Shaping visual experiences through a clear creative perspective, connecting imagery, typography and composition.",
  },
  {
    title: "Motion & Animation",
    src: "/bylarm-new.mp4",
    type: "video",
    description:
      "Bringing graphic design to life through movement, rhythm and timing. Exploring how motion adds character and energy to visual communication.",
  },
  {
    title: "Editorial Design",
    src: "/editorial-design.jpg",
    type: "image",
    description:
      "Exploring the relationship between typography, imagery and space to create expressive editorial layouts.",
  },
] as const;

const LINKEDIN_URL = "https://www.linkedin.com/in/rustam-kerimov-75bb5a331/";
const INSTAGRAM_URL = "https://www.instagram.com/kerimov.designs/";
const EMAIL_ADDRESS = "rustam-98@hotmail.com";

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

function getProjectId(path: string) {
  const match = path.match(/^\/project\/([^/]+)$/);

  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

function mediaForProject(project: InfiniteProject) {
  return Array.from(
    new Set(
      [project.src, ...(project.images ?? [])].filter(
        (src): src is string => typeof src === "string" && !!src.trim(),
      ),
    ),
  );
}

function RevealText({
  text,
  delay = 0,
  stagger = 0.045,
  className = "",
}: {
  text: string;
  delay?: number;
  stagger?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion() ?? false;

  const pieces = text.match(/\S+|\s+/g) ?? [];

  return (
    <motion.span
      className={`block whitespace-pre-line ${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: reducedMotion ? 0 : delay,
            staggerChildren: reducedMotion ? 0 : stagger,
          },
        },
      }}
    >
      {pieces.map((part, index) =>
        /^\s+$/.test(part) ? (
          <span key={index}>{part}</span>
        ) : (
          <span
            key={index}
            className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]"
          >
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: reducedMotion
                  ? {
                      opacity: 0,
                    }
                  : {
                      y: "115%",
                      opacity: 0,
                      filter: "blur(3px)",
                    },
                visible: reducedMotion
                  ? {
                      opacity: 1,
                      transition: {
                        duration: 0.2,
                      },
                    }
                  : {
                      y: "0%",
                      opacity: 1,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.75,
                        ease,
                      },
                    },
              }}
            >
              {part}
            </motion.span>
          </span>
        ),
      )}
    </motion.span>
  );
}

function MobileLink({
  href,
  navigate,
  children,
  className = "",
  ariaLabel,
}: {
  href: string;
  navigate: (path: string) => void;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={className}
      onClick={(event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        event.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}

function MobileFooter() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCopyStatus("idle");
    }, 2200);
  };

  const linkClass = "transition-opacity duration-300 hover:opacity-50";

  return (
    <footer
      className="
        grid
        grid-cols-2
        items-start
        gap-x-5
        gap-y-16
        pb-8
        pt-16
        text-[15px]
        font-medium
        leading-[1.3]
        tracking-[-0.025em]
      "
    >
      {/* CONNECT — TOP LEFT */}
      <div className="flex min-w-0 flex-col items-start">
        <button
          type="button"
          onClick={copyEmail}
          className={`${linkClass} cursor-pointer text-left`}
        >
          <span aria-live="polite">
            {copyStatus === "copied"
              ? "Copied!"
              : copyStatus === "error"
                ? "Copy failed"
                : "Copy Email"}
          </span>
        </button>

        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          LinkedIn
        </a>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Instagram
        </a>
      </div>

      {/* NAVIGATION — TOP RIGHT */}
      <nav
        aria-label="Footer navigation"
        className="flex min-w-0 flex-col items-end"
      >
        <a href="/" className={linkClass}>
          Home
        </a>

        <a href="/services" className={linkClass}>
          Services
        </a>
      </nav>

      {/* COPYRIGHT — BOTTOM LEFT */}
      <div className="min-w-0 self-end">
        <p className="text-[12px] leading-[1.3]">
          © {new Date().getFullYear()} Rustam Kerimov
        </p>
      </div>

      {/* CREDITS — BOTTOM RIGHT */}
      <div className="min-w-0 self-end text-right">
        <p>Design &amp; Dev:</p>

        <a
          href="https://www.jonasnygaard.com"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Jonas Nygaard
        </a>
      </div>
    </footer>
  );
}

function ProjectGrid({
  projects,
  navigate,
}: {
  projects: InfiniteProject[];
  navigate: (path: string) => void;
}) {
  return (
    <section aria-labelledby="mobile-selected-work" className="pb-16">
      <h2
        id="mobile-selected-work"
        className="mb-5 font-bueno text-[16px] font-bold  leading-none tracking-[-0.025em]"
      >
        Selected Work
      </h2>

      <div className="grid grid-cols-2 items-start gap-x-3 gap-y-8">
        {projects.map((project) => (
          <MobileLink
            key={String(project.id)}
            href={`/project/${encodeURIComponent(String(project.id))}`}
            navigate={navigate}
            ariaLabel={`View ${project.title}`}
            className="group block min-w-0 outline-offset-4"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1e211b]">
              <img
                src={project.src}
                alt={project.title}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            <h3 className="mt-2.5 font-bueno text-[12px] font-medium uppercase leading-[1.25] sm:text-[14px]">
              {project.title}
            </h3>
          </MobileLink>
        ))}
      </div>
    </section>
  );
}

function MobileHome({
  projects,
  navigate,
}: {
  projects: InfiniteProject[];
  navigate: (path: string) => void;
}) {
  return (
    <>
      <section className="pt-5 sm:pt-15">
        <h1 className="mt-10 w-full text-2xl sm:text-3xl font-medium leading-[1.3] tracking-[-0.01em]">
          <RevealText
            text="Graphic Designer Crafting Visual Identities, Typography and Motion."
            delay={0.12}
            stagger={0.045}
          />
        </h1>

        <p className="mt-10 w-full text-2xl sm:text-3xl font-medium leading-[1.3] tracking-[-0.01em]">
          <RevealText
            text="Take a look at my selected projects below to see what I've been working on. I'm always open to new projects, fresh ideas and creative collaborations, so feel free to get in touch."
            delay={0.12}
            stagger={0.045}
          />
        </p>
      </section>

      <div className="mt-16 sm:mt-20">
        <ProjectGrid projects={projects} navigate={navigate} />
      </div>
    </>
  );
}

function MobileProject({ project }: { project: InfiniteProject }) {
  const images = mediaForProject(project);

  const tags = project.tags?.filter((tag) => tag.trim()) ?? [];

  return (
    <article className="pb-16 pt-14">
      <header className="mb-10">
        <h1 className="max-w-[580px] font-bueno text-[clamp(31px,8vw,54px)] font-bold uppercase leading-[1.02] tracking-[-0.035em]">
          <RevealText text={project.title} delay={0.08} stagger={0.05} />
        </h1>

        {tags.length > 0 && (
          <p className="mt-5 font-sans text-[10px] font-medium uppercase leading-[1.6] tracking-[0.1em] text-[#e7e3dd]/90">
            {tags.join(" / ")}
          </p>
        )}
      </header>

      <div className="space-y-3">
        {images.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`${project.title} — work ${index + 1}`}
            className="block h-auto w-full bg-[#1e211b]"
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}

        {project.srcVideo?.trim() && (
          <video
            className="pointer-events-none block h-auto w-full bg-black"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-label={`${project.title} video`}
          >
            <source src={project.srcVideo} />
          </video>
        )}
      </div>

      {(project.description?.trim() ||
        project.type?.trim() ||
        project.tools?.trim()) && (
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-9 border-t border-[#e7e3dd]/20 pt-7">
          {project.description?.trim() && (
            <div className="col-span-2">
              <p className="mb-3  text-[12px]  tracking-[0.14em] text-[#e7e3dd]">
                About the project
              </p>

              <p className="whitespace-pre-line  text-[19px] leading-[1.45] text-[#e7e3dd]">
                {project.description}
              </p>
            </div>
          )}

          {project.type?.trim() && (
            <div>
              <p className="mb-2 font-sans text-[10px]  tracking-[0.14em] text-[#e7e3dd]/90">
                Year:
              </p>

              <p className="font-bueno text-[16px]">{project.type}</p>
            </div>
          )}

          {project.tools?.trim() && (
            <div>
              <p className="mb-2 font-sans text-[10px]  tracking-[0.14em] text-[#e7e3dd]/90">
                Tools:
              </p>

              <p className="whitespace-pre-line font-bueno text-[16px] leading-[1.4]">
                {project.tools}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function MobileAbout() {
  return (
    <article className="pb-16">
      <section className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="relative h-[75svh] min-h-[430px] max-h-[820px]">
          <img
            src="/rk-about.jpg"
            alt="Portrait of Rustam Kerimov"
            className="absolute inset-0 h-full w-full object-cover object-center"
            decoding="async"
          />

          <h1
            className="
              absolute bottom-[-0.52em] left-[5%] z-10
              font-bueno text-2xl
              font-bold uppercase leading-[0.85]
              tracking-[-0.045em] text-[#e7e3dd]
            "
          >
            <RevealText
              text={"Behind\nThe Work."}
              delay={0.2}
              stagger={0.12}
            />{" "}
          </h1>
        </div>
      </section>

      <div className="pt-[clamp(105px,22vw,150px)]">
        <div className="max-w-[500px] space-y-7  text-[clamp(19px,5vw,24px)] leading-[1.4] text-[#e7e3dd]/90">
          <p>
            A graphic designer exploring visual identities, typography and
            motion.
          </p>

          <p className="text-[#e7e3dd]//90">
            Creating distinctive visual experiences across branding, editorial
            design, art direction and animation.
          </p>
        </div>

        <p className="mt-12 font-sans text-[11px] uppercase tracking-[0.1em] text-[#e7e3dd]/90">
          Oslo, Norway / Age: 27
        </p>
      </div>

      <section className="mt-24">
        <h2 className="mb-12 font-bueno text-lg font-bold  leading-none tracking-[-0.035em]">
          Services:
        </h2>

        <div className="space-y-20">
          {services.map((service) => (
            <section key={service.title}>
              <h3 className="mb-5 font-bueno text-xl font-bold uppercase leading-[1.05] tracking-[-0.025em]">
                {service.title}
              </h3>

              <div className="w-full overflow-hidden bg-[#1e211b]">
                {service.type === "video" ? (
                  <video
                    className="pointer-events-none block h-auto w-full"
                    src={service.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                    aria-label={service.title}
                  />
                ) : (
                  <img
                    src={service.src}
                    alt={service.title}
                    className="block h-auto w-full"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>

              <p className="mt-6 max-w-[490px] font-bueno text-[clamp(17px,4.5vw,21px)] leading-[1.45] text-[#e7e3dd]/90">
                {service.description}
              </p>
            </section>
          ))}
        </div>
      </section>
    </article>
  );
}

export default function MobilePortfolio({ projects }: Props) {
  const pathname = usePathname();

  const [path, setPath] = useState(() => normalizePath(pathname));

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.style.overflow = "auto";
    body.style.overflow = "auto";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  useEffect(() => {
    setPath(normalizePath(pathname));
  }, [pathname]);

  useEffect(() => {
    const onPopState = () => {
      setPath(normalizePath(window.location.pathname));
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const navigate = useCallback((nextPath: string) => {
    const next = normalizePath(nextPath);

    if (normalizePath(window.location.pathname) !== next) {
      window.history.pushState(null, "", next);
    }

    setPath(next);
    window.scrollTo(0, 0);

    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  const isAbout = path === "/about";
  const projectId = getProjectId(path);

  const project =
    projectId === null
      ? null
      : (projects.find((item) => String(item.id) === projectId) ?? null);

  const isHome = !isAbout && projectId === null;

  const content = (
    <div
      className="
        relative
        min-h-svh
        w-full
        overflow-x-clip
        bg-[#0b0c09]
        text-[#e7e3dd]
      "
    >
      <div className={`w-full px-[5%] ${isAbout ? "pt-0" : "pt-[72px]"}`}>
        <main key={path}>
          {isHome ? (
            <MobileHome projects={projects} navigate={navigate} />
          ) : isAbout ? (
            <MobileAbout />
          ) : project ? (
            <MobileProject project={project} />
          ) : (
            <div className="py-24">
              <h1 className="font-bueno text-3xl font-bold uppercase">
                Project not found
              </h1>

              <button
                type="button"
                className="mt-6 underline"
                onClick={() => navigate("/")}
              >
                Back to work
              </button>
            </div>
          )}
        </main>

        <MobileFooter />
      </div>
    </div>
  );

  return (
    <>
      <SitePreloader threeReady={true} />

      {isHome ? <ScrollSection>{content}</ScrollSection> : content}
    </>
  );
}
