"use client";
import { useState, useEffect, useCallback } from "react";

export type SavedProduct = {
    id: string;
    name: string;
    price: number;
    description?: string;
};

const STORAGE_KEY = "bill-generator-product-catalog";

export const useProductCatalog = () => {
    const [products, setProducts] = useState<SavedProduct[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load products from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setProducts(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error loading product catalog:", error);
        }
        setIsLoaded(true);
    }, []);

    // Save a new product
    const saveProduct = useCallback((product: Omit<SavedProduct, "id">) => {
        const newProduct: SavedProduct = {
            ...product,
            id: `product-${Date.now()}`,
        };

        setProducts((prev) => {
            const updated = [...prev, newProduct];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        return newProduct;
    }, []);

    // Delete a product
    const deleteProduct = useCallback((productId: string) => {
        setProducts((prev) => {
            const updated = prev.filter((p) => p.id !== productId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    // Get a product by ID
    const getProduct = useCallback(
        (productId: string) => {
            return products.find((p) => p.id === productId);
        },
        [products]
    );

    return {
        products,
        isLoaded,
        saveProduct,
        deleteProduct,
        getProduct,
    };
};

export default useProductCatalog;
