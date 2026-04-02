"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokenService } from "@/services/tokenService";

/**
 * Invisible client component that redirects authenticated users to /dashboard.
 * Import this into server-rendered pages (e.g. landing, login) that should not
 * be accessible once the user is logged in.
 */
const AuthRedirect: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        if (tokenService.isAuthenticated()) {
            void router.replace("/dashboard");
        }
    }, [router]);

    return null;
};

export default AuthRedirect;
