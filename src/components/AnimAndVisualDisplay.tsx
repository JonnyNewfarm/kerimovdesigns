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
  {
    title: "Poster collection",
    heading: "Poster design",
    type: "Posters",
    description:
      "A collection of experimental posters exploring typography, composition, colour and visual hierarchy.",
    images: ["/poster-2.jpg", "/poster-9.jpg"],
    href: "/project/6a738fe5c50ff327148b02f9",
    hoverText: "View posters",
    cursorClass: "text-[#d7deda]",
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
    const mediaQuery = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine)",
    );

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
        willChange: "transform",
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
        flex
        -translate-x-1/2
        -translate-y-1/2
      "
    >
      <div
        className={`
          relative
          overflow-hidden
          text-center
          text-[4.8vw]
          font-black
          uppercase
          leading-[0.78]
          tracking-[-0.035em]
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
  onPointerEnter: (
    event: ReactPointerEvent<HTMLAnchorElement>,
    item: AnimationProject,
  ) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLAnchorElement>) => void;
  onPointerLeave: () => void;
};

const ProjectMedia = memo(function ProjectMedia({
  item,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
}: ProjectMediaProps) {
  const sharedProps = {
    href: item.href,
    transitionLabel: item.title,
    "aria-label": `View ${item.title}`,
    onPointerEnter: (event: ReactPointerEvent<HTMLAnchorElement>) => {
      onPointerEnter(event, item);
    },
    onPointerMove,
    onPointerLeave,
  };

  if (item.video) {
    return (
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
          src={item.video}
          muted
          loop
          playsInline
          preload="metadata"
          className="
            h-full
            w-full
            object-cover
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-dark/0
            transition-colors
            duration-500
            lg:group-hover:bg-dark/10
          "
        />
      </TransitionLink>
    );
  }

  return (
    <TransitionLink
      {...sharedProps}
      className="
        group
        relative
        grid
        w-full
        grid-cols-2
        items-stretch
        overflow-hidden
        bg-color/[0.04]
      "
    >
      {item.images?.map((image, imageIndex) => (
        <div
          key={image}
          className="
            relative
            flex
            min-w-0
            items-stretch
            justify-center
            overflow-hidden
            bg-black
          "
        >
          <Image
            src={image}
            alt={`${item.title} image ${imageIndex + 1}`}
            width={1200}
            height={1600}
            sizes="
              (max-width: 767px) 50vw,
              (max-width: 1023px) 50vw,
              39vw
            "
            quality={80}
            loading="lazy"
            className="
              h-auto
              w-full
              object-contain
              transition-transform
              duration-700
              ease-out
              lg:group-hover:scale-[1.015]
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
          lg:group-hover:bg-dark/10
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
          text-wrap
          text-[10vw]
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
      pointerX.set(clientX);
      pointerY.set(clientY);
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

  useEffect(() => {
    if (!isDesktop) {
      hideCursor();
      return;
    }

    window.addEventListener("scroll", hideCursor, {
      passive: true,
    });

    window.addEventListener("blur", hideCursor);

    return () => {
      window.removeEventListener("scroll", hideCursor);
      window.removeEventListener("blur", hideCursor);
    };
  }, [hideCursor, isDesktop]);

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
      {isDesktop && (
        <CustomCursor x={pointerX} y={pointerY} cursorState={cursorState} />
      )}

      <div className="mx-auto w-full max-w-[1800px]">
        <div className="flex flex-col gap-32 lg:gap-48">
          {animations.map((item, index) => (
            <ProjectArticle
              key={item.title}
              item={item}
              index={index}
              projectY={index === 0 ? firstY : secondY}
              isDesktop={isDesktop}
              onPointerEnter={handleProjectPointerEnter}
              onPointerMove={handleProjectPointerMove}
              onPointerLeave={hideCursor}
            />
          ))}
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
            Selected work across motion and poster design.
          </TextReveal>
        </div>
      </div>
    </section>
  );
}
