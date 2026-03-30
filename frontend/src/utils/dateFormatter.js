/**
 * Utility functions for timezone-aware date formatting
 */

/**
 * Parse and validate ISO timestamp string
 * Ensures it's treated as UTC
 * @param {string} timestamp - ISO timestamp string
 * @returns {Date} - Parsed date object
 */
function parseUTCTimestamp(timestamp) {
  // Ensure the timestamp has Z suffix (UTC indicator)
  let isoString = timestamp;
  if (!isoString.endsWith('Z') && !isoString.includes('+') && !isoString.includes('T')) {
    // If it's not already in ISO format, try to parse it
    return new Date(timestamp);
  }
  if (!isoString.endsWith('Z') && !isoString.includes('+')) {
    isoString = isoString + 'Z';
  }
  return new Date(isoString);
}

/**
 * Format a timestamp to local timezone with full details
 * @param {string} timestamp - ISO timestamp string
 * @returns {object} - Object with date, time, and timezone info
 */
export function formatTimestampWithTimezone(timestamp) {
  const date = parseUTCTimestamp(timestamp);
  
  // Get user's timezone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Format date and time with timezone
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: timeZone
  });
  
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: timeZone
  });
  
  return {
    date: dateFormatter.format(date),
    time: timeFormatter.format(date),
    timezone: timeZone,
    fullDateTime: `${dateFormatter.format(date)} at ${timeFormatter.format(date)} (${timeZone})`
  };
}

/**
 * Format just the date in user's timezone
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} - Formatted date
 */
export function formatDate(timestamp) {
  const date = parseUTCTimestamp(timestamp);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: timeZone
  });
  
  return formatter.format(date);
}

/**
 * Format just the time in user's timezone
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} - Formatted time
 */
export function formatTime(timestamp) {
  const date = parseUTCTimestamp(timestamp);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: timeZone
  });
  
  return formatter.format(date);
}

/**
 * Get user's timezone name
 * @returns {string} - Timezone name (e.g., 'America/New_York')
 */
export function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
