import { useTranslation } from "react-i18next";
import LoginForm from "../../Components/Auth/Login/LoginForm";
import Logo from "../../Components/Auth/Logo";

export default function LoginPage() {
    const { t } = useTranslation();
  
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
        <Logo/>
        <p className="text-lg font-normal">{t("auth.loginMessage")}</p>
      <LoginForm/>
    </div>
  )
}
