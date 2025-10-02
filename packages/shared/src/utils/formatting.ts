/**
 * Text and number formatting utility functions
 */

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalize the first letter of each word
 */
export function capitalizeWords(str: string): string {
  if (!str) return str;
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * Truncate text to a specified length
 */
export function truncate(str: string, length: number, suffix = "..."): string {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + suffix;
}

/**
 * Convert string to slug format
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  decimals = 1,
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Format duration in human readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? "" : "s"}`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"}`;
}

/**
 * Format weight with unit
 */
export function formatWeight(
  weight: number,
  unit: "kg" | "lbs" = "kg"
): string {
  const formatted = weight.toFixed(1);
  return `${formatted} ${unit}`;
}

/**
 * Format age in human readable format
 */
export function formatAge(years: number, months: number, days: number): string {
  if (years > 0) {
    return `${years} year${years === 1 ? "" : "s"}, ${months} month${months === 1 ? "" : "s"}`;
  }

  if (months > 0) {
    return `${months} month${months === 1 ? "" : "s"}, ${days} day${days === 1 ? "" : "s"}`;
  }

  return `${days} day${days === 1 ? "" : "s"}`;
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  if (cleaned.length === 11 && cleaned[0] === "1") {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
}

/**
 * Mask sensitive information
 */
export function maskSensitive(str: string, visibleChars = 4): string {
  if (!str || str.length <= visibleChars) return str;

  const visible = str.slice(-visibleChars);
  const masked = "*".repeat(str.length - visibleChars);

  return masked + visible;
}
