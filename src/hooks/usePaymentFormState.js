import { useEffect, useMemo, useState } from "react";
import { portalMockData } from "../data/portalMockData";

const DEFAULT_CONFIRMATION_REFERENCE = "CBPS-20260328-104582";

const LABELS = {
  en: {
    header_title: "Corporate Banking Payment Services", current_time: "Current Time", language: "Language", country: "Country",
    initiate: "Initiate", review: "Review", confirmation: "Confirmation", complete: "complete", step: "Step",
    trading_portal: "Trading Portal", corporate_banking: "Corporate Banking", payments: "Payments", single_payments: "Single Payments",
    single_payments_v2: "Single Payments V2", primary_navigation: "primary navigation", expand_sidebar: "Expand sidebar", collapse_sidebar: "Collapse sidebar",
    search_debit_account: "Select debit account", search_beneficiary: "Select beneficiary", search_currency: "Select amount currency", enter_amount: "Enter amount",
    select_code: "Select purpose code", select_intermediary_bank: "Select intermediary bank", no_selection: "— No selection —", no_matching_results: "No matching results",
    email_help: "Enter up to 5 emails, separated by commas or new lines", email_error: "You can enter up to 5 email addresses.", remarks_placeholder: "Enter remarks",
    amount_mode: "amount mode", debit: "Debit", pay: "Pay", pending_beneficiary_selection: "Pending beneficiary selection", cutoff_passed: "Cut-off passed", within_cutoff: "Within cut-off",
    rolled_next_business_day: "rolled to next business day", not_required: "Not required", mode: "Mode", not_selected: "Not selected", rolled: "rolled",
    your_payment_submitted: "Your payment has been successfully submitted.", reference: "Reference", corporate_authorization_steps: "Corporate Authorization Steps", bank_processing_steps: "Bank Processing Steps",
    initiated_by_maker: "Initiated by Maker", awaiting_checker_authorization: "Awaiting Checker Authorization", checker_approved: "Checker Approved", released_to_bank: "Released to Bank",
    payment_instruction_received: "Payment Instruction Received", beneficiary_credit: "Beneficiary Credit", completed: "Completed", in_progress: "In Progress", pending: "Pending",
    single_payment_details: "Single Payment Details", debit_account: "Debit Account", beneficiary: "Beneficiary", amount_currency: "Amount Currency", amount: "Amount",
    payment_purpose: "Payment Purpose", sender_purpose_code: "Sender Purpose Code", additional_information: "Additional Information", value_date: "Value Date", today: "Today", next_business_day: "Next Business Day", custom_date: "Custom Date",
    debit_value_date: "Debit Value Date", intermediary_bank: "Intermediary Bank", charges_bearer: "Charges Bearer", upload_documents: "Upload Supporting Documents", beneficiary_advice: "Beneficiary Advice Emails", remarks: "Remarks", special_deal: "Special Deal",
    submit: "Submit", back: "Back", confirm_submit: "Confirm / Submit for Authorization", back_to_payments: "Back to Payments", create_another: "Create Another Payment",
    account_limits: "Account & Limits", available_balance: "Available Balance", daily_transfer_limit: "Daily Transfer Limit", remaining_limit: "Remaining Limit", remaining_balance: "Remaining Balance", charges_fx: "Charges & FX", charges: "Charges",
    debit_amount: "Debit Amount", pay_amount: "Pay Amount", fx_rate_applied: "FX Rate Applied", validation_status_section: "Validation & Status", validation_status: "Validation Status", cutoff_status: "Cut-off Status", credit_value_date: "Credit Value Date",
    beneficiary_details: "Beneficiary Details", beneficiary_name: "Beneficiary Name", beneficiary_account_iban: "Beneficiary Account Number / IBAN", beneficiary_country: "Beneficiary Country", beneficiary_bank_name: "Beneficiary Bank Name",
    beneficiary_bank_address: "Beneficiary Bank Address", beneficiary_address: "Beneficiary Address", swift_code: "Beneficiary Bank SWIFT Code", review_payment: "Review Payment Details", payment_details_entered: "Payment Details Entered",
    beneficiary_bank_details: "Beneficiary & Bank Details", payment_success: "Payment Submitted Successfully", confirmation_summary: "Transaction Summary", beneficiary_summary: "Beneficiary Summary", internal_approvals: "Internal Approvals", send_to_beneficiary_bank: "Send to Beneficiary Bank",
    supporting_documents: "Supporting Documents"
  },
  fr: {}
};
LABELS.fr = { ...LABELS.en, step: "Étape", initiate: "Initiation", review: "Révision", language: "Langue", country: "Pays", custom_date: "Date personnalisée", submit: "Soumettre", back: "Retour", special_deal: "Accord spécial" };

const getTodayDateString = (date = new Date()) => date.toISOString().slice(0, 10);
const nextBusinessDate = (date) => { const next = new Date(date); do { next.setDate(next.getDate() + 1); } while ([0, 6].includes(next.getDay())); return next; };
const defaultValueDateByCutoff = (date = new Date()) => (date.getHours() >= 16 ? "Next Business Day" : "Today");
const parseAmount = (value) => { const parsed = Number.parseFloat((value || "").replace(/,/g, "").trim()); return Number.isFinite(parsed) ? parsed : 0; };
const formatAmountInput = (value) => new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseAmount(value));
const formatCurrency = (currency, amount) => new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount || 0);
const findFxRate = (baseCurrency, quoteCurrency, fxRates) => baseCurrency === quoteCurrency ? 1 : fxRates[`${baseCurrency}-${quoteCurrency}`] || Number((1 / (fxRates[`${quoteCurrency}-${baseCurrency}`] || 1)).toFixed(6));
const parseEmails = (input) => input.split(/[\n,]+/).map((email) => email.trim()).filter(Boolean);

export function usePaymentFormState() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentStep, setCurrentStep] = useState(0);
  const [countryCode, setCountryCode] = useState(portalMockData.countries[0].code);
  const [language, setLanguage] = useState("English");
  const [prototype, setPrototype] = useState("p1");

  const isFrenchMode = countryCode === "FR" && language === "French";
  const t = (key) => (isFrenchMode ? LABELS.fr[key] : LABELS.en[key]) || key;
  const valueDateLabel = (value) => (value === "Today" ? t("today") : value === "Next Business Day" ? t("next_business_day") : value === "Custom Date" ? t("custom_date") : value);

  const debitAccountsForCountry = useMemo(() => countryCode === "GLOBAL" ? portalMockData.debitAccounts : portalMockData.debitAccounts.filter((a) => a.countryCode === countryCode), [countryCode]);
  const [debitAccountId, setDebitAccountId] = useState("");
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [paymentPurpose, setPaymentPurpose] = useState(portalMockData.paymentPurposeOptions[0]);
  const [senderPurposeCode, setSenderPurposeCode] = useState("");
  const [amountMode, setAmountMode] = useState("debit");
  const [amountCurrency, setAmountCurrency] = useState(portalMockData.transferCurrencies[0].id);
  const [amount, setAmount] = useState("");
  const [valueDate, setValueDate] = useState(defaultValueDateByCutoff());
  const [customDate, setCustomDate] = useState(getTodayDateString(nextBusinessDate(new Date())));
  const [intermediaryBankId, setIntermediaryBankId] = useState("");
  const [specialDeal, setSpecialDeal] = useState("");
  const [remarks, setRemarks] = useState("");
  const [chargesBearerCode, setChargesBearerCode] = useState(portalMockData.chargesBearerOptions[0].code);
  const [beneficiaryAdvice, setBeneficiaryAdvice] = useState("");
  const [adviceError, setAdviceError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [confirmationReference, setConfirmationReference] = useState(DEFAULT_CONFIRMATION_REFERENCE);

  useEffect(() => { const timerId = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timerId); }, []);
  const isCutoffPassed = currentTime.getHours() >= 16;
  useEffect(() => { if (isCutoffPassed && valueDate === "Today") setValueDate("Next Business Day"); }, [isCutoffPassed, valueDate]);
  useEffect(() => { if (!debitAccountsForCountry.length) setDebitAccountId(""); else if (!debitAccountsForCountry.some((a) => a.id === debitAccountId)) setDebitAccountId(debitAccountsForCountry[0].id); }, [debitAccountsForCountry, debitAccountId]);

  const selectedCountry = useMemo(() => portalMockData.countries.find((country) => country.code === countryCode) || portalMockData.countries[0], [countryCode]);
  const selectedDebitAccount = useMemo(() => debitAccountsForCountry.find((a) => a.id === debitAccountId) || debitAccountsForCountry[0] || null, [debitAccountsForCountry, debitAccountId]);
  const selectedBeneficiary = useMemo(() => portalMockData.beneficiaryAccounts.find((b) => b.id === beneficiaryId) || null, [beneficiaryId]);
  const selectedIntermediaryBank = useMemo(() => portalMockData.intermediaryBanks.find((b) => b.id === intermediaryBankId) || null, [intermediaryBankId]);

  const requiresSenderPurposeCode = selectedDebitAccount ? ["AE", "IN"].includes(selectedDebitAccount.countryCode) : false;
  useEffect(() => { if (!requiresSenderPurposeCode) setSenderPurposeCode(""); }, [requiresSenderPurposeCode]);

  const todayDate = getTodayDateString(currentTime);
  const nextBizDate = getTodayDateString(nextBusinessDate(currentTime));
  const minCustomDate = isCutoffPassed ? nextBizDate : todayDate;
  const debitValueDate = valueDate === "Today" ? todayDate : valueDate === "Next Business Day" ? nextBizDate : customDate;
  const creditDateRolled = (valueDate === "Today" && isCutoffPassed) || (valueDate === "Custom Date" && isCutoffPassed && customDate <= todayDate);
  const creditValueDate = valueDate === "Today" ? (isCutoffPassed ? nextBizDate : todayDate) : valueDate === "Next Business Day" ? nextBizDate : creditDateRolled ? nextBizDate : customDate;

  const parsedAmount = parseAmount(amount);
  const debitCurrency = selectedDebitAccount?.currency || "USD";
  const payCurrency = amountCurrency;
  const fxRate = findFxRate(debitCurrency, payCurrency, portalMockData.derivedDefaults.fxRates);
  const debitAmount = amountMode === "debit" ? parsedAmount : parsedAmount / (fxRate || 1);
  const basePayAmount = amountMode === "pay" ? parsedAmount : parsedAmount * fxRate;
  const chargesByBearer = { OUR: 100, SHA: 50, BEN: 0 };
  const chargeAmount = chargesByBearer[chargesBearerCode] ?? 0;
  const payAmount = chargesBearerCode === "BEN" ? Math.max(basePayAmount - 50, 0) : basePayAmount;
  const availableBalance = selectedDebitAccount?.availableBalance || 0;
  const dailyLimit = selectedDebitAccount?.dailyLimit || 0;
  const remainingBalance = Math.max(availableBalance - debitAmount, 0);
  const remainingLimit = Math.max(dailyLimit - debitAmount, 0);

  const selectedSenderPurpose = portalMockData.senderPurposeCodeOptions.find((option) => option.code === senderPurposeCode);
  const chargesBearerSelection = portalMockData.chargesBearerOptions.find((option) => option.code === chargesBearerCode);

  const mandatoryChecks = [Boolean(debitAccountId), Boolean(beneficiaryId), Boolean(paymentPurpose), Boolean(amountCurrency), parseAmount(amount) > 0, !requiresSenderPurposeCode || Boolean(senderPurposeCode), !(valueDate === "Custom Date") || Boolean(customDate)];
  const mandatoryCompletion = mandatoryChecks.filter(Boolean).length / mandatoryChecks.length;
  const stepProgress = currentStep === 0 ? mandatoryCompletion : 1;
  const headerTime = currentTime.toLocaleString("en-US", { hour12: false, year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short" });

  const rightSections = [
    { title: t("account_limits"), rows: [{ label: t("available_balance"), value: formatCurrency(debitCurrency, availableBalance) }, { label: t("remaining_balance"), value: formatCurrency(debitCurrency, remainingBalance) }, { label: t("daily_transfer_limit"), value: formatCurrency(debitCurrency, dailyLimit) }, { label: t("remaining_limit"), value: formatCurrency(debitCurrency, remainingLimit) }] },
    { title: t("charges_fx"), rows: [{ label: t("debit_amount"), value: formatCurrency(debitCurrency, debitAmount) }, { label: t("pay_amount"), value: formatCurrency(payCurrency, payAmount) }, { label: t("charges"), value: formatCurrency(debitCurrency, chargeAmount) }, { label: t("fx_rate_applied"), value: `1 ${debitCurrency} = ${fxRate} ${payCurrency}` }] },
    { title: t("validation_status_section"), rows: [{ label: t("validation_status"), value: beneficiaryId ? portalMockData.derivedDefaults.validationStatus : t("pending_beneficiary_selection") }, { label: t("cutoff_status"), value: isCutoffPassed ? t("cutoff_passed") : t("within_cutoff"), tone: isCutoffPassed ? "danger" : "good" }, { label: t("debit_value_date"), value: debitValueDate, tone: isCutoffPassed ? "danger" : "default" }, { label: t("credit_value_date"), value: creditDateRolled ? `${creditValueDate} (${t("rolled_next_business_day")})` : creditValueDate, tone: isCutoffPassed || creditDateRolled ? "danger" : "default" }] },
    { title: t("beneficiary_details"), rows: [{ label: t("beneficiary_name"), value: selectedBeneficiary?.name || "—" }, { label: t("beneficiary_account_iban"), value: selectedBeneficiary?.accountNumber || "—" }, { label: t("beneficiary_country"), value: selectedBeneficiary?.country || "—" }, { label: t("beneficiary_bank_name"), value: selectedBeneficiary?.bankName || "—" }, { label: t("beneficiary_bank_address"), value: selectedBeneficiary?.bankAddress || "—" }, { label: t("beneficiary_address"), value: selectedBeneficiary?.beneficiaryAddress || "—" }] }
  ];

  const reviewLeftGroups = [
    { title: t("payment_details_entered"), items: [{ label: t("debit_account"), value: selectedDebitAccount?.label || "—" }, { label: t("beneficiary"), value: selectedBeneficiary?.label || "—" }, { label: t("payment_purpose"), value: paymentPurpose }, { label: t("sender_purpose_code"), value: requiresSenderPurposeCode ? (selectedSenderPurpose ? `${selectedSenderPurpose.label} (${selectedSenderPurpose.code})` : "—") : t("not_required") }, { label: t("mode"), value: amountMode === "debit" ? t("debit") : t("pay") }, { label: t("amount_currency"), value: amountCurrency }, { label: t("amount"), value: amount || "—" }] },
    { title: t("beneficiary_bank_details"), items: [{ label: t("beneficiary_name"), value: selectedBeneficiary?.name || "—" }, { label: t("beneficiary_account_iban"), value: selectedBeneficiary?.accountNumber || "—" }, { label: t("beneficiary_country"), value: selectedBeneficiary?.country || "—" }, { label: t("beneficiary_address"), value: selectedBeneficiary?.beneficiaryAddress || "—" }, { label: t("beneficiary_bank_name"), value: selectedBeneficiary?.bankName || "—" }, { label: t("beneficiary_bank_address"), value: selectedBeneficiary?.bankAddress || "—" }] },
    { title: t("additional_information"), items: [{ label: t("value_date"), value: valueDateLabel(valueDate) }, { label: t("custom_date"), value: valueDate === "Custom Date" ? customDate : t("not_selected") }, { label: t("debit_value_date"), value: debitValueDate }, { label: t("credit_value_date"), value: creditDateRolled ? `${creditValueDate} (${t("rolled")})` : creditValueDate }, { label: t("intermediary_bank"), value: selectedIntermediaryBank?.label || "—" }, { label: t("charges_bearer"), value: chargesBearerSelection?.label || chargesBearerCode }, { label: t("special_deal"), value: specialDeal || "—" }, { label: t("beneficiary_advice"), value: beneficiaryAdvice || "—" }, { label: t("remarks"), value: remarks || "—" }, { label: t("upload_documents"), value: selectedFiles.length ? selectedFiles.join(", ") : "—" }] }
  ];

  const corporateTimeline = [{ label: t("initiated_by_maker"), state: "done" }, { label: t("awaiting_checker_authorization"), state: "current" }, { label: t("checker_approved"), state: "pending" }, { label: t("released_to_bank"), state: "pending" }];
  const bankTimeline = [{ label: t("payment_instruction_received"), state: "done" }, { label: t("internal_approvals"), state: "current" }, { label: t("send_to_beneficiary_bank"), state: "pending" }, { label: t("beneficiary_credit"), state: "pending" }];

  const confirmationSummaryRows = [{ label: t("debit_account"), value: selectedDebitAccount?.label || "—" }, { label: t("debit_amount"), value: `${debitCurrency} ${formatAmountInput(String(debitAmount)) || "0.00"}` }, { label: t("beneficiary_summary"), value: selectedBeneficiary ? `${selectedBeneficiary.name} • ${selectedBeneficiary.accountNumber} • ${selectedBeneficiary.country}` : "—" }, { label: t("pay_amount"), value: `${payCurrency} ${formatAmountInput(String(payAmount)) || "0.00"}` }, { label: t("debit_value_date"), value: debitValueDate }, { label: t("credit_value_date"), value: creditValueDate }];
  const confirmationSummaryPairedRows = [
    { left: confirmationSummaryRows[0], right: confirmationSummaryRows[2] },
    { left: confirmationSummaryRows[1], right: confirmationSummaryRows[3] },
    { left: confirmationSummaryRows[4], right: confirmationSummaryRows[5] }
  ];

  const resetFlow = () => { setCurrentStep(0); setBeneficiaryId(""); setPaymentPurpose(portalMockData.paymentPurposeOptions[0]); setSenderPurposeCode(""); setAmountMode("debit"); setAmountCurrency(portalMockData.transferCurrencies[0].id); setAmount(""); setValueDate(defaultValueDateByCutoff()); setCustomDate(getTodayDateString(nextBusinessDate(new Date()))); setIntermediaryBankId(""); setSpecialDeal(""); setRemarks(""); setChargesBearerCode(portalMockData.chargesBearerOptions[0].code); setBeneficiaryAdvice(""); setAdviceError(""); setSelectedFiles([]); setConfirmationReference(DEFAULT_CONFIRMATION_REFERENCE); };

  return {
    t, prototype, setPrototype, isSidebarCollapsed, setIsSidebarCollapsed, currentStep, setCurrentStep, stepProgress,
    language, setLanguage, countryCode, setCountryCode, selectedCountry, headerTime, portalMockData,
    debitAccountsForCountry, debitAccountId, setDebitAccountId, beneficiaryId, setBeneficiaryId, paymentPurpose, setPaymentPurpose, senderPurposeCode, setSenderPurposeCode,
    amountMode, setAmountMode, amountCurrency, setAmountCurrency, amount, setAmount, valueDate, setValueDate, customDate, setCustomDate, minCustomDate, intermediaryBankId, setIntermediaryBankId,
    specialDeal, setSpecialDeal, remarks, setRemarks, chargesBearerCode, setChargesBearerCode, beneficiaryAdvice, setBeneficiaryAdvice, adviceError, setAdviceError, selectedFiles, setSelectedFiles,
    requiresSenderPurposeCode, isCutoffPassed, valueDateLabel, parseEmails, formatAmountInput, rightSections, reviewLeftGroups,
    selectedIntermediaryBank, chargesBearerSelection, resetFlow, confirmationReference, setConfirmationReference, DEFAULT_CONFIRMATION_REFERENCE,
    confirmationSummaryRows, confirmationSummaryPairedRows, corporateTimeline, bankTimeline, isFrenchMode
  };
}
