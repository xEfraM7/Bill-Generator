"use client";
import { useState, useEffect, useCallback } from "react";
import { SavedClient } from "@/types/FormTypes";

const STORAGE_KEY = "bill-generator-saved-clients";

export const useSavedClients = () => {
    const [clients, setClients] = useState<SavedClient[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load clients from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setClients(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error loading saved clients:", error);
        }
        setIsLoaded(true);
    }, []);

    // Save a new client
    const saveClient = useCallback((client: Omit<SavedClient, "id">) => {
        const newClient: SavedClient = {
            ...client,
            id: `client-${Date.now()}`,
        };

        setClients((prev) => {
            const updated = [...prev, newClient];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        return newClient;
    }, []);

    // Delete a client
    const deleteClient = useCallback((clientId: string) => {
        setClients((prev) => {
            const updated = prev.filter((c) => c.id !== clientId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    // Get a client by ID
    const getClient = useCallback(
        (clientId: string) => {
            return clients.find((c) => c.id === clientId);
        },
        [clients]
    );

    return {
        clients,
        isLoaded,
        saveClient,
        deleteClient,
        getClient,
    };
};

export default useSavedClients;
