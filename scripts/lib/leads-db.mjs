// SQLite data-access layer for Lead Management, using Node's built-in
// node:sqlite (available without any new npm dependency on Node 22.5+).
//
// All Lead Management queries go through this file. If this ever needs to
// migrate to Postgres or another database, only this file should need to
// change — callers (leads-routes.mjs) never touch SQL directly.

import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('../..', import.meta.url));
const DB_PATH = join(__dirname, 'data/leads.db');

const dataDir = dirname(DB_PATH);
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_number TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    company_website TEXT,
    company_linkedin TEXT,
    contact_name TEXT NOT NULL,
    contact_role TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    contact_linkedin TEXT,
    opportunity TEXT NOT NULL,
    service_category TEXT,
    end_customer TEXT,
    location TEXT,
    priority TEXT NOT NULL DEFAULT 'Normal',
    status TEXT NOT NULL DEFAULT 'Initiated',
    owner_id TEXT,
    owner_name TEXT,
    next_followup_at TEXT,
    created_at TEXT NOT NULL,
    created_by TEXT,
    updated_at TEXT NOT NULL,
    updated_by TEXT,
    is_archived INTEGER NOT NULL DEFAULT 0
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS lead_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL REFERENCES leads(id),
    activity_type TEXT NOT NULL,
    note TEXT,
    old_value TEXT,
    new_value TEXT,
    created_at TEXT NOT NULL,
    created_by TEXT
  );
`);

db.exec('CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);');
db.exec('CREATE INDEX IF NOT EXISTS idx_leads_next_followup ON leads(next_followup_at);');

// --- Statuses & service categories (centralized, not hardcoded per-component) ---
const LEAD_STATUSES = ['Initiated', 'Contacted', 'Discussion', 'Proposal', 'Negotiation', 'Won', 'Lost', 'On Hold'];
const LEAD_PRIORITIES = ['Low', 'Normal', 'High', 'Critical'];
const SERVICE_CATEGORIES = [
  'Optical Networks',
  'FTTH / PON',
  'Wi-Fi',
  'Microwave',
  'Remote Property Connectivity',
  'Data Center / Networking',
  'Private Networks',
  'Engineering Labs',
  'GIS / Network Planning',
  'Other'
];

function nowISO() {
  return new Date().toISOString();
}

function rowToLead(row) {
  if (!row) return null;
  return { ...row, is_archived: !!row.is_archived };
}

function generateLeadNumber() {
  const row = db.prepare(`SELECT lead_number FROM leads ORDER BY id DESC LIMIT 1`).get();
  let next = 1;
  if (row && row.lead_number) {
    const match = /NW-LD-(\d+)/.exec(row.lead_number);
    if (match) next = parseInt(match[1], 10) + 1;
  }
  return `NW-LD-${String(next).padStart(4, '0')}`;
}

function createLead(data, createdBy, owner) {
  const leadNumber = generateLeadNumber();
  const now = nowISO();
  const stmt = db.prepare(`
    INSERT INTO leads (
      lead_number, company_name, company_website, company_linkedin,
      contact_name, contact_role, contact_email, contact_phone, contact_linkedin,
      opportunity, service_category, end_customer, location, priority, status,
      owner_id, owner_name, next_followup_at,
      created_at, created_by, updated_at, updated_by, is_archived
    ) VALUES (
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, 'Initiated',
      ?, ?, ?,
      ?, ?, ?, ?, 0
    )
  `);
  stmt.run(
    leadNumber, data.companyName, data.companyWebsite || null, data.companyLinkedin || null,
    data.contactName, data.contactRole || null, data.contactEmail || null, data.contactPhone || null, data.contactLinkedin || null,
    data.opportunity, data.serviceCategory || null, data.endCustomer || null, data.location || null, data.priority || 'Normal',
    (owner || createdBy).id, (owner || createdBy).name, data.nextFollowupAt || null,
    now, createdBy.id, now, createdBy.id
  );

  const lead = getLeadByNumber(leadNumber);
  addActivity(lead.id, 'lead_created', { note: data.initialNotes || null }, createdBy);
  return lead;
}

function getLeadByNumber(leadNumber) {
  const row = db.prepare('SELECT * FROM leads WHERE lead_number = ?').get(leadNumber);
  return rowToLead(row);
}

function getLeadById(id) {
  const row = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
  return rowToLead(row);
}

function getAllLeads({ archived = false } = {}) {
  const rows = db.prepare('SELECT * FROM leads WHERE is_archived = ? ORDER BY updated_at DESC').all(archived ? 1 : 0);
  return rows.map(rowToLead);
}

const LEAD_FIELD_MAP = {
  companyName: 'company_name',
  companyWebsite: 'company_website',
  companyLinkedin: 'company_linkedin',
  contactName: 'contact_name',
  contactRole: 'contact_role',
  contactEmail: 'contact_email',
  contactPhone: 'contact_phone',
  contactLinkedin: 'contact_linkedin',
  opportunity: 'opportunity',
  serviceCategory: 'service_category',
  endCustomer: 'end_customer',
  location: 'location',
  priority: 'priority'
};

// Updates lead fields (excluding status/follow-up, which go through their own
// functions so every change is guaranteed an activity record) and returns the
// list of {field, oldValue, newValue} changes actually made, for the caller
// to log as activities.
function updateLeadFields(leadNumber, changes, updatedBy) {
  const lead = getLeadByNumber(leadNumber);
  if (!lead) return null;

  const diffs = [];
  const setClauses = [];
  const params = [];

  for (const [key, column] of Object.entries(LEAD_FIELD_MAP)) {
    if (!(key in changes)) continue;
    const newValue = changes[key] || null;
    const oldValue = lead[column];
    if (newValue !== oldValue) {
      diffs.push({ field: key, oldValue, newValue });
      setClauses.push(`${column} = ?`);
      params.push(newValue);
    }
  }

  if (setClauses.length === 0) return { lead, diffs: [] };

  setClauses.push('updated_at = ?', 'updated_by = ?');
  params.push(nowISO(), updatedBy.id, lead.id);

  db.prepare(`UPDATE leads SET ${setClauses.join(', ')} WHERE id = ?`).run(...params);
  return { lead: getLeadById(lead.id), diffs };
}

function updateStatus(leadNumber, newStatus, updatedBy) {
  const lead = getLeadByNumber(leadNumber);
  if (!lead) return null;
  if (!LEAD_STATUSES.includes(newStatus)) throw new Error('Invalid status');
  if (newStatus === lead.status) return lead;

  db.prepare('UPDATE leads SET status = ?, updated_at = ?, updated_by = ? WHERE id = ?')
    .run(newStatus, nowISO(), updatedBy.id, lead.id);

  addActivity(lead.id, 'status_changed', { oldValue: lead.status, newValue: newStatus }, updatedBy);
  return getLeadById(lead.id);
}

function updateFollowup(leadNumber, nextFollowupAt, updatedBy) {
  const lead = getLeadByNumber(leadNumber);
  if (!lead) return null;
  if (nextFollowupAt === lead.next_followup_at) return lead;

  db.prepare('UPDATE leads SET next_followup_at = ?, updated_at = ?, updated_by = ? WHERE id = ?')
    .run(nextFollowupAt || null, nowISO(), updatedBy.id, lead.id);

  addActivity(lead.id, 'followup_changed', { oldValue: lead.next_followup_at, newValue: nextFollowupAt }, updatedBy);
  return getLeadById(lead.id);
}

function addNote(leadNumber, note, updatedBy) {
  const lead = getLeadByNumber(leadNumber);
  if (!lead) return null;
  db.prepare('UPDATE leads SET updated_at = ?, updated_by = ? WHERE id = ?')
    .run(nowISO(), updatedBy.id, lead.id);
  addActivity(lead.id, 'note_added', { note }, updatedBy);
  return getLeadById(lead.id);
}

function addActivity(leadId, activityType, { note = null, oldValue = null, newValue = null } = {}, user) {
  const stmt = db.prepare(`
    INSERT INTO lead_activities (lead_id, activity_type, note, old_value, new_value, created_at, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(leadId, activityType, note, oldValue, newValue, nowISO(), user.id);
}

function getActivities(leadId) {
  return db.prepare('SELECT * FROM lead_activities WHERE lead_id = ? ORDER BY created_at DESC, id DESC').all(leadId);
}

// --- Follow-ups: overdue / due today / upcoming, based on next_followup_at ---
function getFollowUps() {
  const todayStr = new Date().toISOString().split('T')[0];
  const leads = db.prepare(`
    SELECT * FROM leads
    WHERE is_archived = 0
      AND next_followup_at IS NOT NULL
      AND next_followup_at != ''
      AND status NOT IN ('Won', 'Lost')
    ORDER BY next_followup_at ASC
  `).all().map(rowToLead);

  const overdue = [];
  const dueToday = [];
  const upcoming = [];

  for (const lead of leads) {
    const followupDate = lead.next_followup_at.split('T')[0];
    if (followupDate < todayStr) overdue.push(lead);
    else if (followupDate === todayStr) dueToday.push(lead);
    else upcoming.push(lead);
  }

  return { overdue, dueToday, upcoming };
}

// --- Analytics ---
function getAnalytics() {
  const byStatusRows = db.prepare(`
    SELECT status, COUNT(*) as count FROM leads WHERE is_archived = 0 GROUP BY status
  `).all();

  const byMonthRows = db.prepare(`
    SELECT substr(created_at, 1, 7) as month, COUNT(*) as count
    FROM leads WHERE is_archived = 0
    GROUP BY month ORDER BY month ASC
  `).all();

  const byServiceRows = db.prepare(`
    SELECT COALESCE(service_category, 'Other') as service, COUNT(*) as count
    FROM leads WHERE is_archived = 0
    GROUP BY service ORDER BY count DESC
  `).all();

  return { byStatus: byStatusRows, byMonth: byMonthRows, byService: byServiceRows };
}

export {
  LEAD_STATUSES,
  LEAD_PRIORITIES,
  SERVICE_CATEGORIES,
  createLead,
  getLeadByNumber,
  getLeadById,
  getAllLeads,
  updateLeadFields,
  updateStatus,
  updateFollowup,
  addNote,
  addActivity,
  getActivities,
  getFollowUps,
  getAnalytics
};
