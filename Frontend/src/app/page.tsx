import LandingNavbar from "./(landing)/LandingNavbar/LandingNavbar";
import HeroSection from "./(landing)/HeroSection/HeroSection";
import DemoSection from "./(landing)/DemoSection/DemoSection";
import FeaturesSection from "./(landing)/FeaturesSection/FeaturesSection";
import AuthRedirect from "@/components/AuthRedirect/AuthRedirect";

/** Landing page — composes all landing sections. Redirects to /dashboard if already authenticated. */
export default function LandingPage(): React.JSX.Element {
    return (
        <>
            <AuthRedirect />
            <LandingNavbar />
            <main>
                <HeroSection />
                <DemoSection />
                <FeaturesSection />
            </main>
        </>
    );
}
