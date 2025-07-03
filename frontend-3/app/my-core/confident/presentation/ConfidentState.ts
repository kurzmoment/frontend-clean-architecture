import { ConfidentEntity } from "../domain/Confident";

export type ConfidentState =
  | LoadingConfidentState
  | LoadedConfidentState
  | ErrorConfidentState;

export type LoadingConfidentState = {
  kind: "LoadingConfidentState";
};

export type LoadedConfidentState = {
  kind: "LoadedConfidentState";
  confidents: ConfidentEntity[];
};

export type ErrorConfidentState = {
  kind: "ErrorConfidentState";
  error: string;
};

export const confidentInitialState: ConfidentState = {
  kind: "LoadingConfidentState",
};
