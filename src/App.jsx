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
    single_payment_details: "Single Payment Details",
    debit_account: "Debit Account",
    beneficiary: "Beneficiary",
    amount_currency: "Amount Currency",
    amount: "Amount",
    payment_purpose: "Payment Purpose",
    sender_purpose_code: "Sender Purpose Code",
    additional_information: "Additional Information",
    value_date: "Value Date",
    custom_date: "Custom Date",
    debit_value_date: "Debit Value Date",
    intermediary_bank: "Intermediary Bank",
    charges_bearer: "Charges Bearer",
    upload_documents: "Upload Supporting Documents",
    beneficiary_advice: "Beneficiary Advice Emails",
    remarks: "Remarks",
    submit: "Submit",
    back: "Back",
    confirm_submit: "Confirm / Submit for Authorization",
    back_to_payments: "Back to Payments",
    create_another: "Create Another Payment",
    account_limits: "Account & Limits",
    available_balance: "Available Balance",
    daily_transfer_limit: "Daily Transfer Limit",
    remaining_balance: "Remaining Balance",
    charges_fx: "Charges & FX",
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
    single_payment_details: "Détails du paiement unique",
    debit_account: "Compte de débit",
    beneficiary: "Bénéficiaire",
    amount_currency: "Devise du montant",
    amount: "Montant",
    payment_purpose: "Objet du paiement",
    sender_purpose_code: "Code objet de l'émetteur",
    additional_information: "Informations complémentaires",
    value_date: "Date de valeur",
    custom_date: "Date personnalisée",
    debit_value_date: "Date de valeur débit",
    intermediary_bank: "Banque intermédiaire",
    charges_bearer: "Prise en charge des frais",
    upload_documents: "Télécharger les justificatifs",
    beneficiary_advice: "Emails d'avis au bénéficiaire",
    remarks: "Remarques",
    submit: "Soumettre",
    back: "Retour",
    confirm_submit: "Confirmer / Soumettre pour autorisation",
    back_to_payments: "Retour aux paiements",
    create_another: "Créer un autre paiement",
    account_limits: "Compte et limites",
    available_balance: "Solde disponible",
    daily_transfer_limit: "Limite de transfert quotidienne",
    remaining_balance: "Solde restant",
    charges_fx: "Frais et FX",
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
    payment_success: "Paiement soumis avec succès"
  }
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

function Timeline({ title, steps }) {
  return (
    <section className="timeline-card">
      <h3>{title}</h3>
      <ul className="timeline">
        {steps.map((step) => (
          <li key={step.label} className={`timeline__item timeline__item--${step.state}`}>
            <span className="timeline__dot" aria-hidden="true" />
            <div>
              <strong>{step.label}</strong>
              <p>{step.state === "done" ? "Completed" : step.state === "current" ? "In Progress" : "Pending"}</p>
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
  const payAmount = amountMode === "pay" ? parsedAmount : parsedAmount * fxRate;

  const estimatedFee = portalMockData.derivedDefaults.estimatedFee;
  const debitImpact = debitAmount + estimatedFee;
  const availableBalance = selectedDebitAccount?.availableBalance || 0;
  const dailyLimit = selectedDebitAccount?.dailyLimit || 0;
  const remainingBalance = Math.max(availableBalance - debitImpact, 0);

  const chargesBearerSelection = portalMockData.chargesBearerOptions.find((option) => option.code === chargesBearerCode);

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
        { label: t("daily_transfer_limit"), value: formatCurrency(debitCurrency, dailyLimit) },
        { label: t("remaining_balance"), value: formatCurrency(debitCurrency, remainingBalance) }
      ]
    },
    {
      title: t("charges_fx"),
      rows: [
        { label: t("debit_amount"), value: formatCurrency(debitCurrency, debitAmount) },
        { label: t("pay_amount"), value: formatCurrency(payCurrency, payAmount) },
        { label: t("fx_rate_applied"), value: `1 ${debitCurrency} = ${fxRate} ${payCurrency}` }
      ]
    },
    {
      title: t("validation_status_section"),
      rows: [
        { label: t("validation_status"), value: beneficiaryId ? portalMockData.derivedDefaults.validationStatus : "Pending beneficiary selection" },
        { label: t("cutoff_status"), value: isCutoffPassed ? "Cut-off passed" : "Within cut-off", tone: isCutoffPassed ? "default" : "good" },
        { label: t("debit_value_date"), value: debitValueDate },
        { label: t("credit_value_date"), value: creditDateRolled ? `${creditValueDate} (rolled to next business day)` : creditValueDate }
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
        { label: t("sender_purpose_code"), value: requiresSenderPurposeCode ? senderPurposeCode || "—" : "Not required" },
        { label: "Mode", value: amountMode === "debit" ? "Debit" : "Pay" },
        { label: t("amount_currency"), value: amountCurrency },
        { label: t("amount"), value: amount || "—" }
      ]
    },
    {
      title: t("additional_information"),
      items: [
        { label: t("value_date"), value: valueDate },
        { label: t("custom_date"), value: valueDate === "Custom Date" ? customDate : "Not selected" },
        { label: t("debit_value_date"), value: debitValueDate },
        { label: t("credit_value_date"), value: creditDateRolled ? `${creditValueDate} (rolled)` : creditValueDate },
        { label: t("intermediary_bank"), value: selectedIntermediaryBank?.label || "—" },
        { label: t("charges_bearer"), value: chargesBearerSelection?.label || chargesBearerCode },
        { label: t("upload_documents"), value: selectedFiles.length ? selectedFiles.join(", ") : "—" },
        { label: t("beneficiary_advice"), value: beneficiaryAdvice || "—" },
        { label: t("remarks"), value: remarks || "—" }
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
    }
  ];

  const corporateTimeline = [
    { label: "Initiated by Maker", state: "done" },
    { label: "Awaiting Checker Authorization", state: "current" },
    { label: "Checker Approved", state: "pending" },
    { label: "Released to Bank", state: "pending" }
  ];

  const bankTimeline = [
    { label: "Payment Instruction Received", state: "done" },
    { label: "Compliance / Screening", state: "current" },
    { label: "FX Booking / Conversion", state: "pending" },
    { label: "Payment Processing", state: "pending" },
    { label: "Beneficiary Credit", state: "pending" }
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
    setRemarks("");
    setChargesBearerCode(portalMockData.chargesBearerOptions[0].code);
    setBeneficiaryAdvice("");
    setAdviceError("");
    setSelectedFiles([]);
    setConfirmationReference(DEFAULT_CONFIRMATION_REFERENCE);
  };

  return (
    <AppShell
      sidebar={<Sidebar collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed((value) => !value)} />}
      header={
        <>
          <Header
            portalTitle={t("header_title")}
            currentTime={headerTime}
            language={language}
            country={countryCode}
            countryFlag={selectedCountry.flag}
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
          />
        </>
      }
    >
      {currentStep === 0 ? (
        <PageContent
          leftColumn={
            <>
              <PortalCard title={t("single_payment_details")}>
                <div className="form-stack">
                  <SearchableSelect
                    id="debit-account"
                    label={t("debit_account")}
                    options={debitAccountsForCountry}
                    value={debitAccountId}
                    onChange={setDebitAccountId}
                    placeholder="Search debit account"
                  />

                  <SearchableSelect
                    id="beneficiary"
                    label={t("beneficiary")}
                    options={portalMockData.beneficiaryAccounts}
                    value={beneficiaryId}
                    onChange={setBeneficiaryId}
                    placeholder="Search beneficiary"
                    noDefault
                  />

                  <div className="amount-control-row">
                    <div className="mode-toggle" role="group" aria-label="amount mode">
                      <button type="button" className={amountMode === "debit" ? "is-active" : ""} onClick={() => setAmountMode("debit")}>Debit</button>
                      <button type="button" className={amountMode === "pay" ? "is-active" : ""} onClick={() => setAmountMode("pay")}>Pay</button>
                    </div>

                    <SearchableSelect
                      id="amount-currency"
                      label={t("amount_currency")}
                      options={portalMockData.transferCurrencies}
                      value={amountCurrency}
                      onChange={setAmountCurrency}
                      placeholder="Search currency"
                    />

                    <FormRow id="amount" label={t("amount")}>
                      <input
                        id="amount"
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        placeholder="Enter amount"
                        onChange={(event) => setAmount(event.target.value.replace(/[^\d.,]/g, ""))}
                        onFocus={() => setAmount((previous) => previous.replace(/,/g, ""))}
                        onBlur={() => setAmount((previous) => formatAmountInput(previous))}
                      />
                    </FormRow>
                  </div>

                  <div className="form-grid form-grid--mandatory-purpose">
                    <FormRow id="payment-purpose" label={t("payment_purpose")}>
                      <select id="payment-purpose" value={paymentPurpose} onChange={(event) => setPaymentPurpose(event.target.value)}>
                        {portalMockData.paymentPurposeOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </FormRow>

                    {requiresSenderPurposeCode ? (
                      <FormRow id="sender-purpose-code" label={t("sender_purpose_code")}>
                        <select id="sender-purpose-code" value={senderPurposeCode} onChange={(event) => setSenderPurposeCode(event.target.value)}>
                          <option value="">Select code</option>
                          {portalMockData.senderPurposeCodeOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </FormRow>
                    ) : null}
                  </div>
                </div>
              </PortalCard>

              <PortalCard title={t("additional_information")}>
                <div className="form-grid">
                  <FormRow id="value-date" label={t("value_date")}>
                    <select id="value-date" value={valueDate} onChange={(event) => setValueDate(event.target.value)}>
                      {portalMockData.valueDateOptions.map((option) => {
                        if (option === "Today" && isCutoffPassed) return null;
                        const label = option === "Customer Date" ? t("custom_date") : option;
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
                    placeholder="Select intermediary bank"
                    noDefault
                  />

                  <FormRow id="charges-bearer" label={t("charges_bearer")}>
                    <select id="charges-bearer" value={chargesBearerCode} onChange={(event) => setChargesBearerCode(event.target.value)}>
                      {portalMockData.chargesBearerOptions.map((option) => (
                        <option key={option.code} value={option.code}>{option.label}</option>
                      ))}
                    </select>
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

                  <FormRow id="beneficiary-advice" label={t("beneficiary_advice")}>
                    <textarea
                      id="beneficiary-advice"
                      rows={3}
                      placeholder="Enter up to 5 emails, separated by commas or new lines"
                      value={beneficiaryAdvice}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        const emails = parseEmails(nextValue);
                        setAdviceError(emails.length > 5 ? "You can enter up to 5 email addresses." : "");
                        setBeneficiaryAdvice(nextValue);
                      }}
                    />
                    {adviceError ? <p className="inline-error">{adviceError}</p> : null}
                  </FormRow>

                  <FormRow id="remarks" label={t("remarks")}>
                    <textarea id="remarks" rows={3} value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Optional multi-line comments" />
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
          rightColumn={<div className="derived-sections derived-sections--standalone">{rightSections.map((section) => <DerivedSection key={section.title} title={section.title} rows={section.rows} />)}</div>}
        />
      ) : null}

      {currentStep === 1 ? (
        <PageContent
          leftColumn={
            <>
              <PortalCard title={t("review_payment")}>
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
          rightColumn={<div className="derived-sections derived-sections--standalone">{rightSections.map((section) => <DerivedSection key={section.title} title={section.title} rows={section.rows} />)}</div>}
        />
      ) : null}

      {currentStep === 2 ? (
        <section className="confirmation-page">
          <PortalCard title={t("payment_success")}>
            <div className="confirmation-banner">
              <p>Your payment has been successfully submitted.</p>
              <strong>Reference: {confirmationReference}</strong>
            </div>

            <div className="confirmation-timelines">
              <Timeline title="Corporate Authorization Steps" steps={corporateTimeline} />
              <Timeline title="Bank Processing Steps" steps={bankTimeline} />
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
