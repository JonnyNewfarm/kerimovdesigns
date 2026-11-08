"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import type { InfiniteProject } from "../infinite-projects/types";
import MobilePortfolio from "../mobile/MobilePortfolio";

type Props = {
  projects: InfiniteProject[];
};

function LoadingCover() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-[9999] bg-[#0b0c09]" />
  );
}

const DesktopPortfolio = dynamic(() => import("../InfiniteProjectsScene"), {
  ssr: false,
  loading: () => <LoadingCover />,
});

export default function ResponsivePortfolio({ projects }: Props) {
  const [mobile, setMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");

    const update = () => {
      setMobile(media.matches);
    };

    update();

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  if (mobile === null) {
    return <LoadingCover />;
  }

  if (mobile) {
    return <MobilePortfolio projects={projects} />;
  }

  return <DesktopPortfolio projects={projects} />;
}
