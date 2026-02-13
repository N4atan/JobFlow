import { useState, useEffect } from "react";
import { useGemini } from "../../contexts/GeminiContext";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
    const { apiKey, saveApiKey, removeApiKey } = useGemini();
    const [tempKey, setTempKey] = useState(apiKey);

    useEffect(() => {
        if (isOpen) {
            setTempKey(apiKey);
        }
    }, [isOpen, apiKey]);

    const handleSave = () => {
        saveApiKey(tempKey);
        onClose();
    };

    const handleRemove = () => {
        removeApiKey();
        setTempKey("");
    };

    if (!isOpen) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Configurações</h3>

                <div className="py-4">
                    <h4 className="font-semibold mb-2">Gemini API Key</h4>
                    <p className="text-sm text-gray-500 mb-2">Insira sua chave de API do Google Gemini para habilitar funcionalidades de IA.</p>
                    <input
                        type="text"
                        placeholder="Cole sua API Key aqui"
                        className="input input-bordered w-full"
                        value={tempKey}
                        onChange={(e) => setTempKey(e.target.value)}
                    />
                </div>

                <div className="modal-action">
                    {apiKey && (
                        <button className="btn btn-error" onClick={handleRemove}>Remover Chave</button>
                    )}
                    <button className="btn mr-2" onClick={onClose}>Cancelar</button>
                    <button className="btn btn-primary" onClick={handleSave}>Salvar</button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
};
