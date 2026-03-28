export const transferMockData = {
  mandatoryFields: [
    { id: "beneficiary-name", label: "Beneficiary Name", value: "Zenith Equipment Ltd.", status: "complete" },
    { id: "beneficiary-account", label: "Beneficiary Account", value: "GB22 BUKB 2020 1555 5555 55", status: "complete" },
    { id: "debit-account", label: "Debit Account", value: "US11 CHAS 0001 2345 6789", status: "complete" },
    { id: "transfer-amount", label: "Transfer Amount", value: "USD 48,500.00", status: "complete" },
    { id: "value-date", label: "Value Date", value: "2026-03-29", status: "pending" },
    { id: "payment-purpose", label: "Payment Purpose", value: "Vendor settlement", status: "complete" }
  ],
  optionalFields: [
    { id: "invoice-ref", label: "Invoice Reference", value: "INV-2026-0448", status: "complete" },
    { id: "instruction-code", label: "Instruction Code", value: "CHQB", status: "pending" },
    { id: "sender-to-receiver", label: "Sender To Receiver", value: "Notify treasury desk on execution", status: "complete" },
    { id: "intermediary-bank", label: "Intermediary Bank", value: "Not Provided", status: "pending" }
  ],
  accountInfo: {
    company: "Northwind Corporate Holdings",
    accountName: "Global Operations Account",
    accountNumber: "**** 6789",
    availableBalance: "USD 1,240,000.00",
    dailyLimit: "USD 300,000.00",
    usedToday: "USD 212,450.00"
  },
  chargesFx: {
    chargeType: "SHA (Shared)",
    fxRequired: true,
    debitCurrency: "USD",
    beneficiaryCurrency: "GBP",
    indicativeRate: "1 USD = 0.7811 GBP",
    estimatedBeneficiaryAmount: "GBP 37,873.35",
    estimatedFee: "USD 45.00"
  },
  validationStatus: [
    { id: "sanctions", label: "Sanctions Screening", state: "passed" },
    { id: "account-format", label: "Account Format", state: "passed" },
    { id: "cutoff", label: "Cut-off Validation", state: "warning" },
    { id: "balance", label: "Balance Check", state: "passed" },
    { id: "approval", label: "Approval Matrix", state: "pending" }
  ],
  transferSummary: {
    transferType: "Single International Transfer",
    transferChannel: "SWIFT",
    executionSpeed: "Standard",
    scheduledTime: "2026-03-29 10:30 UTC",
    preparedBy: "Alicia Brooks",
    totalDebit: "USD 48,545.00"
  }
};
