import { useState, useEffect } from "react";

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  body?: BodyInit;
}

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export const useFetch = <T>(url: string, options?: FetchOptions): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData: T = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options]);

  return { data, loading, error };
};
