'use client';
import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Navigasi from '@/components/navigation';
import { usePathname } from 'next/navigation';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const enableNav = ["/home", "/riwayat", "/status-perjanjian", "/profile"]

function ReactQueryWrapper({ children }) {
  const pathName = usePathname();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={true} />
      {enableNav.includes(pathName) && <Navigasi />}
    </QueryClientProvider>
  );
}

export default ReactQueryWrapper;
