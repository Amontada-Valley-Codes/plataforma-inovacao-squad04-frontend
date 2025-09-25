import Image from "next/image";
import { User, LockKeyhole } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  return (
    <div
      className="flex flex-col justify-center items-center 
       z-10
       bg-[linear-gradient(134deg,#15358D_20%,#0C0869_70%,#66B132_100%)] 
      border-l-2 border-[#C7E6FE]"
    >
      <div className="relative w-[135px] h-[101px] mb-6">
        <Image
          src={"/images/ninna-logo.svg"}
          alt="ninna-logo"
          fill
          className="object-cover"
        />
      </div>
      <h1 className="font-semibold text-[34px] text-white mb-4">Login</h1>
      <form>
        <div className="relative w-[300px] mb-6">
          <input
            type="text"
            placeholder="E-mail"
            className="block bg-white hover:bg-gray-100 hover:shadow-lg w-full rounded-3xl pl-12 p-3 cursor-pointer
            placeholder:text-lg placeholder-[#6B7280] focus:outline-none transition-all duration-300 ease-in-out"
          />
          <User
            className="absolute top-3 left-3.5 pointer-events-none"
            color="#6B7280"
          />
        </div>
        <div className="relative w-[300px] mb-5">
          <input
            type="password"
            placeholder="Senha"
            className="block bg-white hover:bg-gray-100 hover:shadow-lg w-[300px] rounded-3xl pl-12 p-3 cursor-pointer 
            placeholder:text-lg placeholder-[#6B7280] focus:outline-none transition-all duration-300 ease-in-out"
          />
          <LockKeyhole
            className="absolute top-3 left-3.5 pointer-events-none"
            color="#6B7280"
          />
        </div>
        <div className="w-[300px] text-center mb-5">
          <Link
            href={"#"}
            className="relative text-base text-white cursor-pointer
            after:content-[''] after:absolute after:left-0 after:-bottom-0.5
            after:h-[1.5px] after:w-full after:bg-white
            after:origin-center after:scale-x-0 after:transition-transform after:duration-300
            hover:after:scale-x-100"
          >
            Esqueceu a senha?
          </Link>
          <p className="text-base text-[#D2F5FB] font-light">
            Não possui cadastro?
            <Link
              href={"#"}
              className="relative text-white font-normal cursor-pointer
              after:content-[''] after:absolute after:left-0 after:-bottom-0.5
              after:h-[1.5px] after:w-full after:bg-white
              after:origin-center after:scale-x-0 after:transition-transform 
              after:duration-300 hover:after:scale-x-100"
            >
              {" "}
              Inscreva-se
            </Link>
          </p>
        </div>
        <div className="w-[300px] mb-6">
          <button
            className="w-full bg-linear-to-r hover:scale-[102.5%] from-[#0C0869] from-5% cursor-pointer
            to-[#15358D] rounded-3xl p-[10px] shadow text-2xl font-semibold text-white transition-all duration-300 ease-in-out"
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}
