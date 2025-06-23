import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TranslationProvider } from "./i18n";

const queryClient = new QueryClient;

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <TranslationProvider>
                {children}
            </TranslationProvider>
        </QueryClientProvider>
    )
}
