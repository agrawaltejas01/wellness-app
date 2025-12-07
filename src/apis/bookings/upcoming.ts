import networkAdapter from "../network";

export async function getUpcomingBookings({userId}: {userId: string}) {
  const result = await networkAdapter.get(`/bookings/upcoming?userId=${userId}`);
  return result.data;
}
