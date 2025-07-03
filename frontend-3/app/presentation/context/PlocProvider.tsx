import React, { createContext, useContext, useEffect, useState } from "react";
import { ConfidentPloc } from "../../my-core/confident/presentation/ConfidentPloc";
import { ProjectPloc } from "../../my-core/project/presentation/ProjectPloc";
import { TagPloc } from "../../my-core/tag/presentation/TagPloc";
import { container } from "../../infrastructure/di/container";
import { serverAuth } from "../../infrastructure/auth/server-auth";

interface PlocContextType {
  confidentPloc: ConfidentPloc | null;
  projectPloc: ProjectPloc | null;
  tagPloc: TagPloc | null;
  isInitialized: boolean;
}

const PlocContext = createContext<PlocContextType | undefined>(undefined);

interface PlocProviderProps {
  children: React.ReactNode;
}

export const PlocProvider: React.FC<PlocProviderProps> = ({ children }) => {
  const [confidentPloc, setConfidentPloc] = useState<ConfidentPloc | null>(
    null
  );
  const [projectPloc, setProjectPloc] = useState<ProjectPloc | null>(null);
  const [tagPloc, setTagPloc] = useState<TagPloc | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializePlocs = async () => {
      try {
        const user = await serverAuth.getCurrentUser();
        if (user) {
          const confident = container.getConfidentPloc(user.id);
          const project = container.getProjectPloc(user.id);
          const tag = container.getTagPloc(user.id);

          setConfidentPloc(confident);
          setProjectPloc(project);
          setTagPloc(tag);
          setIsInitialized(true);
        } else {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize PLOCs:", error);
        setIsInitialized(true);
      }
    };

    initializePlocs();

    return () => {
      // Cleanup PLOCs when component unmounts
      container.dispose();
    };
  }, []);

  const value: PlocContextType = {
    confidentPloc,
    projectPloc,
    tagPloc,
    isInitialized,
  };

  return <PlocContext.Provider value={value}>{children}</PlocContext.Provider>;
};

export const useConfidentPloc = (): ConfidentPloc => {
  const context = useContext(PlocContext);
  if (!context?.confidentPloc) {
    throw new Error("useConfidentPloc must be used within PlocProvider");
  }
  return context.confidentPloc;
};

export const useProjectPloc = (): ProjectPloc => {
  const context = useContext(PlocContext);
  if (!context?.projectPloc) {
    throw new Error("useProjectPloc must be used within PlocProvider");
  }
  return context.projectPloc;
};

export const useTagPloc = (): TagPloc => {
  const context = useContext(PlocContext);
  if (!context?.tagPloc) {
    throw new Error("useTagPloc must be used within PlocProvider");
  }
  return context.tagPloc;
};

export const usePlocContext = (): PlocContextType => {
  const context = useContext(PlocContext);
  if (!context) {
    throw new Error("usePlocContext must be used within PlocProvider");
  }
  return context;
};
