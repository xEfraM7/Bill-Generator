"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FormField } from "./FormField";
import { ClientSelector } from "./ClientSelector";
import { DocumentInput } from "./DocumentInput";
import { LogoUploader } from "./LogoUploader";
import { ShareButton } from "./ShareButton";
import { useForm, Controller } from "react-hook-form";
import { formDynamicsReceiver } from "@/json/formJson";
import { FormArticleComponent } from "./FormArticleComponent";
import { useState, useMemo, useEffect } from "react";
import { InVoicePDF } from "../pdf/InVoicePDF";
import useArticles from "@/hooks/useArticles";
import useSavedClients from "@/hooks/useSavedClients";
import useSavedCompany from "@/hooks/useSavedCompany";
import useLogo from "@/hooks/useLogo";
import useInvoiceHistory from "@/hooks/useInvoiceHistory";
import { getFormattedDate } from "@/hooks/useDate";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataForm, Invoice, formValidationSchema, SavedClient } from "@/types/FormTypes";
import { senderDefaults } from "@/config/senderDefaults";
import saveAs from "file-saver";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { toast } from "sonner";

export const FormComponent = () => {
  const [screenDisplay, setScreenDisplay] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<Invoice | null>(null);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();

  // Hooks de persistencia
  const { clients, saveClient, deleteClient, isLoaded: clientsLoaded } = useSavedClients();
  const { company, saveCompany, isLoaded: companyLoaded } = useSavedCompany();
  const { logo } = useLogo();
  const { addToHistory } = useInvoiceHistory();
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const {
    handleSubmit,
    control,
    register,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<DataForm>({
    defaultValues: {
      ...senderDefaults,
      companyId: "",
      nameReceiver: "",
      receiverId: "",
      emailReceiver: "",
      streetReceiver: "",
      stateReceiver: "",
      cityReceiver: "",
      countryReceiver: "",
      serviceDescription: "",
      articles: [],
    },
    resolver: zodResolver(formValidationSchema),
  });

  const articles = watch("articles");

  const currentTotal = useMemo(() => {
    return articles.reduce((acc, article) => {
      const price = parseFloat(article.price) || 0;
      const quantity = parseFloat(article.quantity) || 0;
      return acc + price * quantity;
    }, 0);
  }, [articles]);

  const handleBack = () => {
    setScreenDisplay(false);
    setFormState(null);
  };

  const { handleChangeArticle, handleRemoveArticle } = useArticles(
    watch,
    setValue
  );

  // Cargar datos de empresa guardados
  useEffect(() => {
    if (companyLoaded && company) {
      setValue("companyName", company.name);
      setValue("companyId", company.id);
    }
  }, [companyLoaded, company, setValue]);

  // Manejar selección de cliente guardado
  const handleSelectClient = (client: SavedClient) => {
    setSelectedClientId(client.id);
    setValue("nameReceiver", client.name);
    setValue("receiverId", client.receiverId);
    setValue("emailReceiver", client.email || "");
    setValue("streetReceiver", client.street || "");
    setValue("cityReceiver", client.city || "");
    setValue("stateReceiver", client.state || "");
    setValue("countryReceiver", client.country || "");
  };

  // Guardar cliente actual
  const handleSaveCurrentClient = () => {
    const name = watch("nameReceiver");
    const receiverId = watch("receiverId");
    if (name && receiverId) {
      saveClient({
        name,
        receiverId,
        email: watch("emailReceiver"),
        street: watch("streetReceiver"),
        city: watch("cityReceiver"),
        state: watch("stateReceiver"),
        country: watch("countryReceiver"),
      });
      setSelectedClientId(undefined);
    }
  };

  // Guardar datos de empresa
  const handleSaveCompany = () => {
    const name = watch("companyName");
    const id = watch("companyId");
    if (name && id) {
      saveCompany({ name, id });
    }
  };

  const generateRandomNumber = (length: number) => {
    const randomNumber = Math.floor(Math.random() * Math.pow(10, length));
    return String(randomNumber).padStart(length, "0");
  };

  const saveFile = async (filename: string, invoiceData: Invoice) => {
    const blob = await pdf(<InVoicePDF {...invoiceData} />).toBlob();
    const finalFilename = invoiceData.customFilename || filename;
    saveAs(blob, `${finalFilename}.pdf`);
  };

  const onSubmit = async (data: DataForm) => {
    setIsLoading(true);

    try {
      const totalAmount = data.articles.reduce((acc, article) => {
        const price = parseFloat(article.price) || 0;
        const quantity = parseFloat(article.quantity) || 0;
        return acc + price * quantity;
      }, 0);

      const invoiceNumber = generateRandomNumber(8);
      const invoiceData: Invoice = {
        ...data,
        totalAmount,
        date: getFormattedDate(),
        inVoiceNumber: invoiceNumber,
        logo: logo || undefined, // Add logo if exists
      };

      // Generate PDF blob for sharing
      const blob = await pdf(<InVoicePDF {...invoiceData} />).toBlob();
      setPdfBlob(blob);

      // Save to history
      addToHistory(invoiceData);

      setFormState(invoiceData);

      const finalFilename = data.customFilename || invoiceNumber;
      saveAs(blob, `${finalFilename}.pdf`);
      setScreenDisplay(true);
      toast.success("¡Nota de entrega generada!");
    } catch (error) {
      console.error("Error generando PDF:", error);
      toast.error("Error al generar el PDF");
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    { id: 0, title: "Empresa", icon: "🏢" },
    { id: 1, title: "Receptor", icon: "👤" },
    { id: 2, title: "Servicio", icon: "📝" },
    { id: 3, title: "Artículos", icon: "📦" },
  ];

  const validateSection = async (sectionId: number): Promise<boolean> => {
    const fieldsToValidate: Record<number, (keyof DataForm)[]> = {
      0: ["companyName", "companyId"],
      1: [
        "nameReceiver",
        "receiverId",
        "emailReceiver",
        "streetReceiver",
        "stateReceiver",
        "cityReceiver",
        "countryReceiver",
      ],
      2: ["serviceDescription"],
      3: ["articles", "customFilename"],
    };
    return await trigger(fieldsToValidate[sectionId]);
  };

  const handleNextSection = async () => {
    const isValid = await validateSection(activeSection);
    if (isValid && activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1);
    }
  };

  const handlePrevSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
    }
  };

  if (screenDisplay && formState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Desktop PDF Viewer */}
        <PDFViewer className="h-screen w-full hidden lg:flex">
          <InVoicePDF {...formState} />
        </PDFViewer>

        {/* Mobile Success Screen */}
        <div className="lg:hidden flex flex-col items-center justify-center min-h-screen gap-6 p-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              ¡Nota generada!
            </h2>
            <p className="text-slate-600">
              El PDF ha sido descargado a tu dispositivo.
            </p>
            <p className="text-sm text-slate-500 mt-2">
              N° {formState.inVoiceNumber}
            </p>
          </div>
          <div className="w-full max-w-sm space-y-3">
            <Button
              onClick={handleBack}
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
            >
              Crear otra nota
            </Button>
            <div className="flex gap-3">
              <Button
                onClick={() => saveFile(formState.inVoiceNumber, formState)}
                variant="outline"
                className="flex-1 h-12"
              >
                📥 Descargar
              </Button>
              <ShareButton
                pdfBlob={pdfBlob}
                fileName={`${formState.customFilename || formState.inVoiceNumber}.pdf`}
                title={`Nota de Entrega #${formState.inVoiceNumber}`}
              />
            </div>
          </div>
        </div>

        {/* Desktop Back Button */}
        <Button
          onClick={handleBack}
          className="absolute top-4 left-4 hidden lg:flex"
          variant="outline"
        >
          ← Volver al formulario
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 px-3 sm:py-8 sm:px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Nota de Entrega
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Genera tu documento en segundos
          </p>
        </div>

        {/* Progress Steps - Mobile */}
        <div className="flex justify-between mb-6 px-2">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(index)}
              className={`flex flex-col items-center transition-all ${index === activeSection
                ? "scale-110"
                : index < activeSection
                  ? "opacity-70"
                  : "opacity-40"
                }`}
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl mb-1 transition-colors ${index === activeSection
                  ? "bg-blue-600 text-white shadow-lg"
                  : index < activeSection
                    ? "bg-green-500 text-white"
                    : "bg-slate-200 text-slate-500"
                  }`}
              >
                {index < activeSection ? "✓" : section.icon}
              </div>
              <span
                className={`text-xs font-medium ${index === activeSection ? "text-blue-600" : "text-slate-500"
                  }`}
              >
                {section.title}
              </span>
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-200 rounded-full mb-6 mx-2">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{
              width: `${((activeSection + 1) / sections.length) * 100}%`,
            }}
          />
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="text-2xl">{sections[activeSection].icon}</span>
              {sections[activeSection].title}
            </CardTitle>
            <CardDescription>
              {activeSection === 0 && "Nombre que aparecerá en el documento"}
              {activeSection === 1 && "Datos de quien recibe la entrega"}
              {activeSection === 2 && "Describe el servicio prestado"}
              {activeSection === 3 && "Agrega los artículos entregados"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Section 0: Company Name */}
              {activeSection === 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-base">
                      Nombre de la empresa
                    </Label>
                    <Controller
                      name="companyName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="companyName"
                          placeholder="Mi Empresa S.A."
                          className="h-14 text-lg"
                        />
                      )}
                    />
                    {errors.companyName && (
                      <span className="text-red-500 text-sm">
                        {errors.companyName.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyId" className="text-base">
                      Cédula / RIF de la empresa
                    </Label>
                    <Controller
                      name="companyId"
                      control={control}
                      render={({ field }) => (
                        <DocumentInput
                          value={field.value}
                          onChange={field.onChange}
                          id="companyId"
                          placeholder="12345678"
                          className=""
                        />
                      )}
                    />
                    {errors.companyId && (
                      <span className="text-red-500 text-sm">
                        {errors.companyId.message}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500">
                      💡 Este nombre aparecerá como título principal en tu nota de
                      entrega.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSaveCompany}
                      className="ml-2 shrink-0"
                    >
                      💾 Guardar empresa
                    </Button>
                  </div>

                  {/* Logo upload section */}
                  <LogoUploader />
                </div>
              )}

              {/* Section 1: Receiver Data */}
              {activeSection === 1 && (
                <div className="space-y-4">
                  {/* Selector de clientes guardados */}
                  {clientsLoaded && (
                    <ClientSelector
                      clients={clients}
                      onSelect={handleSelectClient}
                      onDelete={deleteClient}
                      selectedClientId={selectedClientId}
                    />
                  )}

                  {clients.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-slate-600 mb-3">O ingresa un nuevo cliente:</p>
                    </div>
                  )}

                  {formDynamicsReceiver.map((field, index) => (
                    <div key={index}>
                      <FormField
                        {...field}
                        control={control}
                        error={errors[field.name as keyof DataForm] as any}
                      />
                    </div>
                  ))}

                  {/* Botón para guardar cliente */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveCurrentClient}
                    className="w-full mt-2"
                    disabled={!watch("nameReceiver") || !watch("receiverId")}
                  >
                    💾 Guardar este cliente para uso futuro
                  </Button>
                </div>
              )}

              {/* Section 2: Service Description */}
              {activeSection === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceDescription" className="text-base">
                      Descripción del servicio (Opcional)
                    </Label>
                    <Textarea
                      id="serviceDescription"
                      placeholder="Describe el servicio prestado o los detalles de la entrega..."
                      className="min-h-[150px] text-base"
                      {...register("serviceDescription")}
                    />
                    {errors.serviceDescription && (
                      <span className="text-red-500 text-sm">
                        {errors.serviceDescription.message}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Section 3: Articles */}
              {activeSection === 3 && (
                <div className="space-y-4">
                  <FormArticleComponent
                    handleChangeArticle={handleChangeArticle}
                    handleRemoveArticle={handleRemoveArticle}
                    articles={articles}
                    control={control}
                  />
                  {errors.articles && (
                    <span className="text-red-500 text-sm block mt-2">
                      {errors.articles.message}
                    </span>
                  )}

                  {/* Total Display */}
                  {articles.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-100">Total estimado</span>
                        <span className="text-2xl font-bold">
                          ${currentTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="customFilename" className="text-base">
                      Nombre del archivo (Opcional)
                    </Label>
                    <Controller
                      name="customFilename"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="customFilename"
                          placeholder="Ej: Nota entrega Cliente X"
                          className="h-12"
                        />
                      )}
                    />
                    <p className="text-sm text-slate-500">
                      Si lo dejas vacío, se usará el número de nota aleatorio.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-8">
                {activeSection > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevSection}
                    className="flex-1 h-14"
                  >
                    ← Anterior
                  </Button>
                )}

                {activeSection < sections.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNextSection}
                    className="flex-1 h-14 bg-blue-600 hover:bg-blue-700"
                  >
                    Siguiente →
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-14 bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Generando...
                      </span>
                    ) : (
                      "Generar PDF 📄"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick Summary - Mobile */}
        {articles.length > 0 && activeSection !== 3 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 lg:hidden">
            <div className="flex justify-between items-center max-w-2xl mx-auto">
              <div>
                <p className="text-sm text-slate-500">
                  {articles.length} artículo{articles.length !== 1 ? "s" : ""}
                </p>
                <p className="text-lg font-bold text-slate-800">
                  ${currentTotal.toFixed(2)}
                </p>
              </div>
              <Button
                onClick={() => setActiveSection(3)}
                variant="outline"
                size="sm"
              >
                Ver artículos
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
