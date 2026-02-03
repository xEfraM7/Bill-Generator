"use client";

import * as React from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface DocumentInputProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    id?: string;
}

const PREFIXES = [
    { value: "V", label: "V" },
    { value: "J", label: "J" },
    { value: "E", label: "E" },
    { value: "G", label: "G" },
];

export const DocumentInput = ({
    value = "",
    onChange,
    placeholder,
    className,
    id,
}: DocumentInputProps) => {
    // Parse value into prefix and number
    // Assumes format "PREFIX-NUMBER" like "V-12345678"
    // If no prefix found, defaults to "V"
    const [prefix, number] = React.useMemo(() => {
        const parts = value.split("-");
        if (parts.length > 1 && PREFIXES.some((p) => p.value === parts[0])) {
            return [parts[0], parts.slice(1).join("-")];
        }
        return ["V", value.replace(/^[VJEG]-?/i, "")]; // clean up if partially typed
    }, [value]);

    const handlePrefixChange = (newPrefix: string) => {
        onChange(`${newPrefix}-${number}`);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(`${prefix}-${e.target.value}`);
    };

    return (
        <div className={cn("flex gap-2", className)}>
            <select
                className="flex h-14 w-20 items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={prefix}
                onChange={(e) => handlePrefixChange(e.target.value)}
            >
                {PREFIXES.map((p) => (
                    <option key={p.value} value={p.value}>
                        {p.label}
                    </option>
                ))}
            </select>
            <Input
                id={id}
                value={number}
                onChange={handleNumberChange}
                placeholder={placeholder || "12345678"}
                className="h-14 text-lg flex-1"
            />
        </div>
    );
};
