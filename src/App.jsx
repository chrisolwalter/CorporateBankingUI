import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { PageContent } from "./components/layout/PageContent";
import { PortalCard } from "./components/cards/PortalCard";
import { FormRow } from "./components/fields/FormRow";
import { ReadOnlyRow } from "./components/fields/ReadOnlyRow";
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

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [language, setLanguage] = useState(portalMockData.languages[0]);
  const [country, setCountry] = useState(portalMockData.countries[0]);
  const [debitAccountId, setDebitAccountId] = useState(portalMockData.debitAccounts[0].id);
  const [beneficiaryAccountId, setBeneficiaryAccountId] = useState(portalMockData.beneficiaryAccounts[0].id);
  const [amount, setAmount] = useState("48500");
  const [valueDate, setValueDate] = useState(portalMockData.valueDateOptions[1]);
  const [paymentPurpose, setPaymentPurpose] = useState(portalMockData.paymentPurposeOptions[0]);
  const [remarks, setRemarks] = useState("March vendor settlement");
  const [chargesBearer, setChargesBearer] = useState(portalMockData.chargesBearerOptions[0]);

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const selectedDebitAccount = useMemo(
    () => portalMockData.debitAccounts.find((account) => account.id === debitAccountId) || portalMockData.debitAccounts[0],
    [debitAccountId]
  );

  const selectedBeneficiary = useMemo(
    () =>
      portalMockData.beneficiaryAccounts.find((account) => account.id === beneficiaryAccountId) ||
      portalMockData.beneficiaryAccounts[0],
    [beneficiaryAccountId]
  );

  const parsedAmount = Number.parseFloat(amount) || 0;
  const fxPair = `${selectedDebitAccount.currency}-${selectedBeneficiary.currency}`;
  const fxRate = portalMockData.derivedDefaults.fxRates[fxPair] ?? 1;
  const estimatedFee = portalMockData.derivedDefaults.estimatedFee;
  const estimatedBeneficiaryAmount = parsedAmount * fxRate;
  const totalDebit = parsedAmount + estimatedFee;

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

  const derivedRows = [
    { label: "Available Balance", value: formatCurrency(selectedDebitAccount.currency, selectedDebitAccount.availableBalance) },
    { label: "Account Currency", value: selectedDebitAccount.currency },
    { label: "Debit Currency", value: selectedDebitAccount.currency },
    { label: "Beneficiary Currency", value: selectedBeneficiary.currency },
    { label: "FX Rate", value: `1 ${selectedDebitAccount.currency} = ${fxRate} ${selectedBeneficiary.currency}` },
    { label: "Estimated Beneficiary Amount", value: formatCurrency(selectedBeneficiary.currency, estimatedBeneficiaryAmount) },
    { label: "Estimated Fee", value: formatCurrency(selectedDebitAccount.currency, estimatedFee) },
    { label: "Validation Status", value: portalMockData.derivedDefaults.validationStatus, tone: "good" },
    { label: "Cut-off Status", value: portalMockData.derivedDefaults.cutoffStatus, tone: "good" },
    { label: "Total Debit", value: formatCurrency(selectedDebitAccount.currency, totalDebit), tone: "strong" }
  ];

  return (
    <AppShell
      header={
        <Header
          portalTitle="Corporate Banking | New Single Transfer"
          currentTime={headerTime}
          language={language}
          country={country}
          languages={portalMockData.languages}
          countries={portalMockData.countries}
          onLanguageChange={setLanguage}
          onCountryChange={setCountry}
        />
      }
      sidebar={<Sidebar collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed((value) => !value)} />}
    >
      <PageContent>
        <PortalCard title="Mandatory Fields" subtitle="Provide required inputs to initiate transfer.">
          <div className="form-grid">
            <FormRow id="debit-account" label="Debit Account">
              <select id="debit-account" value={debitAccountId} onChange={(event) => setDebitAccountId(event.target.value)}>
                {portalMockData.debitAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.label}
                  </option>
                ))}
              </select>
            </FormRow>

            <FormRow id="beneficiary-account" label="Beneficiary Account">
              <select
                id="beneficiary-account"
                value={beneficiaryAccountId}
                onChange={(event) => setBeneficiaryAccountId(event.target.value)}
              >
                {portalMockData.beneficiaryAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.label}
                  </option>
                ))}
              </select>
            </FormRow>

            <FormRow id="amount" label="Amount">
              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </FormRow>
          </div>
        </PortalCard>

        <PortalCard title="Optional Fields" subtitle="Supplementary fields for enriched payment context.">
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
              <input id="remarks" value={remarks} onChange={(event) => setRemarks(event.target.value)} />
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

        <PortalCard title="Derived Fields" subtitle="System-computed and informational values (read-only).">
          <dl className="readonly-list">
            {derivedRows.map((row) => (
              <ReadOnlyRow key={row.label} label={row.label} value={row.value} tone={row.tone} />
            ))}
          </dl>
        </PortalCard>
      </PageContent>
    </AppShell>
  );
}
