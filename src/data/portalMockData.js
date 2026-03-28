export const portalMockData = {
  countries: [
    { code: "FR", label: "France 🇫🇷", languages: ["English", "French"] },
    { code: "IN", label: "India 🇮🇳", languages: ["English", "Hindi"] },
    { code: "AE", label: "UAE 🇦🇪", languages: ["English", "Arabic"] },
    { code: "CN", label: "China 🇨🇳", languages: ["English"] }
  ],
  debitAccounts: [
    { id: "da-001", label: "US-OPS-001 • USD • ****3456", currency: "USD", availableBalance: 1240000, dailyLimit: 300000 },
    { id: "da-002", label: "EU-TRE-883 • EUR • ****7781", currency: "EUR", availableBalance: 572100, dailyLimit: 200000 },
    { id: "da-003", label: "UK-HQ-120 • GBP • ****0034", currency: "GBP", availableBalance: 389500, dailyLimit: 180000 }
  ],
  beneficiaryAccounts: [
    { id: "ba-100", label: "Zenith Equipment Ltd • GB99ABCD120039 • United Kingdom", currency: "GBP" },
    { id: "ba-101", label: "Nova Industrial GmbH • DE4450010517 • Germany", currency: "EUR" },
    { id: "ba-102", label: "Sakura Supplies KK • JP22MIZU000911 • Japan", currency: "JPY" }
  ],
  transferCurrencies: [
    { id: "USD", label: "USD" },
    { id: "EUR", label: "EUR" },
    { id: "GBP", label: "GBP" },
    { id: "AED", label: "AED" },
    { id: "CNY", label: "CNY (Chinese Yuan)" },
    { id: "INR", label: "INR" }
  ],
  valueDateOptions: ["Today", "Next Business Day", "Custom Date"],
  paymentPurposeOptions: ["Vendor Payment", "Payroll", "Intercompany", "Tax Settlement"],
  chargesBearerOptions: ["SHA", "OUR", "BEN"],
  derivedDefaults: {
    fxRates: {
      "USD-EUR": 0.92,
      "USD-GBP": 0.78,
      "USD-AED": 3.67,
      "USD-CNY": 7.21,
      "USD-INR": 83.1,
      "EUR-GBP": 0.85,
      "EUR-AED": 3.99,
      "EUR-CNY": 7.84,
      "EUR-INR": 90.2,
      "GBP-AED": 4.68,
      "GBP-CNY": 9.21,
      "GBP-INR": 105.8,
      "AED-CNY": 1.96,
      "AED-INR": 22.6,
      "CNY-INR": 11.5
    },
    estimatedFee: 32.5,
    validationStatus: "Ready for authorization",
    cutoffStatus: "Within same-day cut-off"
  }
};
