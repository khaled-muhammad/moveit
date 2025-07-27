import { useRef } from 'react';
import { FiUpload } from 'react-icons/fi';

export default function UploadButton({ selected }) {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length && typeof selected === 'function') {
      selected(files);
    }
    e.target.value = null;
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept="video/*,image/*,audio/*"
        style={{ display: 'none' }}
      />
      <button className="brain-boom-btn" onClick={handleClick}>
        <FiUpload /> Upload
      </button>
    </>
  );
}