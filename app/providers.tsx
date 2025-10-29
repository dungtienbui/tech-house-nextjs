'use client';

import { GuestCartProvider } from "@/lib/context/guest-card-context";
import { GuestCartSync } from "@/ui/app/cart/guest-cart-sync";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <GuestCartProvider>
                    <GuestCartSync />
                    {children}
                </GuestCartProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}