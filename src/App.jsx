import { AppShell } from "./components/layout/AppShell";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { StepTracker } from "./components/layout/StepTracker";
import { usePaymentFormState } from "./hooks/usePaymentFormState";
import { SinglePaymentPrototypeOne } from "./pages/SinglePaymentPrototypeOne";
import { SinglePaymentPrototypeTwo } from "./pages/SinglePaymentPrototypeTwo";
import flagGlobal from "./assets/flags/global.svg";
import flagFrance from "./assets/flags/fr.svg";
import flagIndia from "./assets/flags/in.svg";
import flagUae from "./assets/flags/ae.svg";
import flagChina from "./assets/flags/cn.svg";
import "./styles/portalLayout.css";

const COUNTRY_META = { GLOBAL: { flag: flagGlobal }, FR: { flag: flagFrance }, IN: { flag: flagIndia }, AE: { flag: flagUae }, CN: { flag: flagChina } };

export default function App() {
  const m = usePaymentFormState();
  const selectedCountryMeta = COUNTRY_META[m.countryCode] || COUNTRY_META.GLOBAL;

  return (
    <AppShell
      sidebar={
        <Sidebar
          collapsed={m.isSidebarCollapsed}
          onToggle={() => m.setIsSidebarCollapsed((v) => !v)}
          labels={{
            corporateBanking: m.t("corporate_banking"), tradingPortal: m.t("trading_portal"), expandSidebar: m.t("expand_sidebar"), collapseSidebar: m.t("collapse_sidebar"),
            primaryNavigation: m.t("primary_navigation"), payments: m.t("payments"), singlePayments: m.t("single_payments"), singlePaymentsV2: m.t("single_payments_v2")
          }}
          menuItems={[
            { id: "p1", label: m.t("single_payments") },
            { id: "p2", label: m.t("single_payments_v2") }
          ]}
          activeItem={m.prototype}
          onSelectItem={m.setPrototype}
        />
      }
      header={
        <div className="portal-top-stack">
          <Header
            portalTitle={m.t("header_title")}
            currentTime={m.headerTime}
            language={m.language}
            country={m.countryCode}
            countryFlag={selectedCountryMeta.flag}
            labels={{ currentTime: m.t("current_time"), language: m.t("language"), country: m.t("country") }}
            languages={m.selectedCountry.languages}
            countries={m.portalMockData.countries.map((c) => ({ value: c.code, label: c.label }))}
            onLanguageChange={m.setLanguage}
            onCountryChange={(nextCountryCode) => { m.setCountryCode(nextCountryCode); m.setLanguage("English"); }}
          />
          <StepTracker steps={[m.t("initiate"), m.t("review"), m.t("confirmation")]} currentStep={m.currentStep} progress={m.stepProgress} completed={m.currentStep === 2} completeLabel={m.t("complete")} stepLabelPrefix={m.t("step")} />
        </div>
      }
    >
      {m.prototype === "p1" ? <SinglePaymentPrototypeOne m={m} /> : <SinglePaymentPrototypeTwo m={m} />}
    </AppShell>
  );
}
