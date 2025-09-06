import { submitHelpRequest as submitHelpRequestService, listMyHelpRequests as listMyHelpRequestsService } from '../services/helpService.js';

export const submitHelpRequest = async (req, res) => {
  try {
    const { subject, message } = req.body || {};
    const created = await submitHelpRequestService({ userId: req.user.id, subject, message });
    return res.status(201).json({ success: true, help: created });
  } catch (e) {
    const status = e.statusCode || 500;
    console.error('Create help request error:', e);
    return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : e.message });
  }
};

export const listMyHelpRequests = async (req, res) => {
  try {
    const items = await listMyHelpRequestsService({ userId: req.user.id });
    return res.status(200).json({ success: true, items });
  } catch (e) {
    const status = e.statusCode || 500;
    console.error('List my help requests error:', e);
    return res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : e.message });
  }
};


