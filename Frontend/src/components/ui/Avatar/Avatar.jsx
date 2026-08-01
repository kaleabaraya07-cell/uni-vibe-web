import "./Avatar.css";

function Avatar({ src, alt, size = "md", className = "" }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`ui-avatar ui-avatar--${size} ${className}`.trim()}
    />
  );
}

export default Avatar;
