"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ProjectNavContextType = {
  projectTitle: string | null;
  setProjectTitle: (title: string | null) => void;
};

const ProjectNavContext = createContext<ProjectNavContextType | null>(null);

export const ProjectNavProvider = ({ children }: { children: ReactNode }) => {
  const [projectTitle, setProjectTitle] = useState<string | null>(null);

  return (
    <ProjectNavContext.Provider value={{ projectTitle, setProjectTitle }}>
      {children}
    </ProjectNavContext.Provider>
  );
};

export const useProjectNav = () => {
  const context = useContext(ProjectNavContext);

  if (!context) {
    throw new Error("useProjectNav must be used inside ProjectNavProvider");
  }

  return context;
};

export const ProjectNavTitleSetter = ({ title }: { title: string }) => {
  const { setProjectTitle } = useProjectNav();

  useEffect(() => {
    setProjectTitle(title);

    return () => {
      setProjectTitle(null);
    };
  }, [title, setProjectTitle]);

  return null;
};
