import Logo from "../../Components/Auth/Logo";
import SignupForm from "../../Components/Auth/Signup/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
            <Logo/>
            <p className="text-lg font-normal">Please enter your credentials to signup.</p>
          <SignupForm/>
        </div>
  )
}
