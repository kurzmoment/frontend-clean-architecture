import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { serviceContainer } from "./container";
import type {
  IAuthService,
  IProjectService,
  IConfidentService,
  ITagService,
} from "./container";

interface ServiceContextType {
  authService: IAuthService;
  projectService: IProjectService;
  confidentService: IConfidentService;
  tagService: ITagService;
}

const ServiceContext = createContext<ServiceContextType | null>(null);

interface ServiceProviderProps {
  children: ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const services: ServiceContextType = {
    authService: serviceContainer.getAuthService(),
    projectService: serviceContainer.getProjectService(),
    confidentService: serviceContainer.getConfidentService(),
    tagService: serviceContainer.getTagService(),
  };

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices(): ServiceContextType {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
}

// Convenience hooks for individual services
export function useAuthService(): IAuthService {
  const { authService } = useServices();
  return authService;
}

export function useProjectService(): IProjectService {
  const { projectService } = useServices();
  return projectService;
}

export function useConfidentService(): IConfidentService {
  const { confidentService } = useServices();
  return confidentService;
}

export function useTagService(): ITagService {
  const { tagService } = useServices();
  return tagService;
}
