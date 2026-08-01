import "./LoadingSkeleton.css";

function LoadingSkeleton({ count = 2 }) {
  return (
    <div className="loading-skeleton" aria-label="Loading">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="loading-skeleton__card">
          <div className="loading-skeleton__media" />
          <div className="loading-skeleton__row" />
          <div className="loading-skeleton__row loading-skeleton__row--short" />
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
