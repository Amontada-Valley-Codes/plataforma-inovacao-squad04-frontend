import AuthVisual from "../AuthVisual";
import LoginForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="w-full h-screen grid grid-cols-[1fr_640px]">
      <AuthVisual />
        <LoginForm />
    </div>
  );
}
