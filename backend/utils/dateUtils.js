/**
 * Calculate age from birth date
 * @param {Date} birthDate - Original birth date
 * @returns {Number} - Current age
 */
export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // Bug fix: Adjust if birthday hasn't occurred this year yet
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Calculate years since event (for anniversaries)
 * @param {Date} eventDate - Original event date
 * @returns {Number} - Years since event
 */
export const calculateYearsSince = (eventDate) => {
  return calculateAge(eventDate);
};

/**
 * Get days until next occurrence
 * @param {Date} nextOccurrence
 * @returns {Number} - Days until event (0 if today)
 */
export const getDaysUntil = (nextOccurrence) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const next = new Date(nextOccurrence);
  next.setHours(0, 0, 0, 0);
  
  const diffTime = next - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Check if date is today
 * @param {Date} date
 * @returns {Boolean}
 */
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  
  return today.getDate() === checkDate.getDate() &&
         today.getMonth() === checkDate.getMonth() &&
         today.getFullYear() === checkDate.getFullYear();
};

/**
 * Format date for display
 * @param {Date} date
 * @returns {String} - "Nov 21, 2025"
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
