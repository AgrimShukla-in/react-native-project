// src/utils/dateFormatters.js

/**
 * Formats a “member since” date as “Mon , YYYY”
 * e.g. “Jan , 2020”
 */
export function formatMemberSince(dateString) {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${month} , ${year}`;
}

/**
 * Formats a published-at date as “Mon D, YYYY”
 * e.g. “Feb 5, 2021”
 */
export function formatPublishedAt(dateString) {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' });
  const day   = date.getDate();
  const year  = date.getFullYear();
  return `${month} ${day}, ${year}`;
}
