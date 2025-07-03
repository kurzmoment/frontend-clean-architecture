export type DataError = UnexpectedError;

export type UnexpectedError = {
  kind: "UnexpectedError";
  error: Error;
};
