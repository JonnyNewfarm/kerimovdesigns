"use client";

import Image from "next/image";
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import TextReveal from "./TextReveal";
import TransitionLink from "./TransitionLink";

type AnimationProject = {
  title: string;
  heading: string;
  type: string;
  description: string;
  href: string;
  hoverText: string;
  cursorClass: string;
  video?: string;
  images?: string[];
};

const animations: AnimationProject[] = [
  {
    title: "Echo festival",
    heading: "Moving graphics",
    type: "Animated graphics",
    description:
      "A high-energy visual piece built around movement, contrast and bold screen composition.",
    video: "/echo-new.mp4",
    href: "/project/692fa8ade953917a4953f016",
    hoverText: "View case",
    cursorClass: "text-[#c8dde6]",
  },
  {
    title: "Drømmenes Melodi",
    heading: "Visual identity",
    type: "Visual identity",
    description:
      "A visual identity direction shaped through strong graphic contrast, clean composition and bold image pairing.",
    images: ["/visual-01.jpeg", "/visual-02.jpeg"],
    href: "/project/69300cd7a94f6af6c6b7d9d8",
    hoverText: "View case",
    cursorClass: "text-[#34294a]",
  },
];

type CursorState = {
  text: string;
  className: string;
  visible: boolean;
};

const INITIAL_CURSOR_STATE: CursorState = {
  text: "",
  className: "text-white",
  visible: false,
};

function useDesktopMediaQuery() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const updateDesktopState = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateDesktopState();

    mediaQuery.addEventListener("change", updateDesktopState);

    return () => {
      mediaQuery.removeEventListener("change", updateDesktopState);
    };
  }, []);

  return isDesktop;
}

function useViewportVideo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;

    if (!container || !video) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {
            // Autoplay may be blocked by the browser.
          });

          return;
        }

        video.pause();
      },
      {
        rootMargin: "150px 0px",
        threshold: 0.05,
      },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  return {
    containerRef,
    videoRef,
  };
}

type CustomCursorProps = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  cursorState: CursorState;
};

const CustomCursor = memo(function CustomCursor({
  x,
  y,
  cursorState,
}: CustomCursorProps) {
  const cursorX = useSpring(x, {
    stiffness: 180,
    damping: 22,
    mass: 0.4,
  });

  const cursorY = useSpring(y, {
    stiffness: 180,
    damping: 22,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: cursorX,
        y: cursorY,
      }}
      animate={{
        opacity: cursorState.visible ? 1 : 0,
        scale: cursorState.visible ? 1 : 0.35,
      }}
      transition={{
        opacity: {
          duration: 0.2,
          ease: "easeOut",
        },
        scale: {
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      className="
        pointer-events-none
        fixed
        left-0
        top-0
        z-[9999]
        hidden
        -translate-x-1/2
        -translate-y-1/2
        lg:flex
      "
    >
      <div
        className={`
          text-center
          text-[7vw]
          font-black
          uppercase
          leading-[0.78]
          tracking-[-0.035em]
          md:text-[5.8vw]
          lg:text-[4.8vw]
          ${cursorState.className}
        `}
      >
        {cursorState.text}
      </div>
    </motion.div>
  );
});

type ProjectMediaProps = {
  item: AnimationProject;
  index: number;
  onPointerEnter: (
    event: ReactPointerEvent<HTMLAnchorElement>,
    item: AnimationProject,
  ) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLAnchorElement>) => void;
  onPointerLeave: () => void;
};

const ProjectMedia = memo(function ProjectMedia({
  item,
  index,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
}: ProjectMediaProps) {
  const { containerRef, videoRef } = useViewportVideo();

  const sharedProps = {
    href: item.href,
    transitionLabel: item.title,
    "aria-label": `View ${item.title}`,
    "data-project-index": index,
    onPointerEnter: (event: ReactPointerEvent<HTMLAnchorElement>) =>
      onPointerEnter(event, item),
    onPointerMove,
    onPointerLeave,
  };

  if (item.video) {
    return (
      <div ref={containerRef}>
        <TransitionLink
          {...sharedProps}
          className="
            group
            relative
            block
            aspect-video
            w-full
            overflow-hidden
            bg-color/[0.04]
          "
        >
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-[1.03]
            "
            src={item.video}
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-dark/0
              transition-colors
              duration-500
              group-hover:bg-dark/10
            "
          />
        </TransitionLink>
      </div>
    );
  }

  return (
    <TransitionLink
      {...sharedProps}
      className="
        group
        relative
        grid
        aspect-video
        w-full
        grid-cols-2
        overflow-hidden
        bg-color/[0.04]
      "
    >
      {item.images?.map((image, imageIndex) => (
        <div
          key={image}
          className="
            relative
            h-full
            w-full
            overflow-hidden
          "
        >
          <Image
            fill
            src={image}
            alt={`${item.title} image ${imageIndex + 1}`}
            sizes="(max-width: 1024px) 50vw, 38vw"
            className="
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-[1.03]
            "
          />
        </div>
      ))}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-dark/0
          transition-colors
          duration-500
          group-hover:bg-dark/10
        "
      />
    </TransitionLink>
  );
});

type ProjectArticleProps = {
  item: AnimationProject;
  index: number;
  projectY: MotionValue<number>;
  isDesktop: boolean;
  onPointerEnter: (
    event: ReactPointerEvent<HTMLAnchorElement>,
    item: AnimationProject,
  ) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLAnchorElement>) => void;
  onPointerLeave: () => void;
};

const ProjectArticle = memo(function ProjectArticle({
  item,
  index,
  projectY,
  isDesktop,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
}: ProjectArticleProps) {
  return (
    <motion.article
      style={isDesktop ? { y: projectY } : undefined}
      className={`
        grid
        grid-cols-1
        gap-6
        ${index === 1 ? "lg:ml-auto lg:w-[75%]" : "lg:w-[78%]"}
      `}
    >
      <TextReveal
        as="h2"
        mode="words"
        delay={0.12}
        className="
          max-w-[1100px]
          text-[10vw]
          text-wrap
          font-black
          uppercase
          leading-[0.88]
          tracking-[-0.025em]
          md:text-[8vw]
          lg:text-[5.8vw]
        "
      >
        {item.heading}
      </TextReveal>

      <ProjectMedia
        item={item}
        index={index}
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      />

      <div
        className="
          grid
          grid-cols-1
          gap-5
          md:grid-cols-[0.45fr_1fr]
          md:items-start
        "
      >
        <div>
          <p
            className="
              mb-2
              text-[12px]
              font-black
              uppercase
              tracking-[0.22em]
              text-color/40
            "
          >
            {String(index + 1).padStart(2, "0")} / {item.type}
          </p>

          <h3
            className="
              text-[6vw]
              font-black
              uppercase
              leading-[0.86]
              tracking-[-0.04em]
              text-color
              md:text-[5vw]
              lg:text-[3.6vw]
            "
          >
            {item.title}
          </h3>
        </div>

        <p
          className="
            max-w-[620px]
            text-base
            font-bold
            leading-[1.35]
            text-color/55
            md:justify-self-end
            md:text-right
            md:text-lg
          "
        >
          {item.description}
        </p>
      </div>
    </motion.article>
  );
});

export default function AnimAndVisualDisplay() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const latestPointerRef = useRef({
    x: -9999,
    y: -9999,
  });

  const pointerFrameRef = useRef<number | null>(null);
  const scrollFrameRef = useRef<number | null>(null);

  const [cursorState, setCursorState] =
    useState<CursorState>(INITIAL_CURSOR_STATE);

  const isDesktop = useDesktopMediaQuery();

  const pointerX = useMotionValue(-9999);
  const pointerY = useMotionValue(-9999);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const firstY = useTransform(scrollYProgress, [0, 1], [-10, 20]);

  const secondY = useTransform(scrollYProgress, [0, 1], [15, -15]);

  const updatePointerPosition = useCallback(
    (clientX: number, clientY: number) => {
      latestPointerRef.current = {
        x: clientX,
        y: clientY,
      };

      if (pointerFrameRef.current !== null) {
        return;
      }

      pointerFrameRef.current = window.requestAnimationFrame(() => {
        pointerX.set(latestPointerRef.current.x);
        pointerY.set(latestPointerRef.current.y);

        pointerFrameRef.current = null;
      });
    },
    [pointerX, pointerY],
  );

  const hideCursor = useCallback(() => {
    setCursorState((currentState) => {
      if (!currentState.visible) {
        return currentState;
      }

      return {
        ...currentState,
        visible: false,
      };
    });
  }, []);

  const updateHoveredProjectAtPointer = useCallback(() => {
    if (!isDesktop) {
      return;
    }

    const { x, y } = latestPointerRef.current;

    const element = document.elementFromPoint(x, y);

    const projectElement = element?.closest(
      "[data-project-index]",
    ) as HTMLElement | null;

    if (!projectElement) {
      hideCursor();
      return;
    }

    const index = Number(projectElement.dataset.projectIndex);

    const item = animations[index];

    if (!item) {
      hideCursor();
      return;
    }

    setCursorState((currentState) => {
      if (
        currentState.visible &&
        currentState.text === item.hoverText &&
        currentState.className === item.cursorClass
      ) {
        return currentState;
      }

      return {
        text: item.hoverText,
        className: item.cursorClass,
        visible: true,
      };
    });
  }, [hideCursor, isDesktop]);

  useEffect(() => {
    if (!isDesktop) {
      hideCursor();
      return;
    }

    const handleWindowPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      updatePointerPosition(event.clientX, event.clientY);
    };

    const handleWindowScroll = () => {
      if (scrollFrameRef.current !== null) {
        return;
      }

      scrollFrameRef.current = window.requestAnimationFrame(() => {
        updateHoveredProjectAtPointer();
        scrollFrameRef.current = null;
      });
    };

    window.addEventListener("pointermove", handleWindowPointerMove, {
      passive: true,
    });

    window.addEventListener("scroll", handleWindowScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);

      window.removeEventListener("scroll", handleWindowScroll);

      if (pointerFrameRef.current !== null) {
        window.cancelAnimationFrame(pointerFrameRef.current);
      }

      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }

      pointerFrameRef.current = null;
      scrollFrameRef.current = null;
    };
  }, [
    hideCursor,
    isDesktop,
    updateHoveredProjectAtPointer,
    updatePointerPosition,
  ]);

  const handleProjectPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLAnchorElement>) => {
      if (!isDesktop || event.pointerType !== "mouse") {
        return;
      }

      updatePointerPosition(event.clientX, event.clientY);
    },
    [isDesktop, updatePointerPosition],
  );

  const handleProjectPointerEnter = useCallback(
    (event: ReactPointerEvent<HTMLAnchorElement>, item: AnimationProject) => {
      if (!isDesktop || event.pointerType !== "mouse") {
        return;
      }

      updatePointerPosition(event.clientX, event.clientY);

      setCursorState({
        text: item.hoverText,
        className: item.cursorClass,
        visible: true,
      });
    },
    [isDesktop, updatePointerPosition],
  );

  return (
    <section
      ref={sectionRef}
      className="
        relative
        w-full
        overflow-hidden
        bg-dark
        px-4
        py-24
        text-color
        md:px-10
        md:py-32
        lg:px-16
      "
    >
      <CustomCursor x={pointerX} y={pointerY} cursorState={cursorState} />

      <div className="mx-auto w-full max-w-[1800px]">
        <div className="flex flex-col gap-32 lg:gap-48">
          <ProjectArticle
            item={animations[0]}
            index={0}
            projectY={firstY}
            isDesktop={isDesktop}
            onPointerEnter={handleProjectPointerEnter}
            onPointerMove={handleProjectPointerMove}
            onPointerLeave={hideCursor}
          />

          <ProjectArticle
            item={animations[1]}
            index={1}
            projectY={secondY}
            isDesktop={isDesktop}
            onPointerEnter={handleProjectPointerEnter}
            onPointerMove={handleProjectPointerMove}
            onPointerLeave={hideCursor}
          />
        </div>

        <div className="mt-24 md:mt-32 lg:mt-40">
          <TextReveal
            as="h2"
            mode="lines"
            delay={0.01}
            className="
              max-w-[1300px]
              text-[12vw]
              font-semibold
              uppercase
              leading-[0.9]
              tracking-[-0.035em]
              md:text-[6.4vw]
              lg:text-[5vw]
            "
          >
            Selected work across motion and identity.
          </TextReveal>
        </div>
      </div>
    </section>
  );
}
