import HelpRequest from '../models/HelpRequest.js';

export const submitHelpRequest = async ({ userId, subject, message }) => {
  if (!subject || !message) {
    const err = new Error('Subject and message are required');
    err.statusCode = 400;
    throw err;
  }
  const created = await HelpRequest.create({ user: userId, subject, message });
  return created;
};

export const listMyHelpRequests = async ({ userId }) => {
  return HelpRequest.find({ user: userId }).sort({ createdAt: -1 }).lean();
};


