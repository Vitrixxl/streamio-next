import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { env } from '~/env';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
type SafeFetchResponse<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export async function safeFetch<T>(
  url: string,
  params?: RequestInit,
): Promise<SafeFetchResponse<T>> {
  try {
    const result = await fetch(
      `http://localhost:3000${url.startsWith('/') ? url : `/${url}`}`,
      params,
    );
    if (result.status >= 500) {
      throw new Error('Internal Server Error');
    }
    if (!result.ok) {
      const data = await result.json();
      throw new Error(data.message);
    }
    const { data } = await result.json() as { data: T };

    console.log({ data });
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}

type Success<T> = {
  data: T;
  error: null;
};
type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}
