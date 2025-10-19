import { useTranslation } from "react-i18next";
import Logo from "../../Components/Auth/Logo";
import SignupForm from "../../Components/Auth/Signup/SignupForm";

export default function SignupPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
            <Logo/>
            <p className="text-lg font-normal">{t("auth.signupMessage")}</p>
          <SignupForm/>
        </div>
  )
}
