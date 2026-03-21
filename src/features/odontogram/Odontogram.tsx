import { useState } from "react";
import Thooth from "./components/thooth"
import ModalFullScreen from "../../components/commons/ModalFullScreen";
import ToothModal from "./components/thooth-modal";

export default function Odontogram() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTooth, setSelectedTooth] = useState(0)
    const upperJaw = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
    const lowerJaw = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
    const conditions = ["caries", "restoration", "fracture", "healthy", "up-braces", "down-braces"]

    function openThoothModal(id: number) {
        setSelectedTooth(id)
        setIsModalOpen(true)
    }

    return (
        <div>
            <section className="flex mt-8 justify-center">
                {conditions.map(condition => {
                    return (
                        <div key={condition} className="flex m-1 items-center">
                            <button style={{ backgroundColor: getColorForCondition(condition) }}
                            className={`w-8 h-8 mr-3 cursor-pointer rounded-2xl`} />
                            <span className="text-white">{condition}</span>
                        </div>
                    )
                })}
            </section>

            <section className="text-center">
                <div className="flex justify-center">
                    {upperJaw.map(id => (
                        <Thooth key={id} id={id} rotate={true} type={getToothType(id)} openModal={()=> openThoothModal(id)} />
                    ))}
                </div>
                <div className="flex justify-center w-full">
                    {lowerJaw.map(id => (
                        <Thooth key={id} id={id} rotate={false} type={getToothType(id)} openModal={()=> openThoothModal(id)}/>
                    ))}
                </div>
            </section>

            <ModalFullScreen isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title="Información Del Diente">
                <div className="space-y-4">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Completa los datos del paciente para reservar su horario en la clínica.
                </p>
                <input 
                    type="text" 
                    placeholder="Nombre del paciente"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                </div>
            </ModalFullScreen>
            <ToothModal
                type={getToothType(selectedTooth)}
                isOpen={!!isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                toothId={selectedTooth} 
            />
        </div>
    )
}

function getColorForCondition(condition: string) {
    switch (condition) {
        case "caries":
            return "#ff2f92"
        case "restoration":
            return "#4caf50"
        case "fracture":
            return "#f44336"
        case "healthy":
            return "#2196f3"
        case "up-braces":
            return "#9c27b0"
        case "down-braces":
            return "#ff9800"
        default:
            return "#ccc"
    }
}

function getToothType(id: number) {
    let n = id % 10
    if (n === 1 || n === 2) return "incisor"
    if (n === 3) return "canine"
    if (n === 4 || n === 5) return "premolar"
    return "molar"
}