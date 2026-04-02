import LoginHeader from "./LoginHeader";
import LoginForm from "./LoginForm";
import LoginFooter from "./LoginFooter";
import LoginPageWrapper from "./LoginPageWrapper";

/** Login page — composes header, form, and footer. */
export default function LoginPage(): React.JSX.Element {
    return (
        <LoginPageWrapper>
            <LoginHeader />
            <div>
                <LoginForm />
            </div>
            <LoginFooter />
        </LoginPageWrapper>
    );
}
