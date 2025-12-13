import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Article } from "@/types/FormTypes";

interface Props {
  handleChangeArticle: (arg: Article) => void;
  handleRemoveArticle: (arg: Article) => void;
  articles: Article[];
  control: any;
}

export const FormArticleComponent = ({
  handleChangeArticle,
  handleRemoveArticle,
  articles,
}: Props) => {
  const addArticle = () => {
    handleChangeArticle({
      nameItem: "",
      price: "",
      quantity: "",
      id: `${Math.random()}`,
    });
  };

  const removeArticle = (id: string) => {
    const articleToRemove = articles.find((e: Article) => e.id === id);
    if (articleToRemove !== undefined) {
      handleRemoveArticle(articleToRemove);
    }
  };

  const updateArticle = (
    id: string,
    field: "nameItem" | "quantity" | "price",
    value: string
  ) => {
    const updatedArticle = articles.find((e: Article) => e.id === id);
    if (updatedArticle !== undefined) {
      handleChangeArticle({ ...updatedArticle, [field]: value });
    }
  };

  const getArticleTotal = (price: string, quantity: string) => {
    const p = parseFloat(price) || 0;
    const q = parseFloat(quantity) || 0;
    return (p * q).toFixed(2);
  };

  return (
    <div className="space-y-4">
      {/* Empty State */}
      {articles.length === 0 && (
        <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-slate-500 mb-4">No hay artículos agregados</p>
          <Button
            type="button"
            onClick={addArticle}
            className="bg-blue-600 hover:bg-blue-700"
          >
            + Agregar primer artículo
          </Button>
        </div>
      )}

      {/* Article Cards - Mobile Friendly */}
      <div className="space-y-3">
        {articles.map(({ nameItem, quantity, price, id }, index) => (
          <div
            key={id}
            className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header with number and delete */}
            <div className="flex justify-between items-center mb-3">
              <span className="bg-blue-100 text-blue-700 text-sm font-medium px-2.5 py-1 rounded-full">
                Artículo {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeArticle(id)}
                aria-label="Eliminar artículo"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Name Input */}
            <div className="mb-3">
              <label className="text-sm text-slate-500 mb-1 block">
                Nombre del artículo
              </label>
              <Input
                type="text"
                placeholder="Ej: Servicio de instalación"
                value={nameItem}
                onChange={(e) => updateArticle(id, "nameItem", e.target.value)}
                className="h-12"
              />
            </div>

            {/* Price and Quantity Row */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-sm text-slate-500 mb-1 block">
                  Precio ($)
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => updateArticle(id, "price", e.target.value)}
                  className="h-12"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500 mb-1 block">
                  Cantidad
                </label>
                <Input
                  type="number"
                  placeholder="1"
                  value={quantity}
                  onChange={(e) =>
                    updateArticle(id, "quantity", e.target.value)
                  }
                  className="h-12"
                  min="1"
                />
              </div>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-sm text-slate-500">Subtotal</span>
              <span className="text-lg font-semibold text-slate-800">
                ${getArticleTotal(price, quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Article Button */}
      {articles.length > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={addArticle}
          className="w-full h-12 border-dashed border-2 hover:border-blue-400 hover:bg-blue-50"
        >
          <span className="text-lg mr-2">+</span> Agregar otro artículo
        </Button>
      )}
    </div>
  );
};

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
