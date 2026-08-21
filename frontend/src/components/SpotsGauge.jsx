import "../styles/spots-gauge.css";

export default function SpotsGauge({ registeredCount, capacity }) {
  const safeCapacity = capacity > 0 ? capacity : 1;
  const ratio = Math.min(registeredCount / safeCapacity, 1);
  const percent = Math.round(ratio * 100);

  let state = "spots-gauge-open";
  if (ratio >= 1) {
    state = "spots-gauge-full";
  } else if (ratio >= 0.7) {
    state = "spots-gauge-almost";
  }

  return (
    <div className="spots-gauge">
      <div className="spots-gauge-track">
        <div className={`spots-gauge-fill ${state}`} style={{ width: `${percent}%` }} />
      </div>
      <span className={`spots-gauge-label ${state}`}>{registeredCount}/{capacity}</span>
    </div>
  );
}