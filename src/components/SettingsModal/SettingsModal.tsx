import { useState, useEffect } from "react";
import { getApiKey, saveApiKey, removeApiKey } from "../../services/gemini";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
    const [apiKey, setApiKey] = useState(getApiKey() || "");
    const [tempKey, setTempKey] = useState(apiKey);

    useEffect(() => {
        if (isOpen) {
            const currentKey = getApiKey() || "";
            setApiKey(currentKey);
            setTempKey(currentKey);
        }
    }, [isOpen]);

    const handleSave = () => {
        try {
            saveApiKey(tempKey);
            setApiKey(tempKey);
            onClose();
        } catch (error: any) {
            console.error("Error saving API key:", error);
            alert("Erro ao salvar a chave de API: " + (error.message || "Erro desconhecido"));
        }
    };

    const handleRemove = () => {
        try {
            removeApiKey();
            setApiKey("");
            setTempKey("");
        } catch (error: any) {
            console.error("Error removing API key:", error);
            alert("Erro ao remover a chave de API: " + (error.message || "Erro desconhecido"));
        }
    };

    if (!isOpen) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Configurações</h3>

                <div className="py-4">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Gemini API Key</legend>
                        <input type="text" className="input w-full" placeholder="Cole sua API Key aqui" value={tempKey} onChange={(e) => setTempKey(e.target.value)} />
                        <p className="label">Insira sua chave de API do Google Gemini para habilitar funcionalidades de IA.</p>
                    </fieldset>
                </div>

                <div className="modal-action">
                    {apiKey && (
                        <button className="btn btn-error btn-soft mr-auto" onClick={handleRemove}>Remover Chave</button>
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
