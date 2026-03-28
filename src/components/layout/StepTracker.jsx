export function StepTracker({ steps, currentStep }) {
  return (
    <section className="step-tracker" aria-label="payment process tracker">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div
            key={step}
            className={`step-tracker__step ${isActive ? "is-active" : ""} ${isCompleted ? "is-completed" : ""}`}
          >
            <span className="step-tracker__dot" aria-hidden="true" />
            <div className="step-tracker__text">
              <small>Step {index + 1}</small>
              <strong>{step}</strong>
            </div>
            {index < steps.length - 1 ? <span className="step-tracker__line" aria-hidden="true" /> : null}
          </div>
        );
      })}
    </section>
  );
}
