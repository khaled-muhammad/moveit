const Logo = ({ className = "" }) => {
  return (
    <h1 className={`goldman-regular logo-animate-container ${className}`}>
      <span className="logo-animate-text">MoveIt</span>
    </h1>
  );
};

export default Logo;