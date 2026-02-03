"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "bill-generator-company-logo";
const MAX_SIZE = 200; // Max width/height in pixels

export const useLogo = () => {
    const [logo, setLogo] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load logo from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setLogo(stored);
            }
        } catch (error) {
            console.error("Error loading logo:", error);
        }
        setIsLoaded(true);
    }, []);

    // Compress and save logo
    const saveLogo = useCallback((file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Create canvas for resizing
                    const canvas = document.createElement("canvas");
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height = (height * MAX_SIZE) / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width = (width * MAX_SIZE) / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Convert to base64 with compression
                    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);

                    try {
                        localStorage.setItem(STORAGE_KEY, dataUrl);
                        setLogo(dataUrl);
                        resolve(dataUrl);
                    } catch (error) {
                        reject(new Error("Logo demasiado grande para guardar"));
                    }
                };
                img.onerror = () => reject(new Error("Error al cargar imagen"));
                img.src = e.target?.result as string;
            };
            reader.onerror = () => reject(new Error("Error al leer archivo"));
            reader.readAsDataURL(file);
        });
    }, []);

    // Clear logo
    const clearLogo = useCallback(() => {
        setLogo(null);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        logo,
        isLoaded,
        saveLogo,
        clearLogo,
    };
};

export default useLogo;
