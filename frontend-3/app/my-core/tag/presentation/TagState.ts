import { TagEntity } from "../domain/Tag";

export type TagState = LoadingTagState | LoadedTagState | ErrorTagState;

export type LoadingTagState = {
  kind: "LoadingTagState";
};

export type LoadedTagState = {
  kind: "LoadedTagState";
  tags: TagEntity[];
};

export type ErrorTagState = {
  kind: "ErrorTagState";
  error: string;
};

export const tagInitialState: TagState = {
  kind: "LoadingTagState",
};
