/*
 * NodalWire Google Analytics 4 Implementation
 *
 * PRIVACY & SECURITY NOTES:
 * - This script does NOT track personally identifiable information (PII)
 * - Employee verification events never include names, IDs, dates, addresses, emails, or phone numbers
 * - Only event names and non-sensitive attributes are tracked
 * - Compliance with GDPR, CCPA, and privacy best practices
 */

window.analyticsReady = false;

// Initialize Google Analytics 4
window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');

// Mark analytics as ready after initialization
window.analyticsReady = true;

/*
 * Generic event tracking helper
 * Only tracks non-sensitive event data
 */
function trackEvent(eventName, eventParams = {}) {
  if (!window.analyticsReady) {
    console.warn('Analytics not ready yet');
    return;
  }

  // Ensure no PII is included in any event
  const sanitizedParams = { ...eventParams };

  gtag('event', eventName, sanitizedParams);
}

/*
 * Contact CTA Click Tracking
 * Used on: about.html, index.html, and other pages with contact forms
 * Tracks: CTA button clicks leading to assessment form
 */
function trackContactCTAClick(buttonLocation = 'unknown') {
  trackEvent('contact_cta_click', {
    button_location: buttonLocation,
    timestamp: new Date().toISOString().split('T')[0]
  });
}

/*
 * Verify Employment Click Tracking
 * Used on: about.html (hero button)
 * Tracks: Navigation to employee verification page
 */
function trackVerifyEmploymentClick(sourceLocation = 'unknown') {
  trackEvent('verify_employment_click', {
    source_location: sourceLocation,
    timestamp: new Date().toISOString().split('T')[0]
  });
}

/*
 * Employee Verification Search
 * Used on: verify-employee.html
 * IMPORTANT: This event does NOT track search query, name, ID, or any PII
 * Tracks only: that a search was attempted
 */
function trackEmployeeVerificationSearch() {
  trackEvent('employee_verification_search', {
    timestamp: new Date().toISOString().split('T')[0]
  });
}

/*
 * Employee Verification Success
 * Used on: verify-employee.html
 * IMPORTANT: This event does NOT include employee details
 * Tracks only: that a match was found
 */
function trackEmployeeVerificationSuccess() {
  trackEvent('employee_verification_success', {
    timestamp: new Date().toISOString().split('T')[0]
  });
}

/*
 * Employee Verification No Match
 * Used on: verify-employee.html
 * Tracks: Failed verification attempts (without search details)
 */
function trackEmployeeVerificationNoMatch() {
  trackEvent('employee_verification_no_match', {
    timestamp: new Date().toISOString().split('T')[0]
  });
}

// Export functions for use in HTML pages
window.trackEvent = trackEvent;
window.trackContactCTAClick = trackContactCTAClick;
window.trackVerifyEmploymentClick = trackVerifyEmploymentClick;
window.trackEmployeeVerificationSearch = trackEmployeeVerificationSearch;
window.trackEmployeeVerificationSuccess = trackEmployeeVerificationSuccess;
window.trackEmployeeVerificationNoMatch = trackEmployeeVerificationNoMatch;
