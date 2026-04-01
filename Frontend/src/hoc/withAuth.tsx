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
 *
 * Why setState inside useEffect?
 * Next.js renders "use client" components on the server where `document` is
 * undefined, so tokenService.isAuthenticated() always returns false during SSR.
 * Initialising state from the cookie in a lazy useState initializer therefore
 * serialises `false` to the client and the effect would always redirect.
 * The effect here is an intentional one-time external-system check (reading the
 * cookie after hydration) — it does not create cascading renders because
 * `isAuthorised` is not a dependency of the effect.
 */
export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>,
): React.FC<P> {
    const AuthGuard: React.FC<P> = (props) => {
        const router = useRouter();
        const [isAuthorised, setIsAuthorised] = useState(false);

        useEffect(() => {
            if (tokenService.isAuthenticated()) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setIsAuthorised(true);
            } else {
                void router.replace("/login");
            }
        }, [router]);

        if (!isAuthorised) return null;

        return <WrappedComponent {...props} />;
    };

    AuthGuard.displayName = `withAuth(${WrappedComponent.displayName ?? WrappedComponent.name ?? "Component"})`;

    return AuthGuard;
}
