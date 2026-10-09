import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const client = new QueryClient({});

export const ReactQuery = ({ children }) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
