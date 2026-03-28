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

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [countryCode, setCountryCode] = useState(portalMockData.countries[0].code);
  const [language, setLanguage] = useState("English");

  const debitAccountsForCountry = useMemo(
    () => portalMockData.debitAccounts.filter((account) => account.countryCode === countryCode),
    [countryCode]
  );

  const [debitAccountId, setDebitAccountId] = useState("");
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [paymentPurpose, setPaymentPurpose] = useState(portalMockData.paymentPurposeOptions[0]);
  const [senderPurposeCode, setSenderPurposeCode] = useState("");
  const [amountMode, setAmountMode] = useState("debit");
  const [amountCurrency, setAmountCurrency] = useState(portalMockData.transferCurrencies[0].id);
  const [amount, setAmount] = useState("");

  const [valueDate, setValueDate] = useState("Today");
  const [remarks, setRemarks] = useState("");
  const [chargesBearerCode, setChargesBearerCode] = useState(portalMockData.chargesBearerOptions[0].code);

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
        { label: "Value Date", value: valueDate === "Today" ? "Today" : "Scheduled" },
        { label: "Charges Bearer", value: chargesBearerSelection?.code || chargesBearerCode }
      ]
    }
  ];

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
            languages={selectedCountry.languages}
            countries={portalMockData.countries.map((country) => ({ value: country.code, label: country.label }))}
            onLanguageChange={setLanguage}
            onCountryChange={(nextCountryCode) => {
              setCountryCode(nextCountryCode);
              setLanguage("English");
            }}
          />
          <StepTracker steps={["Initiate", "Review", "Confirmation"]} currentStep={0} progress={mandatoryCompletion} />
        </>
      }
    >
      <PageContent
        leftColumn={
          <>
            <PortalCard title="Single Payment Details" subtitle="Provide required inputs to initiate transfer.">
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

            <PortalCard title="Additional Information" subtitle="Supplementary fields for enriched payment context.">
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

                <FormRow id="remarks" label="Remarks">
                  <input id="remarks" value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Optional comments" />
                </FormRow>

                <FormRow id="charges-bearer" label="Charges Bearer">
                  <select id="charges-bearer" value={chargesBearerCode} onChange={(event) => setChargesBearerCode(event.target.value)}>
                    {portalMockData.chargesBearerOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormRow>
              </div>
            </PortalCard>
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
    </AppShell>
  );
}
