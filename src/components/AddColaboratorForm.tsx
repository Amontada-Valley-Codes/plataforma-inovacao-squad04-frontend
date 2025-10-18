import { ChevronDown, Mail, User, X } from "lucide-react";
import { Modal } from "./ui/modal";
import { useState } from "react";
import { inviteService } from "../api/services/invite.service";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddColaboratorForm({ isOpen, onClose }: Props) {
  const [isFuncOpen, setIsFuncOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const handleSave = async () => {
    if (!email || !role) {
      console.log("Preencha email e função");
      return;
    }

    try {
      const response = await inviteService.sendInvite({ email, type_user: role });
      console.log("Convite enviado:", response);
      onClose();
    } catch (error: any) {
      console.error("Erro ao enviar convite:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 dark:border-gray-800 dark:bg-gray-900">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#15358D] dark:text-blue-800">Adicionar Colaborador</h2>
              <button onClick={onClose}>
                <X className="text-gray-400 hover:text-gray-600 transition duration-400 hover:scale-[1.05] active:scale-[0.98]" size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 h-12 dark:border-gray-800 dark:bg-gray-900">
                <Mail className="text-[#98A2B3] mr-2" size={18} />
                <input
                  type="email"
                  placeholder="Email do colaborador"
                  className="w-full bg-transparent text-sm outline-none text-[#d8d8d8] placeholder:text-[#98A2B3]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative flex items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] px-3 h-12 dark:border-gray-800 dark:bg-gray-900">
                <User className="text-[#98A2B3] mr-2" size={18} />
                <select
                  onFocus={() => setIsFuncOpen(true)}
                  onBlur={() => setIsFuncOpen(false)}
                  className="w-full bg-transparent text-sm outline-none text-[#344054] dark:text-[#ced3db] dark:border-gray-800 dark:bg-gray-900 font-semibold appearance-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="" disabled>Função</option>
                  <option value="EVALUATOR">Avalidor</option>
                  <option value="COMMON">Usuário</option>
                </select>

                <ChevronDown
                  size={20}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-[#ced3db] transition-transform duration-300 ${
                    isFuncOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={onClose}
                className="w-1/2 mr-2 bg-[#F2F4F7] text-[#344054] py-2 rounded-lg font-medium 
                  transition-colors ease-in-out border dark:border-gray-800 dark:bg-gray-900 dark:text-[#ced3db]
                  hover:bg-[#E5E7EB]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="w-1/2 ml-2 bg-[#15358D] dark:bg-blue-800 dark:hover:bg-blue-900 text-white py-2 rounded-lg font-medium 
                  transition-colors ease-in-out dark:text-[#ced3db]
                  hover:bg-[#0f2a6d]"
              >
                Adicionar Colaborador
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
