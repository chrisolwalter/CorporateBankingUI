export function StepTracker({ steps, currentStep, progress = 0 }) {
  const clampedProgress = Math.max(0, Math.min(progress, 1));

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
            {index < steps.length - 1 ? (
              <span className="step-tracker__line" aria-hidden="true">
                {index === currentStep ? <span className="step-tracker__line-progress" style={{ width: `${clampedProgress * 100}%` }} /> : null}
              </span>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}
