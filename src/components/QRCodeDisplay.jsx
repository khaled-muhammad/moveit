import QRCode from "react-qr-code";

const QRCodeDisplay = ({ session, size = 300, className = "" }) => {
  if (!session) return null;
  
  return (
    <QRCode
      value={session}
      fgColor="#fff"
      bgColor="#4C319CFF"
      size={size}
      className={`rounded-md drop-shadow-2xl drop-shadow-[#7f5af0a1] cursor-none relative z-11 ${className}`}
    />
  );
};

export default QRCodeDisplay;