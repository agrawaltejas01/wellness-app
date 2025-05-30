import networkAdapter from "../network";

export async function cancelBooking({bookingId, reason}: {bookingId: string, reason: string}) {
  const result = await networkAdapter.post(`/cancel`, {
    bookingId,
    reason,
  });
  return result.data;
}
