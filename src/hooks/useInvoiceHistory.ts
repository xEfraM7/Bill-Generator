"use client";
import { useState, useEffect, useCallback } from "react";
import { Invoice } from "@/types/FormTypes";

export type InvoiceHistoryItem = {
    id: string;
    invoiceNumber: string;
    date: string;
    clientName: string;
    total: number;
    invoice: Invoice;
};

const STORAGE_KEY = "bill-generator-invoice-history";
const MAX_HISTORY = 20; // Keep last 20 invoices

export const useInvoiceHistory = () => {
    const [history, setHistory] = useState<InvoiceHistoryItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load history from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setHistory(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error loading invoice history:", error);
        }
        setIsLoaded(true);
    }, []);

    // Add invoice to history
    const addToHistory = useCallback((invoice: Invoice) => {
        const total = invoice.articles.reduce(
            (sum, art) => sum + Number(art.price) * Number(art.quantity),
            0
        );

        const historyItem: InvoiceHistoryItem = {
            id: `history-${Date.now()}`,
            invoiceNumber: invoice.inVoiceNumber,
            date: invoice.date,
            clientName: invoice.nameReceiver,
            total,
            invoice,
        };

        setHistory((prev) => {
            const updated = [historyItem, ...prev].slice(0, MAX_HISTORY);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        return historyItem;
    }, []);

    // Delete from history
    const deleteFromHistory = useCallback((historyId: string) => {
        setHistory((prev) => {
            const updated = prev.filter((h) => h.id !== historyId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    // Clear all history
    const clearHistory = useCallback(() => {
        setHistory([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    // Get invoice by ID
    const getHistoryItem = useCallback(
        (historyId: string) => {
            return history.find((h) => h.id === historyId);
        },
        [history]
    );

    return {
        history,
        isLoaded,
        addToHistory,
        deleteFromHistory,
        clearHistory,
        getHistoryItem,
    };
};

export default useInvoiceHistory;
