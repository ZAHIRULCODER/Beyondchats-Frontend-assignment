import { useRef, useState } from "react";

export default function VerificationCode({ length = 6, onChange }) {
  const [code, setCode] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (onChange) {
      onChange(newCode.join(""));
    }

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    const newCode = [...code];

    pastedData.split("").forEach((char, index) => {
      if (index < length) {
        newCode[index] = char;
      }
    });

    setCode(newCode);
    if (onChange) {
      onChange(newCode.join(""));
    }
  };

  return (
    <div className="flex justify-around">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength={1}
          value={code[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="md:size-12 size-10 text-center text-xl font-semibold rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      ))}
    </div>
  );
}
