import AuthVisual from "../AuthVisual";
import LoginForm from "./RegisterStartupForm";

export default function RegisterStartupPage() {
  return (
    <div className="w-full h-screen grid grid-cols-[1fr_640px]">
      <AuthVisual />
        <LoginForm />
    </div>
  );
}
