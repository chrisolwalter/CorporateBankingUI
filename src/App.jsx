import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { PageContent } from "./components/layout/PageContent";
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

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [language, setLanguage] = useState(portalMockData.languages[0]);
  const [country, setCountry] = useState(portalMockData.countries[0]);

  const [debitAccountId, setDebitAccountId] = useState(portalMockData.debitAccounts[0].id);
  const [beneficiaryAccountId, setBeneficiaryAccountId] = useState("");
  const [amountCurrency, setAmountCurrency] = useState(portalMockData.debitAccounts[0].currency);
  const [amount, setAmount] = useState("");

  const [valueDate, setValueDate] = useState(portalMockData.valueDateOptions[1]);
  const [paymentPurpose, setPaymentPurpose] = useState(portalMockData.paymentPurposeOptions[0]);
  const [remarks, setRemarks] = useState("");
  const [chargesBearer, setChargesBearer] = useState(portalMockData.chargesBearerOptions[0]);

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const selectedDebitAccount = useMemo(
    () => portalMockData.debitAccounts.find((account) => account.id === debitAccountId) || portalMockData.debitAccounts[0],
    [debitAccountId]
  );

  useEffect(() => {
    setAmountCurrency(selectedDebitAccount.currency);
  }, [selectedDebitAccount.currency]);

  const selectedBeneficiary = useMemo(
    () => portalMockData.beneficiaryAccounts.find((account) => account.id === beneficiaryAccountId) || null,
    [beneficiaryAccountId]
  );

  const currencyOptions = useMemo(
    () => [...new Set(portalMockData.debitAccounts.map((account) => account.currency))],
    []
  );

  const parsedAmount = Number.parseFloat(amount) || 0;
  const beneficiaryCurrency = selectedBeneficiary?.currency || "—";
  const fxPair = `${amountCurrency}-${selectedBeneficiary?.currency || amountCurrency}`;
  const fxRate = portalMockData.derivedDefaults.fxRates[fxPair] ?? 1;
  const estimatedFee = portalMockData.derivedDefaults.estimatedFee;
  const estimatedBeneficiaryAmount = parsedAmount * fxRate;
  const totalDebit = parsedAmount + estimatedFee;
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

  const derivedGroups = [
    {
      title: "Account & Limits",
      rows: [
        { label: "Available Balance", value: formatCurrency(selectedDebitAccount.currency, selectedDebitAccount.availableBalance) },
        { label: "Account Currency", value: selectedDebitAccount.currency },
        { label: "Daily Transfer Limit", value: formatCurrency(selectedDebitAccount.currency, selectedDebitAccount.dailyLimit) },
        { label: "Remaining Limit", value: formatCurrency(selectedDebitAccount.currency, remainingLimit) }
      ]
    },
    {
      title: "Charges & FX",
      rows: [
        { label: "Amount Currency", value: amountCurrency },
        { label: "Beneficiary Currency", value: beneficiaryCurrency },
        { label: "FX Rate", value: `1 ${amountCurrency} = ${fxRate} ${beneficiaryCurrency}` },
        { label: "Estimated Beneficiary Amount", value: formatCurrency(selectedBeneficiary?.currency || amountCurrency, estimatedBeneficiaryAmount) },
        { label: "Estimated Fee", value: formatCurrency(amountCurrency, estimatedFee) },
        { label: "Charges Bearer", value: chargesBearer }
      ]
    },
    {
      title: "Validation & Status",
      rows: [
        { label: "Validation Status", value: beneficiaryAccountId ? portalMockData.derivedDefaults.validationStatus : "Pending beneficiary selection" },
        { label: "Cut-off Status", value: portalMockData.derivedDefaults.cutoffStatus, tone: "good" },
        { label: "Value Date", value: valueDate },
        { label: "Payment Purpose", value: paymentPurpose }
      ]
    },
    {
      title: "Final Summary",
      rows: [
        { label: "Transfer Amount", value: formatCurrency(amountCurrency, parsedAmount) },
        { label: "Total Debit", value: formatCurrency(amountCurrency, totalDebit), tone: "strong" },
        { label: "Remarks", value: remarks || "—" }
      ]
    }
  ];

  return (
    <AppShell
      sidebar={<Sidebar collapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed((value) => !value)} />}
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
    >
      <PageContent
        leftColumn={
          <>
            <PortalCard title="Mandatory Fields" subtitle="Provide required inputs to initiate transfer.">
              <div className="form-grid form-grid--mandatory">
                <SearchableSelect
                  id="debit-account"
                  label="Debit Account"
                  options={portalMockData.debitAccounts}
                  value={debitAccountId}
                  onChange={setDebitAccountId}
                  placeholder="Search debit account"
                />

                <SearchableSelect
                  id="beneficiary-account"
                  label="Beneficiary Account"
                  options={portalMockData.beneficiaryAccounts}
                  value={beneficiaryAccountId}
                  onChange={setBeneficiaryAccountId}
                  placeholder="Search beneficiary account"
                  noDefault
                />

                <FormRow id="amount-currency" label="Amount Currency">
                  <select id="amount-currency" value={amountCurrency} onChange={(event) => setAmountCurrency(event.target.value)}>
                    {currencyOptions.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
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
                    placeholder="Enter amount"
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
          <PortalCard title="Derived Fields" subtitle="Read-only system-computed insights and status.">
            <div className="derived-sections">
              {derivedGroups.map((group) => (
                <DerivedSection key={group.title} title={group.title} rows={group.rows} />
              ))}
            </div>
          </PortalCard>
        }
      />
    </AppShell>
  );
}
