import networkAdapter from "../network";

export async function getBookingsForHost({userId, gymId, activity, date, startTime, endTime}: {userId: string, gymId: string, activity: string, date: string, startTime?: string, endTime?: string}) {
  const result = await networkAdapter.get(`/bookings/host?userId=${userId}&gymId=${gymId}&activity=${activity}&date=${date}&startTime=${startTime}&endTime=${endTime}`);
  return result.data;
}
