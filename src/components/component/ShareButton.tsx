"use client";
import { Button } from "../ui/button";
import { toast } from "sonner";

type ShareButtonProps = {
    pdfBlob: Blob | null;
    fileName: string;
    title?: string;
};

export const ShareButton = ({ pdfBlob, fileName, title = "Nota de Entrega" }: ShareButtonProps) => {
    const handleShare = async () => {
        if (!pdfBlob) {
            toast.error("No hay documento para compartir");
            return;
        }

        const file = new File([pdfBlob], fileName, { type: "application/pdf" });

        // Check if Web Share API is supported
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
            try {
                await navigator.share({
                    title,
                    files: [file],
                });
                toast.success("Compartido exitosamente");
            } catch (error) {
                // User cancelled or error
                if ((error as Error).name !== "AbortError") {
                    toast.error("Error al compartir");
                }
            }
        } else {
            // Fallback: Download file
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
            toast.info("Descargado (compartir no disponible en este navegador)");
        }
    };

    return (
        <Button
            type="button"
            onClick={handleShare}
            disabled={!pdfBlob}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
            </svg>
            Compartir
        </Button>
    );
};

export default ShareButton;
