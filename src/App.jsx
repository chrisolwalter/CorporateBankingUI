import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { PageContent } from "./components/layout/PageContent";
import { StepTracker } from "./components/layout/StepTracker";
import { PortalCard } from "./components/cards/PortalCard";
import { DerivedSection } from "./components/cards/DerivedSection";
import { FormRow } from "./components/fields/FormRow";
import { SearchableSelect } from "./components/fields/SearchableSelect";
import { portalMockData } from "./data/portalMockData";
import flagGlobal from "./assets/flags/global.svg";
import flagFrance from "./assets/flags/fr.svg";
import flagIndia from "./assets/flags/in.svg";
import flagUae from "./assets/flags/ae.svg";
import flagChina from "./assets/flags/cn.svg";
import "./styles/portalLayout.css";

const DEFAULT_CONFIRMATION_REFERENCE = "CBPS-20260328-104582";

const LABELS = {
  en: {
    header_title: "Corporate Banking Payment Services",
    current_time: "Current Time",
    language: "Language",
    country: "Country",
    initiate: "Initiate",
    review: "Review",
    confirmation: "Confirmation",
    complete: "complete",
    step: "Step",
    trading_portal: "Trading Portal",
    corporate_banking: "Corporate Banking",
    payments: "Payments",
    single_payments: "Single Payments",
    primary_navigation: "primary navigation",
    expand_sidebar: "Expand sidebar",
    collapse_sidebar: "Collapse sidebar",
    search_debit_account: "Select debit account",
    search_beneficiary: "Select beneficiary",
    search_currency: "Select amount currency",
    enter_amount: "Enter amount",
    select_code: "Select purpose code",
    select_intermediary_bank: "Select intermediary bank",
    no_selection: "— No selection —",
    no_matching_results: "No matching results",
    email_help: "Enter up to 5 emails, separated by commas or new lines",
    email_error: "You can enter up to 5 email addresses.",
    remarks_placeholder: "Enter remarks",
    amount_mode: "amount mode",
    debit: "Debit",
    pay: "Pay",
    pending_beneficiary_selection: "Pending beneficiary selection",
    cutoff_passed: "Cut-off passed",
    within_cutoff: "Within cut-off",
    rolled_next_business_day: "rolled to next business day",
    not_required: "Not required",
    mode: "Mode",
    not_selected: "Not selected",
    rolled: "rolled",
    your_payment_submitted: "Your payment has been successfully submitted.",
    reference: "Reference",
    corporate_authorization_steps: "Corporate Authorization Steps",
    bank_processing_steps: "Bank Processing Steps",
    initiated_by_maker: "Initiated by Maker",
    awaiting_checker_authorization: "Awaiting Checker Authorization",
    checker_approved: "Checker Approved",
    released_to_bank: "Released to Bank",
    payment_instruction_received: "Payment Instruction Received",
    compliance_screening: "Compliance / Screening",
    fx_booking_conversion: "FX Booking / Conversion",
    payment_processing: "Payment Processing",
    beneficiary_credit: "Beneficiary Credit",
    completed: "Completed",
    in_progress: "In Progress",
    pending: "Pending",
    single_payment_details: "Single Payment Details",
    debit_account: "Debit Account",
    beneficiary: "Beneficiary",
    amount_currency: "Amount Currency",
    amount: "Amount",
    payment_purpose: "Payment Purpose",
    sender_purpose_code: "Sender Purpose Code",
    additional_information: "Additional Information",
    value_date: "Value Date",
    today: "Today",
    next_business_day: "Next Business Day",
    custom_date: "Custom Date",
    debit_value_date: "Debit Value Date",
    intermediary_bank: "Intermediary Bank",
    charges_bearer: "Charges Bearer",
    upload_documents: "Upload Supporting Documents",
    beneficiary_advice: "Beneficiary Advice Emails",
    remarks: "Remarks",
    special_deal: "Special Deal",
    submit: "Submit",
    back: "Back",
    confirm_submit: "Confirm / Submit for Authorization",
    back_to_payments: "Back to Payments",
    create_another: "Create Another Payment",
    account_limits: "Account & Limits",
    available_balance: "Available Balance",
    daily_transfer_limit: "Daily Transfer Limit",
    remaining_limit: "Remaining Limit",
    remaining_balance: "Remaining Balance",
    charges_fx: "Charges & FX",
    charges: "Charges",
    debit_amount: "Debit Amount",
    pay_amount: "Pay Amount",
    fx_rate_applied: "FX Rate Applied",
    validation_status_section: "Validation & Status",
    validation_status: "Validation Status",
    cutoff_status: "Cut-off Status",
    credit_value_date: "Credit Value Date",
    beneficiary_details: "Beneficiary Details",
    beneficiary_name: "Beneficiary Name",
    beneficiary_account_iban: "Beneficiary Account Number / IBAN",
    beneficiary_country: "Beneficiary Country",
    beneficiary_bank_name: "Beneficiary Bank Name",
    beneficiary_bank_address: "Beneficiary Bank Address",
    beneficiary_address: "Beneficiary Address",
    swift_code: "Beneficiary Bank SWIFT Code",
    review_payment: "Review Payment Details",
    payment_details_entered: "Payment Details Entered",
    beneficiary_bank_details: "Beneficiary & Bank Details",
    payment_success: "Payment Submitted Successfully"
    ,
    confirmation_summary: "Transaction Summary",
    beneficiary_summary: "Beneficiary Summary",
    internal_approvals: "Internal Approvals",
    send_to_beneficiary_bank: "Send to Beneficiary Bank"
  },
  fr: {
    header_title: "Services de Paiement Bancaire Corporate",
    current_time: "Heure actuelle",
    language: "Langue",
    country: "Pays",
    initiate: "Initiation",
    review: "Révision",
    confirmation: "Confirmation",
    complete: "complété",
    step: "Étape",
    trading_portal: "Portail de trading",
    corporate_banking: "Banque corporate",
    payments: "Paiements",
    single_payments: "Paiements uniques",
    primary_navigation: "navigation principale",
    expand_sidebar: "Ouvrir la barre latérale",
    collapse_sidebar: "Réduire la barre latérale",
    search_debit_account: "Sélectionner le compte de débit",
    search_beneficiary: "Sélectionner le bénéficiaire",
    search_currency: "Sélectionner la devise du montant",
    enter_amount: "Saisir le montant",
    select_code: "Sélectionner un code objet",
    select_intermediary_bank: "Sélectionner la banque intermédiaire",
    no_selection: "— Aucune sélection —",
    no_matching_results: "Aucun résultat correspondant",
    email_help: "Saisissez jusqu'à 5 e-mails, séparés par des virgules ou des retours à la ligne",
    email_error: "Vous pouvez saisir jusqu'à 5 adresses e-mail.",
    remarks_placeholder: "Saisir des remarques",
    amount_mode: "mode de montant",
    debit: "Débit",
    pay: "Paiement",
    pending_beneficiary_selection: "Sélection du bénéficiaire en attente",
    cutoff_passed: "Cut-off dépassé",
    within_cutoff: "Dans le cut-off",
    rolled_next_business_day: "reporté au jour ouvré suivant",
    not_required: "Non requis",
    mode: "Mode",
    not_selected: "Non sélectionné",
    rolled: "reporté",
    your_payment_submitted: "Votre paiement a été soumis avec succès.",
    reference: "Référence",
    corporate_authorization_steps: "Étapes d'autorisation corporate",
    bank_processing_steps: "Étapes de traitement bancaire",
    initiated_by_maker: "Initié par le maker",
    awaiting_checker_authorization: "En attente d'autorisation du checker",
    checker_approved: "Checker approuvé",
    released_to_bank: "Transmis à la banque",
    payment_instruction_received: "Instruction de paiement reçue",
    compliance_screening: "Conformité / Filtrage",
    fx_booking_conversion: "Réservation FX / Conversion",
    payment_processing: "Traitement du paiement",
    beneficiary_credit: "Crédit bénéficiaire",
    completed: "Terminé",
    in_progress: "En cours",
    pending: "En attente",
    single_payment_details: "Détails du paiement unique",
    debit_account: "Compte de débit",
    beneficiary: "Bénéficiaire",
    amount_currency: "Devise du montant",
    amount: "Montant",
    payment_purpose: "Objet du paiement",
    sender_purpose_code: "Code objet de l'émetteur",
    additional_information: "Informations complémentaires",
    value_date: "Date de valeur",
    today: "Aujourd'hui",
    next_business_day: "Jour ouvré suivant",
    custom_date: "Date personnalisée",
    debit_value_date: "Date de valeur débit",
    intermediary_bank: "Banque intermédiaire",
    charges_bearer: "Prise en charge des frais",
    upload_documents: "Télécharger les justificatifs",
    beneficiary_advice: "Emails d'avis au bénéficiaire",
    remarks: "Remarques",
    special_deal: "Accord spécial",
    submit: "Soumettre",
    back: "Retour",
    confirm_submit: "Confirmer / Soumettre pour autorisation",
    back_to_payments: "Retour aux paiements",
    create_another: "Créer un autre paiement",
    account_limits: "Compte et limites",
    available_balance: "Solde disponible",
    daily_transfer_limit: "Limite de transfert quotidienne",
    remaining_limit: "Limite restante",
    remaining_balance: "Solde restant",
    charges_fx: "Frais et FX",
    charges: "Frais",
    debit_amount: "Montant débité",
    pay_amount: "Montant payé",
    fx_rate_applied: "Taux FX appliqué",
    validation_status_section: "Validation et statut",
    validation_status: "Statut de validation",
    cutoff_status: "Statut de cut-off",
    credit_value_date: "Date de valeur crédit",
    beneficiary_details: "Détails du bénéficiaire",
    beneficiary_name: "Nom du bénéficiaire",
    beneficiary_account_iban: "Compte bénéficiaire / IBAN",
    beneficiary_country: "Pays du bénéficiaire",
    beneficiary_bank_name: "Banque du bénéficiaire",
    beneficiary_bank_address: "Adresse de la banque du bénéficiaire",
    beneficiary_address: "Adresse du bénéficiaire",
    swift_code: "Code SWIFT de la banque bénéficiaire",
    review_payment: "Vérifier les détails du paiement",
    payment_details_entered: "Détails du paiement saisis",
    beneficiary_bank_details: "Détails bénéficiaire et banque",
    payment_success: "Paiement soumis avec succès",
    confirmation_summary: "Résumé de la transaction",
    beneficiary_summary: "Résumé du bénéficiaire",
    internal_approvals: "Approbations internes",
    send_to_beneficiary_bank: "Envoyer à la banque du bénéficiaire"
  }
};

const COUNTRY_META = {
  GLOBAL: { flag: flagGlobal },
  FR: { flag: flagFrance },
  IN: { flag: flagIndia },
  AE: { flag: flagUae },
  CN: { flag: flagChina }
};

const getTodayDateString = (date = new Date()) => date.toISOString().slice(0, 10);

function nextBusinessDate(date) {
  const next = new Date(date);
  do {
    next.setDate(next.getDate() + 1);
  } while ([0, 6].includes(next.getDay()));
  return next;
}

function defaultValueDateByCutoff(date = new Date()) {
  return date.getHours() >= 16 ? "Next Business Day" : "Today";
}

function formatCurrency(currency, amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
}

function parseAmount(value) {
  const cleaned = (value || "").replace(/,/g, "").trim();
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatAmountInput(value) {
  const parsed = parseAmount(value);
  if (!value || Number.isNaN(parsed)) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(parsed);
}

function findFxRate(baseCurrency, quoteCurrency, fxRates) {
  if (!baseCurrency || !quoteCurrency || baseCurrency === quoteCurrency) {
    return 1;
  }

  const directPair = `${baseCurrency}-${quoteCurrency}`;
  const reversePair = `${quoteCurrency}-${baseCurrency}`;

  if (fxRates[directPair]) {
    return fxRates[directPair];
  }

  if (fxRates[reversePair]) {
    return Number((1 / fxRates[reversePair]).toFixed(6));
  }

  return 1;
}

function parseEmails(input) {
  return input
    .split(/[\n,]+/)
    .map((email) => email.trim())
    .filter(Boolean);
}

function getBeneficiaryRoutingRows(beneficiary, t) {
  if (!beneficiary) return [];

  const rows = [{ label: t("swift_code"), value: beneficiary.swiftCode || "—" }];
  if (beneficiary.country === "India") rows.push({ label: "IFSC Code", value: beneficiary.ifscCode || "—" });
  else if (beneficiary.country === "United Kingdom") rows.push({ label: "Sort Code", value: beneficiary.sortCode || "—" });
  else if (beneficiary.country === "United States") rows.push({ label: "Fedwire Code", value: beneficiary.fedwireCode || "—" });
  else if (beneficiary.country === "UAE") rows.push({ label: "UAE Routing Code", value: beneficiary.uaeRoutingCode || "—" });

  return rows;
}

function Timeline({ title, steps, t }) {
  return (
    <section className="timeline-card">
      <h3>{title}</h3>
      <ul className="timeline">
        {steps.map((step) => (
          <li key={step.label} className={`timeline__item timeline__item--${step.state}`}>
            <span className="timeline__dot" aria-hidden="true" />
            <div>
              <strong>{step.label}</strong>
              <p>{step.state === "done" ? t("completed") : step.state === "current" ? t("in_progress") : t("pending")}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ReviewList({ title, items }) {
  return (
    <section className="review-group">
      <h3>{title}</h3>
      <dl className="readonly-list">
        {items.map((item) => (
          <div className="readonly-row" key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentStep, setCurrentStep] = useState(0);

  const [countryCode, setCountryCode] = useState(portalMockData.countries[0].code);
  const [language, setLanguage] = useState("English");

  const isFrenchMode = countryCode === "FR" && language === "French";
  const t = (key) => (isFrenchMode ? LABELS.fr[key] : LABELS.en[key]) || key;
  const valueDateLabel = (value) => {
    if (value === "Today") return t("today");
    if (value === "Next Business Day") return t("next_business_day");
    if (value === "Custom Date") return t("custom_date");
    return value;
  };

  const debitAccountsForCountry = useMemo(() => {
    if (countryCode === "GLOBAL") return portalMockData.debitAccounts;
    return portalMockData.debitAccounts.filter((account) => account.countryCode === countryCode);
  }, [countryCode]);

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

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const isCutoffPassed = currentTime.getHours() >= 16;

  useEffect(() => {
    if (isCutoffPassed && valueDate === "Today") {
      setValueDate("Next Business Day");
    }
  }, [isCutoffPassed, valueDate]);

  useEffect(() => {
    if (!debitAccountsForCountry.length) {
      setDebitAccountId("");
      return;
    }
    if (!debitAccountsForCountry.some((account) => account.id === debitAccountId)) {
      setDebitAccountId(debitAccountsForCountry[0].id);
    }
  }, [debitAccountsForCountry, debitAccountId]);

  const selectedCountry = useMemo(
    () => portalMockData.countries.find((country) => country.code === countryCode) || portalMockData.countries[0],
    [countryCode]
  );
  const selectedCountryMeta = COUNTRY_META[countryCode] || COUNTRY_META.GLOBAL;

  const selectedDebitAccount = useMemo(
    () => debitAccountsForCountry.find((account) => account.id === debitAccountId) || debitAccountsForCountry[0] || null,
    [debitAccountsForCountry, debitAccountId]
  );

  const selectedBeneficiary = useMemo(
    () => portalMockData.beneficiaryAccounts.find((beneficiary) => beneficiary.id === beneficiaryId) || null,
    [beneficiaryId]
  );

  const selectedIntermediaryBank = useMemo(
    () => portalMockData.intermediaryBanks.find((bank) => bank.id === intermediaryBankId) || null,
    [intermediaryBankId]
  );

  const requiresSenderPurposeCode = selectedDebitAccount ? ["AE", "IN"].includes(selectedDebitAccount.countryCode) : false;

  useEffect(() => {
    if (!requiresSenderPurposeCode) setSenderPurposeCode("");
  }, [requiresSenderPurposeCode]);

  const todayDate = getTodayDateString(currentTime);
  const nextBizDate = getTodayDateString(nextBusinessDate(currentTime));
  const minCustomDate = isCutoffPassed ? nextBizDate : todayDate;

  const debitValueDate = valueDate === "Today" ? todayDate : valueDate === "Next Business Day" ? nextBizDate : customDate;

  const creditDateRolled =
    (valueDate === "Today" && isCutoffPassed) ||
    (valueDate === "Custom Date" && isCutoffPassed && customDate <= todayDate);

  const creditValueDate =
    valueDate === "Today"
      ? isCutoffPassed
        ? nextBizDate
        : todayDate
      : valueDate === "Next Business Day"
      ? nextBizDate
      : creditDateRolled
      ? nextBizDate
      : customDate;

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

  const chargesBearerSelection = portalMockData.chargesBearerOptions.find((option) => option.code === chargesBearerCode);
  const selectedSenderPurpose = portalMockData.senderPurposeCodeOptions.find((option) => option.code === senderPurposeCode);

  const mandatoryChecks = [
    Boolean(debitAccountId),
    Boolean(beneficiaryId),
    Boolean(paymentPurpose),
    Boolean(amountCurrency),
    parseAmount(amount) > 0,
    !requiresSenderPurposeCode || Boolean(senderPurposeCode),
    !(valueDate === "Custom Date") || Boolean(customDate)
  ];

  const mandatoryCompletion = mandatoryChecks.filter(Boolean).length / mandatoryChecks.length;
  const stepProgress = currentStep === 0 ? mandatoryCompletion : 1;

  const headerTime = currentTime.toLocaleString("en-US", {
    hour12: false,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short"
  });

  const beneficiaryRoutingRows = getBeneficiaryRoutingRows(selectedBeneficiary, t);

  const rightSections = [
    {
      title: t("account_limits"),
      rows: [
        { label: t("available_balance"), value: formatCurrency(debitCurrency, availableBalance) },
        { label: t("remaining_balance"), value: formatCurrency(debitCurrency, remainingBalance) },
        { label: t("daily_transfer_limit"), value: formatCurrency(debitCurrency, dailyLimit) },
        { label: t("remaining_limit"), value: formatCurrency(debitCurrency, remainingLimit) }
      ]
    },
    {
      title: t("charges_fx"),
      rows: [
        { label: t("debit_amount"), value: formatCurrency(debitCurrency, debitAmount) },
        { label: t("pay_amount"), value: formatCurrency(payCurrency, payAmount) },
        { label: t("charges"), value: formatCurrency(debitCurrency, chargeAmount) },
        { label: t("fx_rate_applied"), value: `1 ${debitCurrency} = ${fxRate} ${payCurrency}` }
      ]
    },
    {
      title: t("validation_status_section"),
      rows: [
        { label: t("validation_status"), value: beneficiaryId ? portalMockData.derivedDefaults.validationStatus : t("pending_beneficiary_selection") },
        { label: t("cutoff_status"), value: isCutoffPassed ? t("cutoff_passed") : t("within_cutoff"), tone: isCutoffPassed ? "danger" : "good" },
        { label: t("debit_value_date"), value: debitValueDate, tone: isCutoffPassed ? "danger" : "default" },
        {
          label: t("credit_value_date"),
          value: creditDateRolled ? `${creditValueDate} (${t("rolled_next_business_day")})` : creditValueDate,
          tone: isCutoffPassed || creditDateRolled ? "danger" : "default"
        }
      ]
    },
    {
      title: t("beneficiary_details"),
      rows: [
        { label: t("beneficiary_name"), value: selectedBeneficiary?.name || "—" },
        { label: t("beneficiary_account_iban"), value: selectedBeneficiary?.accountNumber || "—" },
        { label: t("beneficiary_country"), value: selectedBeneficiary?.country || "—" },
        { label: t("beneficiary_bank_name"), value: selectedBeneficiary?.bankName || "—" },
        { label: t("beneficiary_bank_address"), value: selectedBeneficiary?.bankAddress || "—" },
        ...beneficiaryRoutingRows,
        { label: t("beneficiary_address"), value: selectedBeneficiary?.beneficiaryAddress || "—" }
      ]
    }
  ];

  const reviewLeftGroups = [
    {
      title: t("payment_details_entered"),
      items: [
        { label: t("debit_account"), value: selectedDebitAccount?.label || "—" },
        { label: t("beneficiary"), value: selectedBeneficiary?.label || "—" },
        { label: t("payment_purpose"), value: paymentPurpose },
        {
          label: t("sender_purpose_code"),
          value: requiresSenderPurposeCode
            ? selectedSenderPurpose
              ? `${selectedSenderPurpose.label} (${selectedSenderPurpose.code})`
              : "—"
            : t("not_required")
        },
        { label: t("mode"), value: amountMode === "debit" ? t("debit") : t("pay") },
        { label: t("amount_currency"), value: amountCurrency },
        { label: t("amount"), value: amount || "—" }
      ]
    },
    {
      title: t("beneficiary_bank_details"),
      items: [
        { label: t("beneficiary_name"), value: selectedBeneficiary?.name || "—" },
        { label: t("beneficiary_account_iban"), value: selectedBeneficiary?.accountNumber || "—" },
        { label: t("beneficiary_country"), value: selectedBeneficiary?.country || "—" },
        { label: t("beneficiary_address"), value: selectedBeneficiary?.beneficiaryAddress || "—" },
        { label: t("beneficiary_bank_name"), value: selectedBeneficiary?.bankName || "—" },
        { label: t("beneficiary_bank_address"), value: selectedBeneficiary?.bankAddress || "—" },
        ...beneficiaryRoutingRows
      ]
    },
    {
      title: t("additional_information"),
      items: [
        { label: t("value_date"), value: valueDateLabel(valueDate) },
        { label: t("custom_date"), value: valueDate === "Custom Date" ? customDate : t("not_selected") },
        { label: t("debit_value_date"), value: debitValueDate },
        { label: t("credit_value_date"), value: creditDateRolled ? `${creditValueDate} (${t("rolled")})` : creditValueDate },
        { label: t("intermediary_bank"), value: selectedIntermediaryBank?.label || "—" },
        { label: t("charges_bearer"), value: chargesBearerSelection?.label || chargesBearerCode },
        { label: t("special_deal"), value: specialDeal || "—" },
        { label: t("beneficiary_advice"), value: beneficiaryAdvice || "—" },
        { label: t("remarks"), value: remarks || "—" },
        { label: t("upload_documents"), value: selectedFiles.length ? selectedFiles.join(", ") : "—" }
      ]
    }
  ];

  const corporateTimeline = [
    { label: t("initiated_by_maker"), state: "done" },
    { label: t("awaiting_checker_authorization"), state: "current" },
    { label: t("checker_approved"), state: "pending" },
    { label: t("released_to_bank"), state: "pending" }
  ];

  const bankTimeline = [
    { label: t("payment_instruction_received"), state: "done" },
    { label: t("internal_approvals"), state: "current" },
    { label: t("send_to_beneficiary_bank"), state: "pending" },
    { label: t("beneficiary_credit"), state: "pending" }
  ];

  const confirmationSummaryRows = [
    { label: t("debit_account"), value: selectedDebitAccount?.label || "—" },
    { label: t("debit_amount"), value: `${debitCurrency} ${formatAmountInput(String(debitAmount)) || "0.00"}` },
    {
      label: t("beneficiary_summary"),
      value: selectedBeneficiary
        ? `${selectedBeneficiary.name} • ${selectedBeneficiary.accountNumber} • ${selectedBeneficiary.country}`
        : "—"
    },
    { label: t("pay_amount"), value: `${payCurrency} ${formatAmountInput(String(payAmount)) || "0.00"}` },
    { label: t("debit_value_date"), value: debitValueDate },
    { label: t("credit_value_date"), value: creditValueDate }
  ];

  const resetFlow = () => {
    setCurrentStep(0);
    setBeneficiaryId("");
    setPaymentPurpose(portalMockData.paymentPurposeOptions[0]);
    setSenderPurposeCode("");
    setAmountMode("debit");
    setAmountCurrency(portalMockData.transferCurrencies[0].id);
    setAmount("");
    setValueDate(defaultValueDateByCutoff());
    setCustomDate(getTodayDateString(nextBusinessDate(new Date())));
    setIntermediaryBankId("");
    setSpecialDeal("");
    setRemarks("");
    setChargesBearerCode(portalMockData.chargesBearerOptions[0].code);
    setBeneficiaryAdvice("");
    setAdviceError("");
    setSelectedFiles([]);
    setConfirmationReference(DEFAULT_CONFIRMATION_REFERENCE);
  };

  return (
    <AppShell
      sidebar={
        <Sidebar
          collapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed((value) => !value)}
          labels={{
            corporateBanking: t("corporate_banking"),
            tradingPortal: t("trading_portal"),
            expandSidebar: t("expand_sidebar"),
            collapseSidebar: t("collapse_sidebar"),
            primaryNavigation: t("primary_navigation"),
            payments: t("payments"),
            singlePayments: t("single_payments")
          }}
        />
      }
      header={
        <>
          <Header
            portalTitle={t("header_title")}
            currentTime={headerTime}
            language={language}
            country={countryCode}
            countryFlag={selectedCountryMeta.flag}
            labels={{ currentTime: t("current_time"), language: t("language"), country: t("country") }}
            languages={selectedCountry.languages}
            countries={portalMockData.countries.map((country) => ({ value: country.code, label: country.label }))}
            onLanguageChange={setLanguage}
            onCountryChange={(nextCountryCode) => {
              setCountryCode(nextCountryCode);
              setLanguage("English");
            }}
          />
          <StepTracker
            steps={[t("initiate"), t("review"), t("confirmation")]}
            currentStep={currentStep}
            progress={stepProgress}
            completed={currentStep === 2}
            completeLabel={t("complete")}
            stepLabelPrefix={t("step")}
          />
        </>
      }
    >
      {currentStep === 0 ? (
        <PageContent
          leftColumn={
            <>
              <PortalCard title={t("single_payment_details")} variant="primary">
                <div className="form-stack">
                  <SearchableSelect
                    id="debit-account"
                    label={t("debit_account")}
                    options={debitAccountsForCountry}
                    value={debitAccountId}
                    onChange={setDebitAccountId}
                    placeholder={t("search_debit_account")}
                    emptyLabel={t("no_matching_results")}
                    required
                  />

                  <SearchableSelect
                    id="beneficiary"
                    label={t("beneficiary")}
                    options={portalMockData.beneficiaryAccounts}
                    value={beneficiaryId}
                    onChange={setBeneficiaryId}
                    placeholder={t("search_beneficiary")}
                    noDefault
                    noSelectionLabel={t("no_selection")}
                    emptyLabel={t("no_matching_results")}
                    required
                  />

                  <div className="amount-control-row">
                    <div className="mode-toggle" role="group" aria-label={t("amount_mode")}>
                      <button type="button" className={amountMode === "debit" ? "is-active" : ""} onClick={() => setAmountMode("debit")}>{t("debit")}</button>
                      <button type="button" className={amountMode === "pay" ? "is-active" : ""} onClick={() => setAmountMode("pay")}>{t("pay")}</button>
                    </div>

                    <SearchableSelect
                      id="amount-currency"
                      label={t("amount_currency")}
                      options={portalMockData.transferCurrencies}
                      value={amountCurrency}
                      onChange={setAmountCurrency}
                      placeholder={t("search_currency")}
                      emptyLabel={t("no_matching_results")}
                      required
                    />

                    <FormRow id="amount" label={t("amount")} required>
                      <input
                        id="amount"
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        placeholder={t("enter_amount")}
                        onChange={(event) => setAmount(event.target.value.replace(/[^\d.,]/g, ""))}
                        onFocus={() => setAmount((previous) => previous.replace(/,/g, ""))}
                        onBlur={() => setAmount((previous) => formatAmountInput(previous))}
                      />
                    </FormRow>
                  </div>

                  <div className="form-grid form-grid--mandatory-purpose">
                    <FormRow id="payment-purpose" label={t("payment_purpose")} required>
                      <select id="payment-purpose" value={paymentPurpose} onChange={(event) => setPaymentPurpose(event.target.value)}>
                        {portalMockData.paymentPurposeOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </FormRow>

                    {requiresSenderPurposeCode ? (
                      <FormRow id="sender-purpose-code" label={t("sender_purpose_code")}>
                      <select id="sender-purpose-code" value={senderPurposeCode} onChange={(event) => setSenderPurposeCode(event.target.value)}>
                          <option value="">{t("select_code")}</option>
                          {portalMockData.senderPurposeCodeOptions.map((option) => (
                            <option key={option.code} value={option.code}>{option.label}</option>
                          ))}
                        </select>
                      </FormRow>
                    ) : null}
                  </div>
                </div>
              </PortalCard>

              <PortalCard title={t("additional_information")} variant="primary">
                <div className="form-grid">
                  <FormRow id="value-date" label={t("value_date")} required>
                    <select id="value-date" value={valueDate} onChange={(event) => setValueDate(event.target.value)}>
                      {portalMockData.valueDateOptions.map((option) => {
                        if (option === "Today" && isCutoffPassed) return null;
                        const label = valueDateLabel(option);
                        return <option key={option} value={option}>{label}</option>;
                      })}
                    </select>
                  </FormRow>

                  {valueDate === "Custom Date" ? (
                    <FormRow id="custom-date" label={t("debit_value_date")}>
                      <input id="custom-date" type="date" min={minCustomDate} value={customDate} onChange={(event) => setCustomDate(event.target.value)} />
                    </FormRow>
                  ) : null}

                  <SearchableSelect
                    id="intermediary-bank"
                    label={t("intermediary_bank")}
                    options={portalMockData.intermediaryBanks}
                    value={intermediaryBankId}
                    onChange={setIntermediaryBankId}
                    placeholder={t("select_intermediary_bank")}
                    noDefault
                    noSelectionLabel={t("no_selection")}
                    emptyLabel={t("no_matching_results")}
                  />

                  <FormRow id="charges-bearer" label={t("charges_bearer")}>
                    <select id="charges-bearer" value={chargesBearerCode} onChange={(event) => setChargesBearerCode(event.target.value)}>
                      {portalMockData.chargesBearerOptions.map((option) => (
                        <option key={option.code} value={option.code}>{option.label}</option>
                      ))}
                    </select>
                  </FormRow>

                  <FormRow id="special-deal" label={t("special_deal")}>
                    <input
                      id="special-deal"
                      type="text"
                      value={specialDeal}
                      onChange={(event) => setSpecialDeal(event.target.value)}
                    />
                  </FormRow>

                  <FormRow id="beneficiary-advice" label={t("beneficiary_advice")}>
                    <textarea
                      id="beneficiary-advice"
                      rows={3}
                      placeholder={t("email_help")}
                      value={beneficiaryAdvice}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        const emails = parseEmails(nextValue);
                        setAdviceError(emails.length > 5 ? t("email_error") : "");
                        setBeneficiaryAdvice(nextValue);
                      }}
                    />
                    {adviceError ? <p className="inline-error">{adviceError}</p> : null}
                  </FormRow>

                  <FormRow id="remarks" label={t("remarks")}>
                    <textarea id="remarks" rows={3} value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder={t("remarks_placeholder")} />
                  </FormRow>

                  <FormRow id="supporting-documents" label={t("upload_documents")}>
                    <input
                      id="supporting-documents"
                      type="file"
                      multiple
                      onChange={(event) => setSelectedFiles(Array.from(event.target.files || []).map((file) => file.name))}
                    />
                    {selectedFiles.length ? <p className="inline-note">{selectedFiles.join(", ")}</p> : null}
                  </FormRow>
                </div>
              </PortalCard>

              <div className="page-actions page-actions--right">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => {
                    if (!(isCutoffPassed && valueDate === "Today")) setCurrentStep(1);
                  }}
                >
                  {t("submit")}
                </button>
              </div>
            </>
          }
          rightColumn={
            <div className="derived-sections derived-sections--standalone">
              {rightSections.map((section) => (
                <DerivedSection
                  key={section.title}
                  title={section.title}
                  rows={section.rows}
                  variant={
                    section.title === t("validation_status_section")
                      ? "status"
                      : section.title === t("charges_fx")
                      ? "financial"
                      : "default"
                  }
                />
              ))}
            </div>
          }
        />
      ) : null}

      {currentStep === 1 ? (
        <PageContent
          leftColumn={
            <>
              <PortalCard title={t("review_payment")} variant="emphasis">
                <div className="review-layout">
                  {reviewLeftGroups.map((group) => (
                    <ReviewList key={group.title} title={group.title} items={group.items} />
                  ))}
                </div>
              </PortalCard>

              <div className="page-actions">
                <button type="button" className="btn btn--secondary" onClick={() => setCurrentStep(0)}>{t("back")}</button>
                <button type="button" className="btn btn--primary" onClick={() => { setConfirmationReference(DEFAULT_CONFIRMATION_REFERENCE); setCurrentStep(2); }}>{t("confirm_submit")}</button>
              </div>
            </>
          }
          rightColumn={
            <div className="derived-sections derived-sections--standalone">
              {rightSections.map((section) => (
                <DerivedSection
                  key={section.title}
                  title={section.title}
                  rows={section.rows}
                  variant={
                    section.title === t("validation_status_section")
                      ? "status"
                      : section.title === t("charges_fx")
                      ? "financial"
                      : "default"
                  }
                />
              ))}
            </div>
          }
        />
      ) : null}

      {currentStep === 2 ? (
        <section className="confirmation-page">
          <PortalCard title={t("payment_success")} variant="emphasis">
            <div className="confirmation-banner">
              <p>{t("your_payment_submitted")}</p>
              <strong>{t("reference")}: {confirmationReference}</strong>
            </div>

            <section className="confirmation-summary">
              <h3>{t("confirmation_summary")}</h3>
              <dl className="readonly-list">
                {confirmationSummaryRows.map((row) => (
                  <div className="readonly-row" key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="confirmation-timelines">
              <Timeline title={t("corporate_authorization_steps")} steps={corporateTimeline} t={t} />
              <Timeline title={t("bank_processing_steps")} steps={bankTimeline} t={t} />
            </div>

            <div className="page-actions">
              <button type="button" className="btn btn--secondary" onClick={resetFlow}>{t("create_another")}</button>
              <button type="button" className="btn btn--primary" onClick={resetFlow}>{t("back_to_payments")}</button>
            </div>
          </PortalCard>
        </section>
      ) : null}
    </AppShell>
  );
}
