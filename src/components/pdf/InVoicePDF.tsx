import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Invoice } from "@/types/FormTypes";

export type { Invoice } from "@/types/FormTypes";

const colors = {
  primary: "#1a365d",
  secondary: "#2d3748",
  accent: "#3182ce",
  light: "#f7fafc",
  border: "#e2e8f0",
  text: "#2d3748",
  muted: "#718096",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: `2px solid ${colors.accent}`,
  },
  companySection: {
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  documentTitle: {
    fontSize: 12,
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  invoiceInfo: {
    textAlign: "right",
    alignItems: "flex-end",
  },
  invoiceNumber: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  invoiceDate: {
    fontSize: 10,
    color: colors.muted,
  },
  receiverSection: {
    marginBottom: 25,
  },
  infoBox: {
    padding: 15,
    backgroundColor: colors.light,
    borderRadius: 4,
  },
  infoTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: `1px solid ${colors.border}`,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 9,
    color: colors.muted,
    width: 70,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 10,
    color: colors.text,
    flex: 1,
  },
  infoValueBold: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.secondary,
    flex: 1,
  },
  descriptionSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: colors.light,
    borderRadius: 4,
    borderLeft: `3px solid ${colors.accent}`,
  },
  descriptionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.5,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    padding: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: "#ffffff",
  },
  tableRowAlt: {
    backgroundColor: colors.light,
  },
  tableCell: {
    fontSize: 10,
    color: colors.text,
  },
  colNum: { width: "8%" },
  colDesc: { width: "37%" },
  colPrice: { width: "18%", textAlign: "right" },
  colQty: { width: "17%", textAlign: "center" },
  colTotal: { width: "20%", textAlign: "right" },
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 30,
  },
  totalsBox: {
    width: 200,
    padding: 15,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    color: "#ffffff",
    opacity: 0.9,
  },
  totalValue: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "bold",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    marginTop: 8,
    borderTop: "1px solid rgba(255,255,255,0.3)",
  },
  grandTotalLabel: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "bold",
  },
  grandTotalValue: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    paddingTop: 15,
    borderTop: `1px solid ${colors.border}`,
  },
  footerText: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 3,
  },
  thankYou: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: "bold",
    marginTop: 8,
  },
});

export const InVoicePDF = (invoice: Invoice) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.companySection}>
          <Text style={styles.companyName}>{invoice.companyName}</Text>
          <Text style={styles.documentTitle}>Nota de Entrega</Text>
        </View>
        <View style={styles.invoiceInfo}>
          <Text style={styles.invoiceNumber}>N° {invoice.inVoiceNumber}</Text>
          <Text style={styles.invoiceDate}>{invoice.date}</Text>
        </View>
      </View>

      {/* Receiver Info - Detailed */}
      <View style={styles.receiverSection}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Datos del destinatario</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoValueBold}>{invoice.nameReceiver}</Text>
          </View>

          {invoice.emailReceiver && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{invoice.emailReceiver}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dirección:</Text>
            <Text style={styles.infoValue}>{invoice.streetReceiver}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ciudad:</Text>
            <Text style={styles.infoValue}>{invoice.cityReceiver}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado:</Text>
            <Text style={styles.infoValue}>{invoice.stateReceiver}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>País:</Text>
            <Text style={styles.infoValue}>{invoice.countryReceiver}</Text>
          </View>
        </View>
      </View>

      {/* Service Description - Only if provided */}
      {invoice.serviceDescription && (
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionTitle}>Descripción del servicio</Text>
          <Text style={styles.descriptionText}>
            {invoice.serviceDescription}
          </Text>
        </View>
      )}

      {/* Articles Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colNum]}>#</Text>
          <Text style={[styles.tableHeaderText, styles.colDesc]}>
            Descripción
          </Text>
          <Text style={[styles.tableHeaderText, styles.colPrice]}>Precio</Text>
          <Text style={[styles.tableHeaderText, styles.colQty]}>Cant.</Text>
          <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
        </View>
        {invoice.articles.map((article, index) => (
          <View
            style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
            key={article.id}
          >
            <Text style={[styles.tableCell, styles.colNum]}>{index + 1}</Text>
            <Text style={[styles.tableCell, styles.colDesc]}>
              {article.nameItem}
            </Text>
            <Text style={[styles.tableCell, styles.colPrice]}>
              ${parseFloat(article.price).toFixed(2)}
            </Text>
            <Text style={[styles.tableCell, styles.colQty]}>
              {article.quantity}
            </Text>
            <Text style={[styles.tableCell, styles.colTotal]}>
              $
              {(
                parseFloat(article.price) * parseFloat(article.quantity)
              ).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>
              ${Number(invoice.totalAmount).toFixed(2)}
            </Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>TOTAL</Text>
            <Text style={styles.grandTotalValue}>
              ${Number(invoice.totalAmount).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{invoice.companyName}</Text>
        <Text style={styles.thankYou}>¡Gracias por su preferencia!</Text>
      </View>
    </Page>
  </Document>
);
