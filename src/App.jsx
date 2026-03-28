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

function getDisplayedValueDate(valueDateOption) {
  const today = new Date();
  const formatDate = (date) => date.toISOString().slice(0, 10);

  if (valueDateOption === "Today") {
    return `${formatDate(today)} (Today)`;
  }

  if (valueDateOption === "Next Business Day") {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    return `${formatDate(nextDay)} (Scheduled)`;
  }

  const customDay = new Date(today);
  customDay.setDate(today.getDate() + 3);
  return `${formatDate(customDay)} (Scheduled)`;
}

function parseEmails(input) {
  return input
    .split(/[\n,]+/)
    .map((email) => email.trim())
    .filter(Boolean);
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

  const debitAccountsForCountry = useMemo(() => {
    if (countryCode === "GLOBAL") {
      return portalMockData.debitAccounts;
    }

    return portalMockData.debitAccounts.filter((account) => account.countryCode === countryCode);
  }, [countryCode]);

  const [debitAccountId, setDebitAccountId] = useState("");
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [paymentPurpose, setPaymentPurpose] = useState(portalMockData.paymentPurposeOptions[0]);
  const [senderPurposeCode, setSenderPurposeCode] = useState("");
  const [amountMode, setAmountMode] = useState("debit");
  const [amountCurrency, setAmountCurrency] = useState(portalMockData.transferCurrencies[0].id);
  const [amount, setAmount] = useState("");

  const [valueDate, setValueDate] = useState("Today");
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

  useEffect(() => {
    if (!debitAccountsForCountry.length) {
      setDebitAccountId("");
      return;
    }

    const stillValid = debitAccountsForCountry.some((account) => account.id === debitAccountId);
    if (!stillValid) {
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
    if (!requiresSenderPurposeCode) {
      setSenderPurposeCode("");
    }
  }, [requiresSenderPurposeCode]);

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
    !requiresSenderPurposeCode || Boolean(senderPurposeCode)
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

  const rightSections = [
    {
      title: "Account & Limits",
      rows: [
        { label: "Available Balance", value: formatCurrency(debitCurrency, availableBalance) },
        { label: "Daily Transfer Limit", value: formatCurrency(debitCurrency, dailyLimit) },
        { label: "Remaining Balance", value: formatCurrency(debitCurrency, remainingBalance) }
      ]
    },
    {
      title: "Charges & FX",
      rows: [
        { label: "Debit Amount", value: formatCurrency(debitCurrency, debitAmount) },
        { label: "Pay Amount", value: formatCurrency(payCurrency, payAmount) },
        { label: "FX Rate Applied", value: `1 ${debitCurrency} = ${fxRate} ${payCurrency}` }
      ]
    },
    {
      title: "Validation & Status",
      rows: [
        { label: "Validation Status", value: beneficiaryId ? portalMockData.derivedDefaults.validationStatus : "Pending beneficiary selection" },
        { label: "Cut-off Status", value: portalMockData.derivedDefaults.cutoffStatus, tone: "good" },
        { label: "Value Date", value: getDisplayedValueDate(valueDate) },
        { label: "Charges Bearer", value: chargesBearerSelection?.code || chargesBearerCode }
      ]
    },
    {
      title: "Beneficiary Details",
      rows: [
        { label: "Beneficiary Name", value: selectedBeneficiary?.name || "—" },
        { label: "Beneficiary Account Number / IBAN", value: selectedBeneficiary?.accountNumber || "—" },
        { label: "Beneficiary Country", value: selectedBeneficiary?.country || "—" },
        { label: "Beneficiary Bank Name", value: selectedBeneficiary?.bankName || "—" },
        { label: "Beneficiary Bank Address", value: selectedBeneficiary?.bankAddress || "—" },
        { label: "Beneficiary Address", value: selectedBeneficiary?.beneficiaryAddress || "—" }
      ]
    }
  ];

  const reviewLeftGroups = [
    {
      title: "Payment Details Entered",
      items: [
        { label: "Debit Account", value: selectedDebitAccount?.label || "—" },
        { label: "Beneficiary", value: selectedBeneficiary?.label || "—" },
        { label: "Payment Purpose", value: paymentPurpose },
        { label: "Sender Purpose Code", value: requiresSenderPurposeCode ? senderPurposeCode || "—" : "Not required" },
        { label: "Amount Mode", value: amountMode === "debit" ? "Debit" : "Pay" },
        { label: "Amount Currency", value: amountCurrency },
        { label: "Amount", value: amount || "—" }
      ]
    },
    {
      title: "Additional Information",
      items: [
        { label: "Value Date", value: getDisplayedValueDate(valueDate) },
        { label: "Intermediary Bank", value: selectedIntermediaryBank?.label || "—" },
        { label: "Charges Bearer", value: chargesBearerSelection?.label || chargesBearerCode },
        { label: "Uploaded Documents", value: selectedFiles.length ? selectedFiles.join(", ") : "—" },
        { label: "Beneficiary Advice Emails", value: beneficiaryAdvice || "—" },
        { label: "Remarks", value: remarks || "—" }
      ]
    },
    {
      title: "Beneficiary & Bank Details",
      items: [
        { label: "Beneficiary Name", value: selectedBeneficiary?.name || "—" },
        { label: "Beneficiary Account", value: selectedBeneficiary?.accountNumber || "—" },
        { label: "Beneficiary Country", value: selectedBeneficiary?.country || "—" },
        { label: "Beneficiary Address", value: selectedBeneficiary?.beneficiaryAddress || "—" },
        { label: "Beneficiary Bank Name", value: selectedBeneficiary?.bankName || "—" },
        { label: "Beneficiary Bank Address", value: selectedBeneficiary?.bankAddress || "—" }
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
    setValueDate("Today");
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
            portalTitle="Corporate Banking Payment Services"
            currentTime={headerTime}
            language={language}
            country={countryCode}
            countryFlag={selectedCountry.flag}
            languages={selectedCountry.languages}
            countries={portalMockData.countries.map((country) => ({ value: country.code, label: country.label }))}
            onLanguageChange={setLanguage}
            onCountryChange={(nextCountryCode) => {
              setCountryCode(nextCountryCode);
              setLanguage("English");
            }}
          />
          <StepTracker steps={["Initiate", "Review", "Confirmation"]} currentStep={currentStep} progress={stepProgress} completed={currentStep === 2} />
        </>
      }
    >
      {currentStep === 0 ? (
        <PageContent
          leftColumn={
            <>
              <PortalCard title="Single Payment Details">
                <div className="form-stack">
                  <SearchableSelect
                    id="debit-account"
                    label="Debit Account"
                    options={debitAccountsForCountry}
                    value={debitAccountId}
                    onChange={setDebitAccountId}
                    placeholder="Search debit account"
                  />

                  <SearchableSelect
                    id="beneficiary"
                    label="Beneficiary"
                    options={portalMockData.beneficiaryAccounts}
                    value={beneficiaryId}
                    onChange={setBeneficiaryId}
                    placeholder="Search beneficiary"
                    noDefault
                  />

                  <div className="form-grid form-grid--mandatory-purpose">
                    <FormRow id="payment-purpose" label="Payment Purpose">
                      <select id="payment-purpose" value={paymentPurpose} onChange={(event) => setPaymentPurpose(event.target.value)}>
                        {portalMockData.paymentPurposeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </FormRow>

                    {requiresSenderPurposeCode ? (
                      <FormRow id="sender-purpose-code" label="Sender Purpose Code">
                        <select id="sender-purpose-code" value={senderPurposeCode} onChange={(event) => setSenderPurposeCode(event.target.value)}>
                          <option value="">Select code</option>
                          {portalMockData.senderPurposeCodeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </FormRow>
                    ) : null}
                  </div>

                  <div className="amount-control-row">
                    <div className="mode-toggle" role="group" aria-label="amount mode">
                      <button
                        type="button"
                        className={amountMode === "debit" ? "is-active" : ""}
                        onClick={() => setAmountMode("debit")}
                      >
                        Debit
                      </button>
                      <button
                        type="button"
                        className={amountMode === "pay" ? "is-active" : ""}
                        onClick={() => setAmountMode("pay")}
                      >
                        Pay
                      </button>
                    </div>

                    <SearchableSelect
                      id="amount-currency"
                      label="Amount Currency"
                      options={portalMockData.transferCurrencies}
                      value={amountCurrency}
                      onChange={setAmountCurrency}
                      placeholder="Search currency"
                    />

                    <FormRow id="amount" label="Amount">
                      <input
                        id="amount"
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        placeholder="Enter amount"
                        onChange={(event) => {
                          const nextValue = event.target.value.replace(/[^\d.,]/g, "");
                          setAmount(nextValue);
                        }}
                        onFocus={() => setAmount((previous) => previous.replace(/,/g, ""))}
                        onBlur={() => setAmount((previous) => formatAmountInput(previous))}
                      />
                    </FormRow>
                  </div>
                </div>
              </PortalCard>

              <PortalCard title="Additional Information">
                <div className="form-grid">
                  <FormRow id="value-date" label="Value Date">
                    <select id="value-date" value={valueDate} onChange={(event) => setValueDate(event.target.value)}>
                      {portalMockData.valueDateOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </FormRow>

                  <SearchableSelect
                    id="intermediary-bank"
                    label="Intermediary Bank"
                    options={portalMockData.intermediaryBanks}
                    value={intermediaryBankId}
                    onChange={setIntermediaryBankId}
                    placeholder="Select intermediary bank"
                    noDefault
                  />

                  <FormRow id="charges-bearer" label="Charges Bearer">
                    <select id="charges-bearer" value={chargesBearerCode} onChange={(event) => setChargesBearerCode(event.target.value)}>
                      {portalMockData.chargesBearerOptions.map((option) => (
                        <option key={option.code} value={option.code}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </FormRow>

                  <FormRow id="supporting-documents" label="Upload Supporting Documents">
                    <input
                      id="supporting-documents"
                      type="file"
                      multiple
                      onChange={(event) => {
                        const files = Array.from(event.target.files || []).map((file) => file.name);
                        setSelectedFiles(files);
                      }}
                    />
                    {selectedFiles.length ? <p className="inline-note">{selectedFiles.join(", ")}</p> : null}
                  </FormRow>

                  <FormRow id="beneficiary-advice" label="Beneficiary Advice Emails">
                    <textarea
                      id="beneficiary-advice"
                      rows={3}
                      placeholder="Enter up to 5 emails, separated by commas or new lines"
                      value={beneficiaryAdvice}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        const emails = parseEmails(nextValue);
                        if (emails.length > 5) {
                          setAdviceError("You can enter up to 5 email addresses.");
                        } else {
                          setAdviceError("");
                        }
                        setBeneficiaryAdvice(nextValue);
                      }}
                    />
                    {adviceError ? <p className="inline-error">{adviceError}</p> : null}
                  </FormRow>

                  <FormRow id="remarks" label="Remarks">
                    <input id="remarks" value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Optional comments" />
                  </FormRow>
                </div>
              </PortalCard>

              <div className="page-actions page-actions--right">
                <button type="button" className="btn btn--primary" onClick={() => setCurrentStep(1)}>
                  Submit
                </button>
              </div>
            </>
          }
          rightColumn={
            <div className="derived-sections derived-sections--standalone">
              {rightSections.map((section) => (
                <DerivedSection key={section.title} title={section.title} rows={section.rows} />
              ))}
            </div>
          }
        />
      ) : null}

      {currentStep === 1 ? (
        <PageContent
          leftColumn={
            <>
              <PortalCard title="Review Payment Details">
                <div className="review-layout">
                  {reviewLeftGroups.map((group) => (
                    <ReviewList key={group.title} title={group.title} items={group.items} />
                  ))}
                </div>
              </PortalCard>

              <div className="page-actions">
                <button type="button" className="btn btn--secondary" onClick={() => setCurrentStep(0)}>
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => {
                    setConfirmationReference(DEFAULT_CONFIRMATION_REFERENCE);
                    setCurrentStep(2);
                  }}
                >
                  Confirm / Submit for Authorization
                </button>
              </div>
            </>
          }
          rightColumn={
            <div className="derived-sections derived-sections--standalone">
              {rightSections.map((section) => (
                <DerivedSection key={section.title} title={section.title} rows={section.rows} />
              ))}
            </div>
          }
        />
      ) : null}

      {currentStep === 2 ? (
        <section className="confirmation-page">
          <PortalCard title="Payment Submitted Successfully">
            <div className="confirmation-banner">
              <p>Your payment has been successfully submitted.</p>
              <strong>Reference: {confirmationReference}</strong>
            </div>

            <div className="confirmation-timelines">
              <Timeline title="Corporate Authorization Steps" steps={corporateTimeline} />
              <Timeline title="Bank Processing Steps" steps={bankTimeline} />
            </div>

            <div className="page-actions">
              <button type="button" className="btn btn--secondary" onClick={resetFlow}>
                Create Another Payment
              </button>
              <button type="button" className="btn btn--primary" onClick={resetFlow}>
                Back to Payments
              </button>
            </div>
          </PortalCard>
        </section>
      ) : null}
    </AppShell>
  );
}
