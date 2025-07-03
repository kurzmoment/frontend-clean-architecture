import { Either } from "./Either";
import { DataError } from "./DataError";

export class EitherAsync<L, R> {
  private constructor(private readonly promise: Promise<Either<L, R>>) {}

  static fromPromise<L, R>(promise: Promise<R>): EitherAsync<L, R> {
    const eitherPromise = promise
      .then((value) => Either.right<L, R>(value))
      .catch((error) => Either.left<L, R>(error as L));

    return new EitherAsync<L, R>(eitherPromise);
  }

  static fromPromiseWithError<L, R>(
    promise: Promise<R>,
    errorMapper: (error: unknown) => L
  ): EitherAsync<L, R> {
    const eitherPromise = promise
      .then((value) => Either.right<L, R>(value))
      .catch((error) => Either.left<L, R>(errorMapper(error)));

    return new EitherAsync<L, R>(eitherPromise);
  }

  flatMap<T>(fn: (right: R) => EitherAsync<L, T>): EitherAsync<L, T> {
    const newPromise = this.promise.then((either) =>
      either.fold(
        (left) => Promise.resolve(Either.left<L, T>(left)),
        (right) => fn(right).promise
      )
    );

    return new EitherAsync<L, T>(newPromise);
  }

  map<T>(fn: (right: R) => T): EitherAsync<L, T> {
    return this.flatMap((right) =>
      EitherAsync.fromPromise(Promise.resolve(fn(right)))
    );
  }

  mapLeft<T>(fn: (left: L) => T): EitherAsync<T, R> {
    const newPromise = this.promise.then((either) =>
      either.fold(
        (left) => Promise.resolve(Either.left<T, R>(fn(left))),
        (right) => Promise.resolve(Either.right<T, R>(right))
      )
    );

    return new EitherAsync<T, R>(newPromise);
  }

  async run(): Promise<Either<L, R>> {
    return this.promise;
  }
}
