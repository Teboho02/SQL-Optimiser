import LoginHeader from "./LoginHeader";
import LoginForm from "./LoginForm";
import LoginFooter from "./LoginFooter";
import LoginPageWrapper from "./LoginPageWrapper";
import AuthRedirect from "@/components/AuthRedirect/AuthRedirect";

/** Login page — composes header, form, and footer. Redirects to /dashboard if already authenticated. */
export default function LoginPage(): React.JSX.Element {
    return (
        <LoginPageWrapper>
            <AuthRedirect />
            <LoginHeader />
            <div>
                <LoginForm />
            </div>
            <LoginFooter />
        </LoginPageWrapper>
    );
}
