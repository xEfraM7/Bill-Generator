"use client";
import { useState, useEffect, useCallback } from "react";
import { SavedCompany } from "@/types/FormTypes";

const STORAGE_KEY = "bill-generator-saved-company";

export const useSavedCompany = () => {
    const [company, setCompany] = useState<SavedCompany | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load company from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setCompany(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error loading saved company:", error);
        }
        setIsLoaded(true);
    }, []);

    // Save company data
    const saveCompany = useCallback((companyData: SavedCompany) => {
        setCompany(companyData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(companyData));
    }, []);

    // Clear company data
    const clearCompany = useCallback(() => {
        setCompany(null);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        company,
        isLoaded,
        saveCompany,
        clearCompany,
    };
};

export default useSavedCompany;
