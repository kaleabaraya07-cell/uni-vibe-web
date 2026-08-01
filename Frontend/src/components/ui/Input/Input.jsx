import "./Input.css";

function Input({ label, className = "", ...props }) {
  return (
    <label className={`ui-input ${className}`.trim()}>
      {label && <span className="ui-input__label">{label}</span>}
      <input className="ui-input__field" {...props} />
    </label>
  );
}

export default Input;
