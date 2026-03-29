const statusLabelMap = {
  complete: "Complete",
  pending: "Pending",
  passed: "Passed",
  warning: "Warning"
};

export function StatusPill({ status }) {
  const tone = status?.toLowerCase() || "pending";
  return (
    <span className={`status-pill status-pill--${tone}`}>
      {statusLabelMap[tone] || tone}
    </span>
  );
}
