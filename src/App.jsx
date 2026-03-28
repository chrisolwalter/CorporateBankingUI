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

  const [debitAccountId, setDebitAccountId] = useState(portalMockData.debitAccounts[0].id);
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [amountMode, setAmountMode] = useState("debit");
  const [amountCurrency, setAmountCurrency] = useState(portalMockData.transferCurrencies[0].id);
  const [amount, setAmount] = useState("");

  const [valueDate, setValueDate] = useState(portalMockData.valueDateOptions[1]);
  const [paymentPurpose, setPaymentPurpose] = useState(portalMockData.paymentPurposeOptions[0]);
  const [remarks, setRemarks] = useState("");
  const [chargesBearer, setChargesBearer] = useState(portalMockData.chargesBearerOptions[0]);

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const selectedCountry = useMemo(
    () => portalMockData.countries.find((country) => country.code === countryCode) || portalMockData.countries[0],
    [countryCode]
  );

  const selectedDebitAccount = useMemo(
    () => portalMockData.debitAccounts.find((account) => account.id === debitAccountId) || portalMockData.debitAccounts[0],
    [debitAccountId]
  );

  const selectedBeneficiary = useMemo(
    () => portalMockData.beneficiaryAccounts.find((beneficiary) => beneficiary.id === beneficiaryId) || null,
    [beneficiaryId]
  );

  const parsedAmount = parseAmount(amount);
  const debitCurrency = selectedDebitAccount.currency;
  const payCurrency = amountCurrency;
  const fxRate = findFxRate(debitCurrency, payCurrency, portalMockData.derivedDefaults.fxRates);

  const debitAmount = amountMode === "debit" ? parsedAmount : parsedAmount / (fxRate || 1);
  const payAmount = amountMode === "pay" ? parsedAmount : parsedAmount * fxRate;

  const estimatedFee = portalMockData.derivedDefaults.estimatedFee;
  const totalDebit = debitAmount + estimatedFee;
  const remainingLimit = Math.max(selectedDebitAccount.dailyLimit - totalDebit, 0);

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
        { label: "Available Balance", value: formatCurrency(debitCurrency, selectedDebitAccount.availableBalance) },
        { label: "Account Currency", value: debitCurrency },
        { label: "Daily Transfer Limit", value: formatCurrency(debitCurrency, selectedDebitAccount.dailyLimit) },
        { label: "Remaining Limit", value: formatCurrency(debitCurrency, remainingLimit) }
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
        { label: "Value Date", value: valueDate },
        { label: "Payment Purpose", value: paymentPurpose }
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
          <StepTracker steps={["Initiate", "Review", "Confirmation"]} currentStep={0} />
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
                  options={portalMockData.debitAccounts}
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

                <FormRow id="payment-purpose" label="Payment Purpose">
                  <select id="payment-purpose" value={paymentPurpose} onChange={(event) => setPaymentPurpose(event.target.value)}>
                    {portalMockData.paymentPurposeOptions.map((option) => (
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
                  <select id="charges-bearer" value={chargesBearer} onChange={(event) => setChargesBearer(event.target.value)}>
                    {portalMockData.chargesBearerOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
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
