import LoginHeader from "./LoginHeader";
import LoginForm from "./LoginForm";
import LoginSocialButtons from "./LoginSocialButtons";
import LoginFooter from "./LoginFooter";
import LoginPageWrapper from "./LoginPageWrapper";

/** Login page — composes header, form, social buttons, and footer. */
export default function LoginPage(): React.JSX.Element {
    return (
        <LoginPageWrapper>
            <LoginHeader />
            <div>
                <LoginForm />
                <LoginSocialButtons />
            </div>
            <LoginFooter />
        </LoginPageWrapper>
    );
}
