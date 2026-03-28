import { SectionCard } from "./components/SectionCard";
import { FieldChecklist } from "./components/FieldChecklist";
import { KeyValueList } from "./components/KeyValueList";
import { ValidationList } from "./components/ValidationList";
import { transferMockData } from "./data/transferMockData";
import "./styles/newSingleTransfer.css";

function NewSingleTransferPage() {
  const { mandatoryFields, optionalFields, accountInfo, chargesFx, validationStatus, transferSummary } = transferMockData;

  const accountInfoItems = [
    { label: "Company", value: accountInfo.company },
    { label: "Account Name", value: accountInfo.accountName },
    { label: "Account Number", value: accountInfo.accountNumber },
    { label: "Available Balance", value: accountInfo.availableBalance },
    { label: "Daily Limit", value: accountInfo.dailyLimit },
    { label: "Used Today", value: accountInfo.usedToday }
  ];

  const chargesFxItems = [
    { label: "Charge Type", value: chargesFx.chargeType },
    { label: "FX Required", value: chargesFx.fxRequired ? "Yes" : "No" },
    { label: "Debit Currency", value: chargesFx.debitCurrency },
    { label: "Beneficiary Currency", value: chargesFx.beneficiaryCurrency },
    { label: "Indicative Rate", value: chargesFx.indicativeRate },
    { label: "Estimated Beneficiary Amount", value: chargesFx.estimatedBeneficiaryAmount },
    { label: "Estimated Fee", value: chargesFx.estimatedFee }
  ];

  const transferSummaryItems = [
    { label: "Transfer Type", value: transferSummary.transferType },
    { label: "Transfer Channel", value: transferSummary.transferChannel },
    { label: "Execution Speed", value: transferSummary.executionSpeed },
    { label: "Scheduled Time", value: transferSummary.scheduledTime },
    { label: "Prepared By", value: transferSummary.preparedBy },
    { label: "Total Debit", value: transferSummary.totalDebit }
  ];

  return (
    <main className="transfer-page">
      <header className="transfer-page__header">
        <p className="eyebrow">Corporate Banking</p>
        <h1>New Single Transfer</h1>
        <p>Complete transfer details and review validation before submission.</p>
      </header>

      <section className="transfer-page__content" aria-label="new single transfer layout">
        <div className="panel panel--left" aria-label="input fields panel">
          <SectionCard title="Mandatory Fields" subtitle="Complete all required information" tone="primary">
            <FieldChecklist fields={mandatoryFields} />
          </SectionCard>
          <SectionCard title="Optional Fields" subtitle="Additional details to improve processing">
            <FieldChecklist fields={optionalFields} />
          </SectionCard>
        </div>

        <div className="panel panel--right" aria-label="review panel">
          <SectionCard title="Account Info">
            <KeyValueList items={accountInfoItems} />
          </SectionCard>

          <SectionCard title="Charges / FX">
            <KeyValueList items={chargesFxItems} />
          </SectionCard>

          <SectionCard title="Validation Status" tone="success">
            <ValidationList checks={validationStatus} />
          </SectionCard>

          <SectionCard title="Transfer Summary" tone="highlight">
            <KeyValueList items={transferSummaryItems} />
          </SectionCard>
        </div>
      </section>
    </main>
  );
}

export default NewSingleTransferPage;
