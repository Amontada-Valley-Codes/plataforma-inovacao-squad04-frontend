import Image from "next/image";
import { User, Mail, LockKeyhole, Phone } from "lucide-react";
import Link from "next/link";


export default function RegisterForm() {
  return ( 
    <div
      className="flex flex-col justify-center items-center 
       z-10 
      bg-[linear-gradient(134deg,#15358D_20%,#0C0869_70%,#66B132_100%)] 
      border-l-2 border-[#C7E6FE]"
    >

      <div className="relative w-[140px] h-[90px] mb-6">
        <Image
          src={"/images/ninna-logo.svg"}
          alt="ninna-logo"
          fill
          className="object-contain"
        />
      </div>

      <h1 className="font-semibold text-[28px] text-white mb-6">
        Cadastro
      </h1>


      <form className="flex flex-col items-center w-[300px]">

        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="Nome Completo"
            className="w-full bg-white rounded-full pl-12 pr-4 py-3 
            placeholder:text-[#6B7280] placeholder:text-base 
            focus:outline-none shadow-sm"
          />
          <User className="absolute top-3 left-4" color="#6B7280" size={20} />
        </div>

        <div className="relative w-full mb-4">
          <input
            type="tel"
            placeholder="Telefone"
            className="w-full bg-white rounded-full pl-12 pr-4 py-3 
            placeholder:text-[#6B7280] placeholder:text-base 
            focus:outline-none shadow-sm"
          />
          <Phone className="absolute top-3 left-4" color="#6B7280" size={20} />
        </div>


        <div className="relative w-full mb-4">
          <input
            type="email"
            placeholder="E-mail"
            className="w-full bg-white rounded-full pl-12 pr-4 py-3 
            placeholder:text-[#6B7280] placeholder:text-base 
            focus:outline-none shadow-sm"
          />
          <Mail className="absolute top-3 left-4" color="#6B7280" size={20} />
        </div>


        <div className="relative w-full mb-4">
          <input
            type="password"
            placeholder="Senha"
            className="w-full bg-white rounded-full pl-12 pr-4 py-3 
            placeholder:text-[#6B7280] placeholder:text-base 
            focus:outline-none shadow-sm"
          />
          <LockKeyhole
            className="absolute top-3 left-4"
            color="#6B7280"
            size={20}
          />
        </div>


        <div className="relative w-full mb-6">
          <input
            type="password"
            placeholder="Repetir senha"
            className="w-full bg-white rounded-full pl-12 pr-4 py-3 
            placeholder:text-[#6B7280] placeholder:text-base 
            focus:outline-none shadow-sm"
          />
          <LockKeyhole
            className="absolute top-3 left-4"
            color="#6B7280"
            size={20}
          />
        </div>

    <div className="w-[300px] text-center mb-5">
        <p className="text-base text-[#D2F5FB] font-light">
         Já possui cadastro?
    <Link
      href="/login"
      className="relative text-white font-normal cursor-pointer
      after:content-[''] after:absolute after:left-0 after:-bottom-0.5
      after:h-[1.5px] after:w-full after:bg-white
      after:origin-center after:scale-x-0 after:transition-transform 
      after:duration-300 hover:after:scale-x-100"
    >
      {" "}Faça login
    </Link>
        </p>
    </div>


        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-[#0C0869] to-[#15358D] 
          text-white text-lg font-semibold py-3 shadow hover:scale-[1.02] 
          transition-transform duration-300 mb-4"
        >
          Cadastrar
        </button>

        
      </form>

    
    </div>
  );
}
