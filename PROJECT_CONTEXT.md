# Bill-Generator - Project Context

## 📋 Descripción General

**Bill-Generator** es una aplicación web para generar **Notas de Entrega** (Delivery Notes) en formato PDF. Permite crear documentos profesionales con información de la empresa, datos del destinatario, descripción del servicio y lista de artículos con precios.

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 14.2.5 | Framework React con App Router |
| **React** | 18.3.1 | Librería UI |
| **TypeScript** | 5.x | Tipado estático |
| **TailwindCSS** | 3.4.1 | Estilos utilitarios |
| **@react-pdf/renderer** | 3.4.4 | Generación de PDF |
| **react-hook-form** | 7.52.1 | Manejo de formularios |
| **Zod** | 3.24.0 | Validación de esquemas |
| **shadcn/ui** | - | Componentes UI (Radix) |
| **file-saver** | 2.0.5 | Descarga de archivos |

---

## 📁 Estructura del Proyecto

```
Bill-Generator/
├── src/
│   ├── app/                      # App Router de Next.js
│   │   ├── page.tsx              # Página principal
│   │   ├── layout.tsx            # Layout raíz
│   │   ├── globals.css           # Estilos globales + CSS variables
│   │   └── favicon.ico
│   │
│   ├── components/
│   │   ├── component/            # Componentes de negocio
│   │   │   ├── FormComponent.tsx     # Formulario principal multi-paso
│   │   │   ├── FormArticleComponent.tsx  # Gestión de artículos
│   │   │   └── FormField.tsx         # Campo de formulario reutilizable
│   │   │
│   │   ├── pdf/
│   │   │   └── InVoicePDF.tsx    # Template del PDF de nota de entrega
│   │   │
│   │   └── ui/                   # Componentes shadcn/ui
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── table.tsx
│   │       └── textarea.tsx
│   │
│   ├── config/
│   │   └── senderDefaults.ts     # Configuración por defecto del remitente
│   │
│   ├── hooks/
│   │   ├── useArticles.ts        # Hook para CRUD de artículos
│   │   └── useDate.ts            # Hook para formateo de fechas
│   │
│   ├── json/
│   │   └── formJson.ts           # Definición dinámica de campos del receptor
│   │
│   ├── lib/
│   │   └── utils.ts              # Utilidad cn() para clases CSS
│   │
│   └── types/
│       └── FormTypes.ts          # Tipos TypeScript + esquemas Zod
│
├── public/                       # Assets estáticos
├── .env                          # Variables de entorno
├── tailwind.config.ts            # Configuración de Tailwind
├── next.config.mjs               # Configuración de Next.js
└── package.json
```

---

## 🎯 Funcionalidades Principales

### 1. **Formulario Multi-Paso**
El formulario tiene 4 secciones navegables:
- **🏢 Empresa**: Nombre de la empresa emisora y su Cédula/RIF
- **👤 Receptor**: Datos del destinatario (nombre, Cédula/RIF, email, dirección, ciudad, estado, país)
- **📝 Servicio**: Descripción opcional del servicio prestado
- **📦 Artículos**: Lista de productos con nombre, cantidad y precio

### 2. **Validación con Zod**
Esquemas definidos en `FormTypes.ts`:
- `formValidationSchema`: Valida todos los campos del formulario
- `articleSchema`: Valida cada artículo individual
- Integrado con react-hook-form via `zodResolver`

### 3. **Generación de PDF**
- Template profesional con colores corporativos
- Número de nota generado aleatoriamente (8 dígitos)
- Fecha automática al momento de generar
- Tabla de artículos con subtotales
- Descarga automática via `file-saver`

### 4. **Responsive Design**
- Vista de formulario optimizada para móvil
- PDFViewer en desktop, pantalla de éxito en móvil
- Barra de progreso visual
- Quick summary flotante en móvil

---

## 📊 Tipos de Datos Principales

```typescript
// Artículo individual
type Article = {
  id: string;
  nameItem: string;
  quantity: string;
  price: string;
};

// Datos del formulario
type DataForm = {
  companyName: string;
  companyId: string;
  nameReceiver: string;
  receiverId: string;
  emailReceiver: string;
  streetReceiver: string;
  stateReceiver: string;
  cityReceiver: string;
  countryReceiver: string;
  serviceDescription: string;
  articles: Article[];
};

// Factura completa (extiende DataForm)
type Invoice = DataForm & {
  totalAmount: number;
  date: string;
  inVoiceNumber: string;
};
```

---

## ⚙️ Configuración

### Variables de Entorno (`.env`)
```env
NEXT_PUBLIC_COMPANY_NAME=NombreEmpresa
```

### Valores por Defecto
Configurados en `src/config/senderDefaults.ts`:
```typescript
export const senderDefaults = {
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || "",
};
```

---

## 🎨 Sistema de Diseño

### Colores del PDF (`InVoicePDF.tsx`)
```javascript
const colors = {
  primary: "#1a365d",    // Azul oscuro
  secondary: "#2d3748",  // Gris oscuro
  accent: "#3182ce",     // Azul brillante
  light: "#f7fafc",      // Gris claro
  border: "#e2e8f0",     // Borde
  text: "#2d3748",       // Texto
  muted: "#718096",      // Texto secundario
};
```

### TailwindCSS
- Usa variables CSS HSL para theming (`globals.css`)
- Dark mode configurado (por clase)
- Animaciones via `tailwindcss-animate`

---

## 🔧 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm start

# Linting
npm run lint
```

---

## 📝 Flujo de la Aplicación

```
┌─────────────────────────────────────────────────────────────┐
│                     page.tsx (Home)                         │
│                           │                                 │
│                    FormComponent                            │
│                           │                                 │
│    ┌──────────────────────┼──────────────────────┐         │
│    │                      │                      │         │
│ Sección 0            Sección 1-2            Sección 3      │
│ (Empresa)            (Receptor/             (Artículos)    │
│                       Servicio)                            │
│    │                      │                      │         │
│    └──────────────────────┼──────────────────────┘         │
│                           │                                 │
│                    handleSubmit                             │
│                           │                                 │
│              ┌────────────┴────────────┐                   │
│              │                         │                   │
│        Generar PDF              Guardar archivo            │
│       (InVoicePDF)               (file-saver)              │
│              │                         │                   │
│              └────────────┬────────────┘                   │
│                           │                                 │
│                  Mostrar resultado                          │
│            (PDFViewer desktop / Success móvil)              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔗 Dependencias Clave

### Core
- **@react-pdf/renderer**: Renderizado de PDF en React
- **react-hook-form**: Control de formularios performante
- **@hookform/resolvers**: Integración con Zod

### UI
- **@radix-ui/react-***: Primitivos accesibles para componentes
- **class-variance-authority**: Variantes de componentes
- **clsx + tailwind-merge**: Utilidades para clases CSS

---

## 🚀 Próximas Mejoras Potenciales

1. **Persistencia**: Guardar borradores en localStorage
2. **Multi-idioma**: Soporte i18n
3. **Templates**: Diferentes diseños de PDF
4. **Logo empresa**: Subir imagen para el PDF
5. **Historial**: Almacenar notas generadas
6. **Exportar Excel**: Alternativa al PDF
7. **Impuestos**: Calcular IVA automáticamente

---

## 📅 Última Actualización
Febrero 2026
