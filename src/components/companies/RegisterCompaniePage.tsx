import AuthVisual from "../AuthVisual";
import LoginForm from "./RegisterCompanie";

export default function RegisterCompaniePage() {
  return (
    <div className="w-full h-screen grid grid-cols-[0px_1fr] md:grid-cols-[1fr_420px] lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_640px]">
      <AuthVisual />
        <LoginForm />
    </div>
  );
}
