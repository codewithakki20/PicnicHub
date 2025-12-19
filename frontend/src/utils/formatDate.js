// src/utils/formatDate.js
import dayjs from "dayjs";

/**
 * Format any date into readable format.
 * @param {string|Date} date
 * @param {string} format - default "DD MMM YYYY"
 */
export default function formatDate(date, format = "DD MMM YYYY") {
  if (!date) return "";
  return dayjs(date).format(format);
}
