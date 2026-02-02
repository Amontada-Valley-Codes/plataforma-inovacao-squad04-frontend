"use client"

import CardDesafio from "@/components/challenge/CardDesafios"
import Button from "@/components/ui/button/Button"

export default function DesafiosPage(){
    return(
        <div>
            
            <div className="flex justify-between mt-3">

                <div>
                    <h1 className="text-3xl">Formulário Editável</h1>
                    <p className="">Crie seu formulário</p>
                </div>
                    
                <div>
                    <Button className="w-40 rounded h-10" variant="primary">
                        Criar Formulário
                    </Button>
                </div>

            </div>

            <div className="grid grid-cols-3 "> 
                <CardDesafio  name="Formulario para captar ideai de uma empresa de supermercado"/>
                <CardDesafio  name="Formulario para captar ideai de uma empresa de supermercado"/>
                <CardDesafio  name="Formulario para captar ideai de uma empresa de supermercado"/>
                <CardDesafio  name="Formulario para captar ideai de uma empresa de supermercado"/>
                <CardDesafio  name="Formulario para captar ideai de uma empresa de supermercado"/>
            </div>





            



            
        </div>
    )
}