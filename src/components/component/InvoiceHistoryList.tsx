"use client";
import { InvoiceHistoryItem } from "@/hooks/useInvoiceHistory";

type InvoiceHistoryListProps = {
    history: InvoiceHistoryItem[];
    onSelect: (item: InvoiceHistoryItem) => void;
    onDelete: (historyId: string) => void;
};

export const InvoiceHistoryList = ({
    history,
    onSelect,
    onDelete,
}: InvoiceHistoryListProps) => {
    if (history.length === 0) {
        return (
            <div className="text-sm text-slate-400 bg-slate-50 p-4 rounded-lg text-center">
                <span className="text-2xl block mb-2">📋</span>
                No hay facturas en el historial
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="max-h-64 overflow-y-auto space-y-2">
                {history.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-300 transition-all cursor-pointer"
                        onClick={() => onSelect(item)}
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">
                                    #{item.invoiceNumber}
                                </span>
                                <span className="text-xs text-slate-500">{item.date}</span>
                            </div>
                            <p className="font-medium text-slate-800 truncate mt-1">
                                {item.clientName}
                            </p>
                            <p className="text-sm text-green-600 font-semibold">
                                ${item.total.toFixed(2)}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(item.id);
                            }}
                            className="ml-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="Eliminar del historial"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvoiceHistoryList;
