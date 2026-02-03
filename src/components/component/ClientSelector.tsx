"use client";
import { SavedClient } from "@/types/FormTypes";

type ClientSelectorProps = {
    clients: SavedClient[];
    onSelect: (client: SavedClient) => void;
    onDelete: (clientId: string) => void;
    selectedClientId?: string;
};

export const ClientSelector = ({
    clients,
    onSelect,
    onDelete,
    selectedClientId,
}: ClientSelectorProps) => {
    if (clients.length === 0) {
        return (
            <div className="text-sm text-slate-400 bg-slate-50 p-3 rounded-lg text-center">
                No hay clientes guardados aún
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
                Clientes guardados
            </label>
            <div className="max-h-40 overflow-y-auto space-y-2">
                {clients.map((client) => (
                    <div
                        key={client.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer hover:border-blue-300 ${selectedClientId === client.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200 bg-white"
                            }`}
                        onClick={() => onSelect(client)}
                    >
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-800 truncate">
                                {client.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {client.receiverId}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(client.id);
                            }}
                            className="ml-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="Eliminar cliente"
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

export default ClientSelector;
