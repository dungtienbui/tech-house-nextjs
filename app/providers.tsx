'use client';

import { GuestCartProvider } from "@/lib/context/guest-card-context";
import { GuestProvider } from "@/lib/context/guest-context";
import { GuestCartSync } from "@/ui/app/cart/guest-cart-sync";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <GuestProvider>
                    <GuestCartProvider>
                        <GuestCartSync />
                        {children}
                    </GuestCartProvider>
                </GuestProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}