export const portalMockData = {
  countries: [
    { code: "GLOBAL", label: "Global", flag: "🌐", languages: ["English"] },
    { code: "FR", label: "France", flag: "🇫🇷", languages: ["English", "French"] },
    { code: "IN", label: "India", flag: "🇮🇳", languages: ["English", "Hindi"] },
    { code: "AE", label: "UAE", flag: "🇦🇪", languages: ["English", "Arabic"] },
    { code: "CN", label: "China", flag: "🇨🇳", languages: ["English"] }
  ],
  debitAccounts: [
    { id: "da-fr-001", countryCode: "FR", label: "FR-OPS-001 • EUR • ****1048", currency: "EUR", availableBalance: 920000, dailyLimit: 260000 },
    { id: "da-fr-002", countryCode: "FR", label: "FR-TRE-220 • EUR • ****7731", currency: "EUR", availableBalance: 430000, dailyLimit: 150000 },
    { id: "da-in-001", countryCode: "IN", label: "IN-OPS-712 • INR • ****8892", currency: "INR", availableBalance: 12500000, dailyLimit: 3500000 },
    { id: "da-in-002", countryCode: "IN", label: "IN-HQ-330 • USD • ****5524", currency: "USD", availableBalance: 640000, dailyLimit: 180000 },
    { id: "da-ae-001", countryCode: "AE", label: "AE-OPS-440 • AED • ****0098", currency: "AED", availableBalance: 3250000, dailyLimit: 900000 },
    { id: "da-ae-002", countryCode: "AE", label: "AE-TRE-778 • USD • ****4512", currency: "USD", availableBalance: 780000, dailyLimit: 240000 },
    { id: "da-cn-001", countryCode: "CN", label: "CN-OPS-202 • CNY • ****0901", currency: "CNY", availableBalance: 9800000, dailyLimit: 2100000 },
    { id: "da-cn-002", countryCode: "CN", label: "CN-HQ-855 • USD • ****6710", currency: "USD", availableBalance: 510000, dailyLimit: 170000 }
  ],
  beneficiaryAccounts: [
    { id: "ba-fr-100", label: "Paris Metals SARL • FR761245800001 • France", currency: "EUR" },
    { id: "ba-in-101", label: "Mumbai Logistics Pvt Ltd • IN59HDFC001122 • India", currency: "INR" },
    { id: "ba-ae-102", label: "Desert Utilities LLC • AE07NBDU884411 • UAE", currency: "AED" },
    { id: "ba-cn-103", label: "Shanghai Industrial Co • CN22ICBC667788 • China", currency: "CNY" },
    { id: "ba-uk-104", label: "Zenith Equipment Ltd • GB99ABCD120039 • United Kingdom", currency: "GBP" },
    { id: "ba-de-105", label: "Nova Industrial GmbH • DE4450010517 • Germany", currency: "EUR" },
    { id: "ba-jp-106", label: "Sakura Supplies KK • JP22MIZU000911 • Japan", currency: "JPY" },
    { id: "ba-us-107", label: "Maple Tech Inc • US11CHAS778899 • United States", currency: "USD" }
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
  senderPurposeCodeOptions: ["SALA", "GDSV", "TRAD", "TAXS"],
  chargesBearerOptions: [
    { code: "OUR", label: "OUR - We pay all charges" },
    { code: "SHA", label: "SHA - Charges are shared" },
    { code: "BEN", label: "BEN - Beneficiary pays all charges" }
  ],
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
