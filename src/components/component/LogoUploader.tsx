"use client";
import { useRef } from "react";
import { Button } from "../ui/button";
import useLogo from "@/hooks/useLogo";
import { toast } from "sonner";

export const LogoUploader = () => {
    const { logo, saveLogo, clearLogo } = useLogo();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            await saveLogo(file);
            toast.success("Logo guardado correctamente");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error al guardar logo");
        }
    };

    const handleClear = () => {
        clearLogo();
        toast.success("Logo eliminado");
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-slate-600">
                Logo de la empresa (opcional)
            </label>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
            />

            {logo ? (
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-white flex items-center justify-center relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={logo}
                            alt="Logo de la empresa"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => inputRef.current?.click()}
                        >
                            Cambiar
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleClear}
                            className="text-red-500 hover:text-red-600"
                        >
                            Eliminar
                        </Button>
                    </div>
                </div>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    className="w-full h-20 border-dashed flex flex-col gap-1"
                >
                    <span className="text-2xl">🖼️</span>
                    <span className="text-sm text-slate-500">Subir logo</span>
                </Button>
            )}
        </div>
    );
};

export default LogoUploader;
