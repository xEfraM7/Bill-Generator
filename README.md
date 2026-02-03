# 📄 Bill Generator - Notas de Entrega

Aplicación web para generar **Notas de Entrega** profesionales en formato PDF. Creada con Next.js 14, React-PDF y TypeScript.

![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)

---

## ✨ Características

- 📝 **Formulario Multi-Paso** - Navegación intuitiva por secciones
- ✅ **Validación en Tiempo Real** - Con Zod y react-hook-form
- 📄 **Generación de PDF** - Documentos profesionales con react-pdf
- 📱 **Diseño Responsive** - Optimizado para móvil y desktop
- 💾 **Descarga Automática** - El PDF se guarda directamente
- 🎨 **UI Moderna** - Componentes shadcn/ui con TailwindCSS

---

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+ 
- npm, yarn, pnpm o bun

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/Bill-Generator.git
cd Bill-Generator

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu nombre de empresa

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
NEXT_PUBLIC_COMPANY_NAME=Mi Empresa S.A.
```

---

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── page.tsx           # Página principal
│   └── layout.tsx         # Layout raíz
│
├── components/
│   ├── component/         # Componentes de negocio
│   │   ├── FormComponent.tsx      # Formulario principal
│   │   ├── FormArticleComponent.tsx
│   │   └── FormField.tsx
│   ├── pdf/
│   │   └── InVoicePDF.tsx # Template del PDF
│   └── ui/                # Componentes shadcn/ui
│
├── hooks/                 # Custom hooks
│   ├── useArticles.ts     # CRUD de artículos
│   └── useDate.ts         # Formateo de fechas
│
├── types/
│   └── FormTypes.ts       # Tipos + esquemas Zod
│
└── config/
    └── senderDefaults.ts  # Config por defecto
```

---

## 🛠️ Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Iniciar producción |
| `npm run lint` | Ejecutar ESLint |

---

## 📦 Dependencias Principales

| Paquete | Uso |
|---------|-----|
| `@react-pdf/renderer` | Generación de PDF |
| `react-hook-form` | Manejo de formularios |
| `zod` | Validación de esquemas |
| `file-saver` | Descarga de archivos |
| `@radix-ui/*` | Componentes accesibles |

---

## 📋 Flujo de la Aplicación

1. **Empresa** - Ingresa el nombre de tu empresa
2. **Receptor** - Datos del destinatario (nombre, dirección, etc.)
3. **Servicio** - Descripción opcional del servicio
4. **Artículos** - Agrega productos con cantidad y precio
5. **Generar** - Crea y descarga el PDF automáticamente

---

## 🎨 Personalización

### Colores del PDF

Edita los colores en `src/components/pdf/InVoicePDF.tsx`:

```javascript
const colors = {
  primary: "#1a365d",    // Encabezados
  accent: "#3182ce",     // Acentos
  // ...
};
```

---

## 📄 Licencia

MIT © 2026

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/nueva-funcion`)
3. Commit tus cambios (`git commit -m 'Agregar nueva función'`)
4. Push a la rama (`git push origin feature/nueva-funcion`)
5. Abre un Pull Request
