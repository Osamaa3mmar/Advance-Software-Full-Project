import LoginForm from "../../Components/Auth/Login/LoginForm";
import Logo from "../../Components/Auth/Logo";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
        <Logo/>
      <LoginForm/>
    </div>
  )
}
