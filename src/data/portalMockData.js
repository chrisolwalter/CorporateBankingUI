export const portalMockData = {
  languages: ["English", "Spanish", "French", "German"],
  countries: ["United States", "United Kingdom", "Singapore", "United Arab Emirates"],
  debitAccounts: [
    { id: "da-001", label: "US-OPS-001 • USD • ****3456", currency: "USD", availableBalance: 1240000 },
    { id: "da-002", label: "US-TRE-883 • USD • ****7781", currency: "USD", availableBalance: 572100 },
    { id: "da-003", label: "EU-HQ-120 • EUR • ****0034", currency: "EUR", availableBalance: 389500 }
  ],
  beneficiaryAccounts: [
    { id: "ba-100", label: "Zenith Equipment Ltd • GB99ABCD120039", currency: "GBP" },
    { id: "ba-101", label: "Nova Industrial GmbH • DE4450010517", currency: "EUR" },
    { id: "ba-102", label: "Sakura Supplies KK • JP22MIZU000911", currency: "JPY" }
  ],
  valueDateOptions: ["Today", "Next Business Day", "Custom Date"],
  paymentPurposeOptions: ["Vendor Payment", "Payroll", "Intercompany", "Tax Settlement"],
  chargesBearerOptions: ["SHA", "OUR", "BEN"],
  derivedDefaults: {
    fxRates: {
      "USD-GBP": 0.78,
      "USD-EUR": 0.92,
      "USD-JPY": 148.2,
      "EUR-GBP": 0.85,
      "EUR-EUR": 1,
      "EUR-JPY": 161.7
    },
    estimatedFee: 32.5,
    validationStatus: "Ready for authorization",
    cutoffStatus: "Within same-day cut-off"
  }
};
