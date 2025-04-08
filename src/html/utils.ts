export function getOlSymbol(n: number, type: string): string {
  // Make sure n is a positive integer
  n = Math.max(1, Math.floor(n));

  switch (type) {
    case "decimal":
    default:
      return n.toString();

    case "decimal-leading-zero":
      return n < 10 ? `0${n}` : n.toString();

    case "lower-alpha":
    case "lower-latin":
      // a-z, then aa, ab, ac, etc.
      if (n <= 26) {
        return String.fromCharCode(96 + n);
      } else {
        const quotient = Math.floor((n - 1) / 26);
        const remainder = (n - 1) % 26;
        return (
          String.fromCharCode(96 + quotient) +
          String.fromCharCode(97 + remainder)
        );
      }

    case "upper-alpha":
    case "upper-latin":
      // A-Z, then AA, AB, AC, etc.
      if (n <= 26) {
        return String.fromCharCode(64 + n);
      } else {
        const quotient = Math.floor((n - 1) / 26);
        const remainder = (n - 1) % 26;
        return (
          String.fromCharCode(64 + quotient) +
          String.fromCharCode(65 + remainder)
        );
      }

    case "lower-roman":
      return toRoman(n).toLowerCase();

    case "upper-roman":
      return toRoman(n);
  }
}

// Helper function to convert numbers to Roman numerals
function toRoman(num: number): string {
  const romanNumerals = [
    { value: 1000, numeral: "M" },
    { value: 900, numeral: "CM" },
    { value: 500, numeral: "D" },
    { value: 400, numeral: "CD" },
    { value: 100, numeral: "C" },
    { value: 90, numeral: "XC" },
    { value: 50, numeral: "L" },
    { value: 40, numeral: "XL" },
    { value: 10, numeral: "X" },
    { value: 9, numeral: "IX" },
    { value: 5, numeral: "V" },
    { value: 4, numeral: "IV" },
    { value: 1, numeral: "I" },
  ];

  let result = "";

  for (const { value, numeral } of romanNumerals) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }

  return result;
}
export function getUlSymbol(type: string): string {
    type = type.toLowerCase();
    switch (type) {
      // Standard bullet types
      case 'disc':
        return '•'; // Solid circle bullet
      case 'circle':
        return '○'; // Open circle bullet
      case 'square':
        return '■'; // Solid square bullet
      case 'disclosure-open':
        return '▼'; // Downward triangle (open disclosure)
      case 'disclosure-closed':
        return '▶'; // Right-pointing triangle (closed disclosure)
        
      // Less common but useful bullet types  
      case 'dash':
        return '–'; // En dash
      case 'diamond':
        return '◆'; // Diamond
      case 'arrow':
        return '➤'; // Arrow
      case 'checkmark':
        return '✓'; // Checkmark
      case 'star':
        return '★'; // Star
      case 'hollow-square':
        return '□'; // Hollow square
      case 'custom-triangle':
        return '▸'; // Triangle
        
      // Default to standard bullet
      default:
        return '•';
    }
  }