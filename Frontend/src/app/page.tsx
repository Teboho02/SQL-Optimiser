import LandingNavbar from "./(landing)/LandingNavbar/LandingNavbar";
import HeroSection from "./(landing)/HeroSection/HeroSection";
import DemoSection from "./(landing)/DemoSection/DemoSection";
import FeaturesSection from "./(landing)/FeaturesSection/FeaturesSection";

/** Landing page — composes all landing sections. */
export default function LandingPage(): React.JSX.Element {
    return (
        <>
            <LandingNavbar />
            <main>
                <HeroSection />
                <DemoSection />
                <FeaturesSection />
            </main>
        </>
    );
}
