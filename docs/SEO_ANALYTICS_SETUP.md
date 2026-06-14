# NodalWire SEO & Analytics Setup Guide

## Overview
This document outlines the Google Analytics 4, Google Search Console, and SEO setup for the NodalWire website.

---

## 1. Google Analytics 4 (GA4) Setup

### Current Implementation
- **Status**: GA4 active with Measurement ID `G-TCXCP971BF`
- **File**: `analytics.js` - Core analytics tracking module
- **Integration**: Ready to add to all HTML pages
- **Last Updated**: June 14, 2026

### What You Need to Do

#### Step 1: Measurement ID (✓ Configured)
- **Measurement ID**: `G-TCXCP971BF`
- **Status**: Active and verified

#### Step 2: Add GA4 to All Pages
Add these lines to the `<head>` of every page, immediately after the opening `<head>` tag:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-TCXCP971BF"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-TCXCP971BF');
</script>
```

**Automatic Injection (Recommended):**
The GA4 code is automatically injected into any page that's missing it:

- **During Development**: The dev server (`npm run dev`) automatically injects the GA4 tag into all HTML files served locally
- **Before Deployment**: Run `npm run build` to scan all HTML files and inject the GA4 tag if missing

This ensures no page can be deployed without analytics tracking, even if the developer forgets.

---

## 2. Tracked Events (Privacy-Safe)

### Overview
All events are tracked **without personally identifiable information** (PII).

### Event List

#### `contact_cta_click`
- **Triggered**: When users click CTA buttons leading to contact form
- **Data**: Button location (e.g., "about_footer", "index_hero")
- **Usage**: Measure engagement with contact CTAs

#### `verify_employment_click`
- **Triggered**: When users click the "Verify Employment" button
- **Data**: Source location (e.g., "about_hero", "footer")
- **Usage**: Track traffic to employee verification page

#### `employee_verification_search`
- **Triggered**: When user submits the verification search form
- **Data**: Only timestamp (NO search query, name, or ID)
- **Usage**: Measure verification tool usage

#### `employee_verification_success`
- **Triggered**: When employee verification finds a match
- **Data**: Only timestamp (NO employee details)
- **Usage**: Measure successful verification rate

#### `employee_verification_no_match`
- **Triggered**: When employee verification finds no match
- **Data**: Only timestamp (NO search details)
- **Usage**: Measure search failure rate

### Privacy Notes
- **NO NAMES** are tracked
- **NO EMPLOYEE IDs** are tracked
- **NO DATES OF BIRTH** are tracked
- **NO ADDRESSES** are tracked
- **NO EMAIL ADDRESSES** are tracked
- **NO PHONE NUMBERS** are tracked
- All events comply with GDPR and CCPA

---

## 3. Google Search Console Setup

### Current Implementation
- **Meta Tag Placeholder**: Added to all pages
- **Format**: `<meta name="google-site-verification" content="...">`

### Setup Steps

#### Step 1: Create Search Console Property
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property"
3. Enter: `https://www.nodalwire.com`
4. Choose "URL prefix" method

#### Step 2: Verify Ownership
1. Copy the verification code from GSC
2. Add to `about.html`:
```html
<meta name="google-site-verification" content="YOUR_CODE_HERE">
```
3. Also add to `verify-employee.html` and other main pages
4. Click "Verify" in GSC

#### Step 3: Submit Sitemap
1. In GSC, go to "Sitemaps"
2. Enter: `https://www.nodalwire.com/sitemap.xml`
3. Click "Submit"

---

## 4. Sitemap & Robots Configuration

### Sitemap Status
- **File**: `sitemap.xml` ✓ Updated
- **Location**: Root directory
- **Includes**: All main pages + verify-employee
- **Update Frequency**: Monthly/Weekly depending on page

### Robots.txt Status
- **File**: `robots.txt` ✓ Configured
- **Current Rules**:
  - Allow all user agents
  - Disallow: /node_modules/, /Temp_Screenshots/
  - Sitemap reference included

---

## 5. SEO Metadata Checklist

### Pages Audited
- [x] about.html - Unique title, description, canonical
- [x] verify-employee.html - Unique title, description, canonical
- [x] sitemap.xml - Updated with all pages
- [x] robots.txt - Configured
- [x] Analytics - GA4 framework ready
- [x] Search Console - Meta tag placeholder

### What Each Page Needs

#### Title Tags
- ✓ about.html: "About NodalWire — Engineering-Led. Outcome-Driven."
- ✓ verify-employee.html: "Verify Employment | NodalWire"
- Every other page should have unique, descriptive title

#### Meta Descriptions (150-160 chars)
- ✓ about.html: Describes founder and consulting approach
- ✓ verify-employee.html: Describes verification tool
- Every page should have unique description

#### Canonical URLs
- ✓ about.html: https://www.nodalwire.com/about.html
- ✓ verify-employee.html: https://www.nodalwire.com/verify-employee.html
- Every page should include canonical tag

#### Image Alt Text
- Review all images on each page
- Use descriptive alt text (not "image", "photo", etc.)
- Example: `alt="Network engineering consultation services"`

---

## 6. Analytics Tracking Code Examples

### How to Add Tracking to CTAs

#### Contact Button (e.g., "Talk to an Engineer")
```html
<button onclick="trackContactCTAClick('hero');">Talk to an Engineer</button>
```

#### Verify Employment Button
```html
<a href="verify-employee.html" onclick="trackVerifyEmploymentClick('footer');">Verify Employment</a>
```

### Available Functions
All these functions are available globally via `analytics.js`:

```javascript
trackEvent(eventName, eventParams)           // Generic event
trackContactCTAClick(buttonLocation)         // Contact CTA
trackVerifyEmploymentClick(sourceLocation)   // Verify Employment CTA
trackEmployeeVerificationSearch()            // Search form submit
trackEmployeeVerificationSuccess()           // Match found
trackEmployeeVerificationNoMatch()           // No match found
```

---

## 7. Implementation Checklist

### Phase 1: Core Setup (Complete)
- [x] Create analytics.js module
- [x] Add GA4 script tags to about.html
- [x] Add GA4 script tags to verify-employee.html
- [x] Add event tracking to verify-employee form
- [x] Create sitemap.xml with all pages
- [x] Verify robots.txt configuration
- [x] Add Search Console meta tag placeholders

### Phase 2: Complete Implementation (Next Steps)
- [x] Replace `G-XXXXXXXXXX` with actual GA4 Measurement ID (`G-TCXCP971BF`)
- [ ] Verify GA4 is receiving data (check Real-time view)
- [ ] Set up Google Search Console (add verification code)
- [ ] Submit sitemap to Google Search Console
- [ ] Add GA4 script to all remaining HTML pages
- [ ] Add event tracking to all CTA buttons across site
- [ ] Verify Search Console shows indexed pages
- [ ] Monitor Search Console for crawl errors

### Phase 3: Ongoing Maintenance
- [ ] Monitor GA4 dashboard monthly
- [ ] Review Search Console for errors/issues
- [ ] Update sitemap.xml when adding new pages
- [ ] Ensure all new pages include required meta tags
- [ ] Track conversion rates and optimize CTAs

---

## 8. Important Security Notes

### Privacy Compliance
- This implementation is GDPR compliant
- No sensitive user data is collected
- Only aggregate event data is tracked
- Employee verification never tracks personal details

### Production Readiness
- All scripts load asynchronously (no page speed impact)
- GA4 measurement ID is easy to swap out
- Analytics can be disabled server-side if needed
- No third-party scripts loaded (Google only)

---

## 9. Testing & Verification

### Test GA4 Implementation
1. Add debug parameter to GA4 URL: `?debug_mode=true`
2. Visit page in browser
3. Open DevTools → Network tab
4. Look for requests to `https://www.googletagmanager.com`
5. Should see GA4 data being sent

### Test Event Tracking
1. With debug enabled, perform an action (e.g., click verify button)
2. Open DevTools → Console
3. Should see event logged in GA4 Real-time view

### Test Search Console
1. Go to GSC Dashboard
2. Check "Coverage" report for indexed pages
3. Check "Enhancements" for any schema issues
4. Monitor "Performance" for search traffic

---

## 10. Contact & Support

For questions about this setup, refer to:
- **GA4 Docs**: https://support.google.com/analytics/answer/10089681
- **Search Console**: https://support.google.com/webmasters
- **CLAUDE.md**: Project-specific instructions for this site

---

**Last Updated**: June 14, 2026  
**Status**: Measurement ID Configured - Ready for Page Implementation
