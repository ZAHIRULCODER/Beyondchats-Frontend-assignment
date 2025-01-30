import { useRef, useState } from "react";
import { isSingleDigit, hasNonDigits, filterDigits } from "../lib/validations";

/**
 * Verification code input component with digit-only validation and auto-focus management
 * @param {Object} props - Component properties
 * @param {number} [props.length=6] - Number of input fields to display
 * @param {Function} [props.onChange] - Callback triggered on code change
 */
export default function VerificationCode({ length = 6, onChange }) {
  // Array state tracking individual digit values
  const [code, setCode] = useState(Array(length).fill(""));

  // Refs array for managing focus between input fields
  const inputRefs = useRef([]);

  /**
   * Handles individual input changes with validation
   * @param {number} index - Index of the input field
   * @param {string} value - New input value
   */
  const handleChange = (index, value) => {
    // Reject invalid inputs (non-digits or multi-character values)
    if (!isSingleDigit(value) && value !== "") return;

    // Update code state with new value
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Notify parent component of code changes
    onChange?.(newCode.join(""));

    // Auto-focus next field when valid digit entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handles keyboard navigation and input validation
   * @param {number} index - Current input index
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = (index, e) => {
    // Handle backspace navigation
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    // Block non-digit character input
    else if (e.key.length === 1 && hasNonDigits(e.key)) {
      e.preventDefault();
    }
  };

  /**
   * Handles paste events with digit filtering
   * @param {ClipboardEvent} e - Paste event
   */
  const handlePaste = (e) => {
    e.preventDefault();
    // Extract and sanitize pasted content
    const pasted = filterDigits(e.clipboardData.getData("text"));
    const pastedData = pasted.slice(0, length);

    // Update code state with pasted digits
    const newCode = [...code];
    pastedData.split("").forEach((char, i) => {
      if (i < length) newCode[i] = char;
    });

    setCode(newCode);
    onChange?.(newCode.join(""));
  };

  return (
    <div className="flex justify-around">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric" // Shows numeric keyboard on mobile devices
          pattern="[0-9]*" // Enforces numeric pattern validation
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
