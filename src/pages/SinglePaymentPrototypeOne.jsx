import { PageContent } from "../components/layout/PageContent";
import { PortalCard } from "../components/cards/PortalCard";
import { DerivedSection } from "../components/cards/DerivedSection";
import { FormRow } from "../components/fields/FormRow";
import { SearchableSelect } from "../components/fields/SearchableSelect";
import { Timeline, ReviewList } from "./sharedSections";
import { ConfirmationSummarySection } from "./ConfirmationSummarySection";

export function SinglePaymentPrototypeOne({ m }) {
  if (m.currentStep === 0) {
    return (
      <PageContent
        leftColumn={
          <>
            <PortalCard title={m.t("single_payment_details")} variant="primary">
              <div className="form-stack">
                <SearchableSelect id="debit-account" label={m.t("debit_account")} options={m.debitAccountsForCountry} value={m.debitAccountId} onChange={m.setDebitAccountId} placeholder={m.t("search_debit_account")} emptyLabel={m.t("no_matching_results")} required />
                <SearchableSelect id="beneficiary" label={m.t("beneficiary")} options={m.portalMockData.beneficiaryAccounts} value={m.beneficiaryId} onChange={m.setBeneficiaryId} placeholder={m.t("search_beneficiary")} noDefault noSelectionLabel={m.t("no_selection")} emptyLabel={m.t("no_matching_results")} required />
                <div className="amount-control-row">
                  <div className="mode-toggle" role="group" aria-label={m.t("amount_mode")}>
                    <button type="button" className={m.amountMode === "debit" ? "is-active" : ""} onClick={() => m.setAmountMode("debit")}>{m.t("debit")}</button>
                    <button type="button" className={m.amountMode === "pay" ? "is-active" : ""} onClick={() => m.setAmountMode("pay")}>{m.t("pay")}</button>
                  </div>
                  <SearchableSelect id="amount-currency" label={m.t("amount_currency")} options={m.portalMockData.transferCurrencies} value={m.amountCurrency} onChange={m.setAmountCurrency} placeholder={m.t("search_currency")} emptyLabel={m.t("no_matching_results")} required />
                  <FormRow id="amount" label={m.t("amount")} required>
                    <input id="amount" type="text" inputMode="decimal" value={m.amount} placeholder={m.t("enter_amount")} onChange={(e) => m.setAmount(e.target.value.replace(/[^\d.,]/g, ""))} onFocus={() => m.setAmount((p) => p.replace(/,/g, ""))} onBlur={() => m.setAmount((p) => m.formatAmountInput(p))} />
                  </FormRow>
                </div>
                <div className="form-grid form-grid--mandatory-purpose">
                  <FormRow id="payment-purpose" label={m.t("payment_purpose")} required>
                    <select id="payment-purpose" value={m.paymentPurpose} onChange={(e) => m.setPaymentPurpose(e.target.value)}>{m.portalMockData.paymentPurposeOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select>
                  </FormRow>
                  {m.requiresSenderPurposeCode ? <FormRow id="sender-purpose-code" label={m.t("sender_purpose_code")}><select id="sender-purpose-code" value={m.senderPurposeCode} onChange={(e) => m.setSenderPurposeCode(e.target.value)}><option value="">{m.t("select_code")}</option>{m.portalMockData.senderPurposeCodeOptions.map((o) => <option key={o.code} value={o.code}>{o.label}</option>)}</select></FormRow> : null}
                </div>
              </div>
            </PortalCard>

            <PortalCard title={m.t("additional_information")} variant="primary">
              <div className="form-grid">
                <FormRow id="value-date" label={m.t("value_date")} required><select id="value-date" value={m.valueDate} onChange={(e) => m.setValueDate(e.target.value)}>{m.portalMockData.valueDateOptions.map((o) => (o === "Today" && m.isCutoffPassed ? null : <option key={o} value={o}>{m.valueDateLabel(o)}</option>))}</select></FormRow>
                {m.valueDate === "Custom Date" ? <FormRow id="custom-date" label={m.t("debit_value_date")}><input id="custom-date" type="date" min={m.minCustomDate} value={m.customDate} onChange={(e) => m.setCustomDate(e.target.value)} /></FormRow> : null}
                <SearchableSelect id="intermediary-bank" label={m.t("intermediary_bank")} options={m.portalMockData.intermediaryBanks} value={m.intermediaryBankId} onChange={m.setIntermediaryBankId} placeholder={m.t("select_intermediary_bank")} noDefault noSelectionLabel={m.t("no_selection")} emptyLabel={m.t("no_matching_results")} />
                <FormRow id="charges-bearer" label={m.t("charges_bearer")}><select id="charges-bearer" value={m.chargesBearerCode} onChange={(e) => m.setChargesBearerCode(e.target.value)}>{m.portalMockData.chargesBearerOptions.map((o) => <option key={o.code} value={o.code}>{o.label}</option>)}</select></FormRow>
                <FormRow id="special-deal" label={m.t("special_deal")}><input id="special-deal" type="text" value={m.specialDeal} onChange={(e) => m.setSpecialDeal(e.target.value)} /></FormRow>
                <FormRow id="beneficiary-advice" label={m.t("beneficiary_advice")}><textarea id="beneficiary-advice" rows={3} placeholder={m.t("email_help")} value={m.beneficiaryAdvice} onChange={(e) => { const emails = m.parseEmails(e.target.value); m.setAdviceError(emails.length > 5 ? m.t("email_error") : ""); m.setBeneficiaryAdvice(e.target.value); }} />{m.adviceError ? <p className="inline-error">{m.adviceError}</p> : null}</FormRow>
                <FormRow id="remarks" label={m.t("remarks")}><textarea id="remarks" rows={3} value={m.remarks} onChange={(e) => m.setRemarks(e.target.value)} placeholder={m.t("remarks_placeholder")} /></FormRow>
                <FormRow id="supporting-documents" label={m.t("upload_documents")}><input id="supporting-documents" type="file" multiple onChange={(e) => m.setSelectedFiles(Array.from(e.target.files || []).map((f) => f.name))} />{m.selectedFiles.length ? <p className="inline-note">{m.selectedFiles.join(", ")}</p> : null}</FormRow>
              </div>
            </PortalCard>

            <div className="page-actions page-actions--right"><button type="button" className="btn btn--primary" onClick={() => { if (!(m.isCutoffPassed && m.valueDate === "Today")) m.setCurrentStep(1); }}>{m.t("submit")}</button></div>
          </>
        }
        rightColumn={<div className="derived-sections derived-sections--standalone">{m.rightSections.map((s) => <DerivedSection key={s.title} title={s.title} rows={s.rows} variant={s.title === m.t("validation_status_section") ? "status" : s.title === m.t("charges_fx") ? "financial" : "default"} />)}</div>}
      />
    );
  }

  if (m.currentStep === 1) {
    return <PageContent leftColumn={<><PortalCard title={m.t("review_payment")} variant="emphasis"><div className="review-layout">{m.reviewLeftGroups.map((g) => <ReviewList key={g.title} title={g.title} items={g.items} />)}</div></PortalCard><div className="page-actions"><button type="button" className="btn btn--secondary" onClick={() => m.setCurrentStep(0)}>{m.t("back")}</button><button type="button" className="btn btn--primary" onClick={() => { m.setConfirmationReference(m.DEFAULT_CONFIRMATION_REFERENCE); m.setCurrentStep(2); }}>{m.t("confirm_submit")}</button></div></>} rightColumn={<div className="derived-sections derived-sections--standalone">{m.rightSections.map((s) => <DerivedSection key={s.title} title={s.title} rows={s.rows} variant={s.title === m.t("validation_status_section") ? "status" : s.title === m.t("charges_fx") ? "financial" : "default"} />)}</div>} />;
  }

  return (
    <section className="confirmation-page">
      <PortalCard title={m.t("payment_success")} variant="emphasis">
        <div className="confirmation-banner"><p>{m.t("your_payment_submitted")}</p><strong>{m.t("reference")}: {m.confirmationReference}</strong></div>
        <ConfirmationSummarySection title={m.t("confirmation_summary")} rows={m.confirmationSummaryPairedRows} />
        <div className="confirmation-timelines"><Timeline title={m.t("corporate_authorization_steps")} steps={m.corporateTimeline} t={m.t} /><Timeline title={m.t("bank_processing_steps")} steps={m.bankTimeline} t={m.t} /></div>
        <div className="page-actions"><button type="button" className="btn btn--secondary" onClick={m.resetFlow}>{m.t("create_another")}</button><button type="button" className="btn btn--primary" onClick={m.resetFlow}>{m.t("back_to_payments")}</button></div>
      </PortalCard>
    </section>
  );
}
