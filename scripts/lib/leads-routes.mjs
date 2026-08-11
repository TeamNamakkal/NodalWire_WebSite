// API routes for Lead Management, delegated to from scripts/serve.mjs for
// any request whose URL starts with /api/leads. Mirrors the auth pattern
// used everywhere else in this app (requesterId resolved server-side via
// findEmployeeByUsername — client-supplied names are never trusted for
// audit fields), but scoped to approvers only (role=admin or
// isTimeApprover), since Lead Management is visible only to Surendran and
// Julius per the current requirement — not a general employee-facing tool.

import { getMailTransporter, isTimesheetApprover, findEmployeeByUsername, getRequestBody } from './shared.mjs';
import * as leadsDb from './leads-db.mjs';
import { generateLeadEmail } from './ai-provider.mjs';

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function requireApprover(req) {
  const urlObj = new URL(req.url, 'http://localhost');
  const requesterId = urlObj.searchParams.get('requesterId');
  const requester = await findEmployeeByUsername(requesterId);
  if (!isTimesheetApprover(requester)) return null;
  return requester;
}

async function sendNewLeadNotification(lead, actor) {
  const recipients = (process.env.LEAD_NOTIFICATION_EMAILS || '')
    .split(',')
    .map(e => e.trim())
    .filter(Boolean);
  if (recipients.length === 0) return { sent: false, reason: 'No LEAD_NOTIFICATION_EMAILS configured' };

  try {
    const transporter = await getMailTransporter();
    if (!transporter) return { sent: false, reason: 'SMTP not configured' };

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    await transporter.sendMail({
      from,
      to: recipients.join(','),
      subject: `New Lead Created - ${lead.lead_number} - ${lead.company_name}`,
      text: `A new lead was created by ${actor.name}.\n\nLead ID: ${lead.lead_number}\nCompany: ${lead.company_name}\nContact: ${lead.contact_name}\nOpportunity: ${lead.opportunity}\nOwner: ${lead.owner_name}\nFollow-Up Date: ${lead.next_followup_at || 'Not set'}`,
      html: `<p>A new lead was created by <strong>${actor.name}</strong>.</p><p><strong>Lead ID:</strong> ${lead.lead_number}<br><strong>Company:</strong> ${lead.company_name}<br><strong>Contact:</strong> ${lead.contact_name}<br><strong>Opportunity:</strong> ${lead.opportunity}<br><strong>Owner:</strong> ${lead.owner_name}<br><strong>Follow-Up Date:</strong> ${lead.next_followup_at || 'Not set'}</p>`
    });
    return { sent: true };
  } catch (err) {
    console.error('Lead notification email failed:', err.message);
    return { sent: false, reason: err.message };
  }
}

async function handleLeadsRoute(req, res) {
  const urlObj = new URL(req.url, 'http://localhost');
  const path = urlObj.pathname;
  const segments = path.split('/').filter(Boolean); // ['api','leads', ...]

  // --- GET /api/leads/meta (statuses/priorities/service categories) ---
  if (path === '/api/leads/meta' && req.method === 'GET') {
    const requester = await requireApprover(req);
    if (!requester) return sendJson(res, 401, { success: false, message: 'Unauthorized' }), true;
    sendJson(res, 200, {
      success: true,
      statuses: leadsDb.LEAD_STATUSES,
      priorities: leadsDb.LEAD_PRIORITIES,
      serviceCategories: leadsDb.SERVICE_CATEGORIES
    });
    return true;
  }

  // --- GET /api/leads/followups ---
  if (path === '/api/leads/followups' && req.method === 'GET') {
    const requester = await requireApprover(req);
    if (!requester) return sendJson(res, 401, { success: false, message: 'Unauthorized' }), true;
    try {
      sendJson(res, 200, { success: true, ...leadsDb.getFollowUps() });
    } catch (err) {
      sendJson(res, 500, { success: false, message: 'Failed to load follow-ups' });
    }
    return true;
  }

  // --- GET /api/leads/analytics ---
  if (path === '/api/leads/analytics' && req.method === 'GET') {
    const requester = await requireApprover(req);
    if (!requester) return sendJson(res, 401, { success: false, message: 'Unauthorized' }), true;
    try {
      sendJson(res, 200, { success: true, ...leadsDb.getAnalytics() });
    } catch (err) {
      sendJson(res, 500, { success: false, message: 'Failed to load analytics' });
    }
    return true;
  }

  // --- GET /api/leads (list) ---
  if (path === '/api/leads' && req.method === 'GET') {
    const requester = await requireApprover(req);
    if (!requester) return sendJson(res, 401, { success: false, message: 'Unauthorized' }), true;
    try {
      const leads = leadsDb.getAllLeads();
      sendJson(res, 200, { success: true, leads });
    } catch (err) {
      sendJson(res, 500, { success: false, message: 'Failed to load leads' });
    }
    return true;
  }

  // --- POST /api/leads (create) ---
  if (path === '/api/leads' && req.method === 'POST') {
    try {
      const body = await getRequestBody(req);
      const requester = await findEmployeeByUsername(body.requesterId);
      if (!isTimesheetApprover(requester)) return sendJson(res, 401, { success: false, message: 'Unauthorized' }), true;

      if (!body.companyName || !body.contactName || !body.opportunity) {
        sendJson(res, 400, { success: false, message: 'Company Name, Contact Person, and Opportunity are required.' });
        return true;
      }

      const actor = { id: requester.username, name: requester.fullName };
      // Owner defaults to the creator but can be reassigned — a legitimate
      // business field, distinct from the server-trusted audit actor above.
      const owner = body.ownerId
        ? { id: body.ownerId, name: body.ownerName || body.ownerId }
        : actor;

      const lead = leadsDb.createLead(
        {
          companyName: body.companyName,
          companyWebsite: body.companyWebsite,
          companyLinkedin: body.companyLinkedin,
          contactName: body.contactName,
          contactRole: body.contactRole,
          contactEmail: body.contactEmail,
          contactPhone: body.contactPhone,
          contactLinkedin: body.contactLinkedin,
          opportunity: body.opportunity,
          serviceCategory: body.serviceCategory,
          endCustomer: body.endCustomer,
          location: body.location,
          priority: body.priority || 'Normal',
          nextFollowupAt: body.nextFollowupAt,
          initialNotes: body.initialNotes
        },
        actor,
        owner
      );

      const notification = await sendNewLeadNotification(lead, actor);

      sendJson(res, 200, { success: true, lead, notification });
    } catch (err) {
      console.error('Lead creation failed:', err);
      sendJson(res, 500, { success: false, message: 'Failed to create lead' });
    }
    return true;
  }

  // --- Routes with a lead number in the path: /api/leads/:leadNumber[/action] ---
  if (segments[1] === 'leads' && segments[2] && !['meta', 'followups', 'analytics'].includes(segments[2])) {
    const leadNumber = decodeURIComponent(segments[2]);
    const action = segments[3];

    // GET /api/leads/:leadNumber — lead detail + activity timeline
    if (!action && req.method === 'GET') {
      const requester = await requireApprover(req);
      if (!requester) return sendJson(res, 401, { success: false, message: 'Unauthorized' }), true;
      try {
        const lead = leadsDb.getLeadByNumber(leadNumber);
        if (!lead) return sendJson(res, 404, { success: false, message: 'Lead not found' }), true;
        const activities = leadsDb.getActivities(lead.id);
        sendJson(res, 200, { success: true, lead, activities });
      } catch (err) {
        sendJson(res, 500, { success: false, message: 'Failed to load lead' });
      }
      return true;
    }

    // PUT /api/leads/:leadNumber — edit lead fields
    if (!action && req.method === 'PUT') {
      try {
        const body = await getRequestBody(req);
        const requester = await findEmployeeByUsername(body.requesterId);
        if (!isTimesheetApprover(requester)) return sendJson(res, 401, { success: false, message: 'Unauthorized' }), true;

        const actor = { id: requester.username, name: requester.fullName };
        const result = leadsDb.updateLeadFields(leadNumber, body, actor);
        if (!result) return sendJson(res, 404, { success: false, message: 'Lead not found' }), true;

        for (const diff of result.diffs) {
          leadsDb.addActivity(result.lead.id, 'lead_edited', {
            note: `${diff.field} updated`,
            oldValue: diff.oldValue,
            newValue: diff.newValue
          }, actor);
        }

        sendJson(res, 200, { success: true, lead: result.lead });
      } catch (err) {
        sendJson(res, 500, { success: false, message: 'Failed to update lead' });
      }
      return true;
    }

    // POST /api/leads/:leadNumber/update — status/follow-up/note, bundled but
    // recorded as separate immutable activity entries each.
    if (action === 'update' && req.method === 'POST') {
      try {
        const body = await getRequestBody(req);
        const requester = await findEmployeeByUsername(body.requesterId);
        if (!isTimesheetApprover(requester)) return sendJson(res, 401, { success: false, message: 'Unauthorized' }), true;

        const actor = { id: requester.username, name: requester.fullName };
        let lead = leadsDb.getLeadByNumber(leadNumber);
        if (!lead) return sendJson(res, 404, { success: false, message: 'Lead not found' }), true;

        if (body.status && body.status !== lead.status) {
          lead = leadsDb.updateStatus(leadNumber, body.status, actor);
        }
        if ('nextFollowupAt' in body && body.nextFollowupAt !== lead.next_followup_at) {
          lead = leadsDb.updateFollowup(leadNumber, body.nextFollowupAt, actor);
        }
        if (body.note && body.note.trim()) {
          lead = leadsDb.addNote(leadNumber, body.note.trim(), actor);
        }

        sendJson(res, 200, { success: true, lead });
      } catch (err) {
        sendJson(res, 500, { success: false, message: 'Failed to save update' });
      }
      return true;
    }

    // POST /api/leads/:leadNumber/ai/:draftType — AI draft (architecture only in V1)
    if (action === 'ai' && req.method === 'POST') {
      try {
        const body = await getRequestBody(req);
        const requester = await findEmployeeByUsername(body.requesterId);
        if (!isTimesheetApprover(requester)) return sendJson(res, 401, { success: false, message: 'Unauthorized' }), true;

        const draftType = segments[4]; // 'introduction' | 'followup'
        const lead = leadsDb.getLeadByNumber(leadNumber);
        if (!lead) return sendJson(res, 404, { success: false, message: 'Lead not found' }), true;

        const activities = leadsDb.getActivities(lead.id);
        const result = await generateLeadEmail(draftType, { lead, activities });

        if (result.configured && !result.error) {
          const actor = { id: requester.username, name: requester.fullName };
          leadsDb.addActivity(lead.id, 'ai_draft_generated', { note: `Draft type: ${draftType}` }, actor);
        }

        sendJson(res, 200, { success: true, ...result });
      } catch (err) {
        sendJson(res, 500, { success: false, message: 'AI service unavailable' });
      }
      return true;
    }

    // POST /api/leads/:leadNumber/email-sent — future "Mark as Sent" action
    if (action === 'email-sent' && req.method === 'POST') {
      try {
        const body = await getRequestBody(req);
        const requester = await findEmployeeByUsername(body.requesterId);
        if (!isTimesheetApprover(requester)) return sendJson(res, 401, { success: false, message: 'Unauthorized' }), true;

        const lead = leadsDb.getLeadByNumber(leadNumber);
        if (!lead) return sendJson(res, 404, { success: false, message: 'Lead not found' }), true;

        const actor = { id: requester.username, name: requester.fullName };
        leadsDb.addActivity(lead.id, 'email_marked_sent', { note: body.summary || null }, actor);
        sendJson(res, 200, { success: true });
      } catch (err) {
        sendJson(res, 500, { success: false, message: 'Failed to record sent email' });
      }
      return true;
    }
  }

  sendJson(res, 404, { success: false, message: 'Lead route not found' });
  return true;
}

export { handleLeadsRoute };
