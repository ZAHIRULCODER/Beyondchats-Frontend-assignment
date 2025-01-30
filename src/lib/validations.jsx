/**
 * Checks if a value is exactly one numeric character (0-9)
 * @param {string} value - Input value to check
 * @returns {boolean} True if valid single digit, false otherwise
 * @example
 * isSingleDigit('5')  // true
 * isSingleDigit('a')  // false
 * isSingleDigit('')   // false
 * isSingleDigit('12') // fa lse
 */
export const isSingleDigit = (value) => /^\d$/.test(value);

// ------------------------------------------------------------------------------------------

/**
 * Checks if a string contains any non-digit characters
 * @param {string} value - Input string to check
 * @returns {boolean} True if contains non-digit characters, false otherwise
 * @example
 * hasNonDigits('123')    // false
 * hasNonDigits('12a')    // true
 * hasNonDigits('1.3')    // true
 * hasNonDigits('')       // false
 */
export const hasNonDigits = (value) => /\D/.test(value);

// ------------------------------------------------------------------------------------------

/**
 * Removes all non-digit characters from a string
 * @param {string} value - Input string to filter
 * @returns {string} String containing only numeric characters
 * @example
 * filterDigits('abc123!@#')      // '123'
 * filterDigits('(555) 123-4567') // '5551234567'
 * filterDigits('test')           // ''
 * filterDigits('')               // ''
 */
export const filterDigits = (value) => value.replace(/\D/g, "");
