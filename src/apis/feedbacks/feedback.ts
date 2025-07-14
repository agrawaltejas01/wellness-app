import networkAdapter from "../network";

export async function getPendingFeedbacks(userId: string) {
  const result = await networkAdapter.get(`/feedback/pending?user_id=${userId}`);
  return result.data;
}

export async function getFeedbackReasons(activity: string) {
  const result = await networkAdapter.get(`/feedback/reasons?activity=${activity}`);
  return result.data;
}

export async function submitFeedback({userId, batchId, feedbackId, rating, reasons, otherReason, status}: {userId: string, batchId: string, feedbackId: string, rating: number, reasons: string[], otherReason: string, status: string}) {
  const result = await networkAdapter.post(`/feedback/submit`, {
    user_id: userId,
    feedback_id: feedbackId,
    batch_id: batchId,
    rating: rating,
    reason_ids: reasons,
    comment: otherReason,
    status: status
  });
  return result.data;
}