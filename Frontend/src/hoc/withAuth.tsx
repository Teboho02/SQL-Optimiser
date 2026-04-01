"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tokenService } from "@/services/tokenService";

/**
 * Higher-order component that guards a component behind authentication.
 *
 * If no valid token cookie is found the user is immediately redirected to
 * /login and nothing is rendered (no flash of protected content).
 * Once authentication is confirmed the wrapped component is mounted normally.
 */
export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>,
): React.FC<P> {
    const AuthGuard: React.FC<P> = (props) => {
        const router = useRouter();
        // Initialise synchronously from the cookie so the effect only ever
        // performs navigation (an external side-effect), never setState.
        const [isAuthorised] = useState(() => tokenService.isAuthenticated());

        useEffect(() => {
            if (!isAuthorised) {
                router.replace("/login");
            }
        }, [isAuthorised, router]);

        if (!isAuthorised) return null;

        return <WrappedComponent {...props} />;
    };

    AuthGuard.displayName = `withAuth(${WrappedComponent.displayName ?? WrappedComponent.name ?? "Component"})`;

    return AuthGuard;
}
