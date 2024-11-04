'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {FC, ReactNode} from "react";
type Props = {
  children: ReactNode;
};

const queryClient = new QueryClient();
export const AppWrapper: FC<Props> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
      {children}
  </QueryClientProvider>
);
