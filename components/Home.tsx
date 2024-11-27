import Image from "next/image";
import { CO2Chart } from "./stats/CO2Chart";
import logo from "@/public/logosimbolo_prosecto.png";
import { Button } from "./ui/button";
import { AvatarIcon } from "@radix-ui/react-icons";
import { CircleUser } from "lucide-react";

export function Welcome() {
  return (
    <div className="flex flex-col justify-center flex-grow w-full">
      <div className="flex justify-evenly items-center px-20 h-[70vh] pt-r6 bg-secondary">
        <div className="w-2/5">
          <h1 className="w-full text-center text-lg font-bold">
            Gases de efecto invernadero evitados
          </h1>
          <CO2Chart />
          <p className="p-4 font-light text-sm">
            Estas son las emisiones de gases de efecto invernadero que las
            empresas en conjunto lograrón evitar al usar nuestra plataforma.
          </p>
        </div>
        <div className="flex flex-col justify-center h-full w-1/3 gap-2">
          <p className="text-wrap text-primary text-xl">
            <span className="font-semibold inline-block">Bienvenido</span> a la
            Plataforma de Gestión de Residuos Empresariales de{" "}
            <span className="font-extrabold">Prosecto</span>.
          </p>
          <p>Subastas y Comercio de Residuos para la Economía Circular.</p>
          <br />
          <div>
            <p className="inline-block">Para empezar inicie sesión.</p>
            <CircleUser className="stroke-primary inline-block w-6 h-6 ml-2" />
          </div>
          <a
            className="w-1/4 mt-[46vh] absolute right-20"
            target="_blank"
            href="https://prosecto.com.co/"
          >
            <Image src={logo} alt="Logo de Prosecto" className="opacity-40" />
          </a>
        </div>
      </div>
    </div>
  );
}
