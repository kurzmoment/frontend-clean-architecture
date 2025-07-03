import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect } from "react";
import { authService } from "../../services";

interface QueryProviderProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

export function QueryProvider({ children, queryClient }: QueryProviderProps) {
  const [client] = useState(
    () =>
      queryClient ||
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes
          },
        },
      })
  );

  // Initialize auth service when the app starts
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await authService.initialize();
      } catch (error) {
        console.error("Failed to initialize auth service:", error);
      }
    };

    initializeAuth();
  }, []);

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
