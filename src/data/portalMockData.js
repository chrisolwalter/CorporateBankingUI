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
    {
      id: "ba-fr-100",
      label: "Paris Metals SARL • FR761245800001 • France",
      name: "Paris Metals SARL",
      accountNumber: "FR761245800001",
      country: "France",
      beneficiaryAddress: "42 Rue de Lyon, Paris, France",
      bankName: "BNP Paribas Paris",
      bankAddress: "16 Boulevard des Italiens, Paris, France",
      swiftCode: "BNPAFRPP",
      currency: "EUR"
    },
    {
      id: "ba-in-101",
      label: "Mumbai Logistics Pvt Ltd • IN59HDFC001122 • India",
      name: "Mumbai Logistics Pvt Ltd",
      accountNumber: "IN59HDFC001122",
      country: "India",
      beneficiaryAddress: "12 Andheri East, Mumbai, India",
      bankName: "HDFC Bank Mumbai",
      bankAddress: "Trade Centre, BKC, Mumbai, India",
      swiftCode: "HDFCINBB",
      ifscCode: "HDFC0001122",
      currency: "INR"
    },
    {
      id: "ba-ae-102",
      label: "Desert Utilities LLC • AE07NBDU884411 • UAE",
      name: "Desert Utilities LLC",
      accountNumber: "AE07NBDU884411",
      country: "UAE",
      beneficiaryAddress: "Sheikh Zayed Road, Dubai, UAE",
      bankName: "Emirates NBD",
      bankAddress: "Baniyas Road, Deira, Dubai, UAE",
      swiftCode: "EBILAEAD",
      uaeRoutingCode: "AERTR2244",
      currency: "AED"
    },
    {
      id: "ba-cn-103",
      label: "Shanghai Industrial Co • CN22ICBC667788 • China",
      name: "Shanghai Industrial Co",
      accountNumber: "CN22ICBC667788",
      country: "China",
      beneficiaryAddress: "88 Pudong Avenue, Shanghai, China",
      bankName: "ICBC Shanghai",
      bankAddress: "55 Lujiazui Ring Rd, Shanghai, China",
      swiftCode: "ICBKCNBJ",
      currency: "CNY"
    },
    {
      id: "ba-uk-104",
      label: "Zenith Equipment Ltd • GB99ABCD120039 • United Kingdom",
      name: "Zenith Equipment Ltd",
      accountNumber: "GB99ABCD120039",
      country: "United Kingdom",
      beneficiaryAddress: "10 Bishopsgate, London, UK",
      bankName: "Barclays Corporate London",
      bankAddress: "1 Churchill Place, London, UK",
      swiftCode: "BARCGB22",
      sortCode: "20-11-44",
      currency: "GBP"
    },
    {
      id: "ba-de-105",
      label: "Nova Industrial GmbH • DE4450010517 • Germany",
      name: "Nova Industrial GmbH",
      accountNumber: "DE4450010517",
      country: "Germany",
      beneficiaryAddress: "77 Hafenstraße, Hamburg, Germany",
      bankName: "Deutsche Bank Hamburg",
      bankAddress: "Adolphsplatz 7, Hamburg, Germany",
      swiftCode: "DEUTDEHH",
      currency: "EUR"
    },
    {
      id: "ba-jp-106",
      label: "Sakura Supplies KK • JP22MIZU000911 • Japan",
      name: "Sakura Supplies KK",
      accountNumber: "JP22MIZU000911",
      country: "Japan",
      beneficiaryAddress: "3-5 Marunouchi, Tokyo, Japan",
      bankName: "Mizuho Bank Tokyo",
      bankAddress: "1-1 Otemachi, Tokyo, Japan",
      swiftCode: "MHCBJPJT",
      currency: "JPY"
    },
    {
      id: "ba-us-107",
      label: "Maple Tech Inc • US11CHAS778899 • United States",
      name: "Maple Tech Inc",
      accountNumber: "US11CHAS778899",
      country: "United States",
      beneficiaryAddress: "500 Market St, San Francisco, USA",
      bankName: "JPMorgan Chase San Francisco",
      bankAddress: "560 Mission St, San Francisco, USA",
      swiftCode: "CHASUS33",
      fedwireCode: "021000021",
      currency: "USD"
    }
  ],
  intermediaryBanks: [
    { id: "ib-001", label: "Standard Chartered London" },
    { id: "ib-002", label: "JPMorgan New York" },
    { id: "ib-003", label: "HSBC Hong Kong" },
    { id: "ib-004", label: "Deutsche Bank Frankfurt" }
  ],
  transferCurrencies: [
    { id: "USD", label: "USD" },
    { id: "EUR", label: "EUR" },
    { id: "GBP", label: "GBP" },
    { id: "AED", label: "AED" },
    { id: "CNY", label: "CNY (Chinese Yuan)" },
    { id: "INR", label: "INR" }
  ],
  valueDateOptions: ["Today", "Next Business Day", "Customer Date"],
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
