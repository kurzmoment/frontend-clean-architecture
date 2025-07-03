import { ProjectEntity } from "../domain/Project";

export type ProjectState =
  | LoadingProjectState
  | LoadedProjectState
  | ErrorProjectState;

export type LoadingProjectState = {
  kind: "LoadingProjectState";
};

export type LoadedProjectState = {
  kind: "LoadedProjectState";
  projects: ProjectEntity[];
};

export type ErrorProjectState = {
  kind: "ErrorProjectState";
  error: string;
};

export const projectInitialState: ProjectState = {
  kind: "LoadingProjectState",
};
