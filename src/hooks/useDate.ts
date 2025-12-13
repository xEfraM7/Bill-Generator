// Función para obtener la fecha formateada al momento de llamarla
export const getFormattedDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};

// Hook mantenido por compatibilidad, pero usa la función directamente en submit
export const useDate = () => {
  return { formattedDate: getFormattedDate(), getFormattedDate };
};
