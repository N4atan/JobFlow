import { useState, useEffect } from "react";
import { getApiKey, saveApiKey, removeApiKey, getModel, saveModel } from "../../services/gemini";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
    const [apiKey, setApiKey] = useState(getApiKey() || "");
    const [model, setModel] = useState(getModel() || "gemini-2.5-flash");
    const [tempKey, setTempKey] = useState(apiKey);
    const [tempModel, setTempModel] = useState(model);

    useEffect(() => {
        if (isOpen) {
            const currentKey = getApiKey() || "";
            const currentModel = getModel() || "gemini-2.5-flash";
            setApiKey(currentKey);
            setTempKey(currentKey);
            setModel(currentModel);
            setTempModel(currentModel);
        }
    }, [isOpen]);

    const handleSave = () => {
        try {
            saveApiKey(tempKey);
            setApiKey(tempKey);
            onClose();
            saveModel(tempModel);
            setModel(tempModel);
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
                <h3 className="font-bold text-lg">Configurações do Gemini</h3>

                <div className="py-4">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Gemini API Key</legend>
                        <input type="text" className="input w-full" placeholder="Cole sua API Key aqui" value={tempKey} onChange={(e) => setTempKey(e.target.value)} />
                        <p className="label">Insira sua chave de API do Google Gemini para habilitar funcionalidades de IA.</p>
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Modelo do Gemini</legend>
                        <select defaultValue="Pick a browser" className="select w-full">
                            <option value={'gemini-2.5-flash'} selected>gemini-2.5-flash</option>
                            <option value={'gemini-2.5-flash-lite'}>gemini-2.5-flash-lite</option>
                            <option value={'gemini-3.0'}>gemini-3.0</option>
                        </select>
                        <span className="label">Recomendamos usar o gemini-2.5-flash para melhor desempenho.</span>
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
