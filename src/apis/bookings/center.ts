import networkAdapter from "../network";

export async function getBookingsForCenter({gymId, activity, startDate, endDate, startTime, endTime}: {gymId: string, activity: string, startDate: string, endDate: string, startTime?: string, endTime?: string}) {
  const result = await networkAdapter.get(`/bookings/center?gymId=${gymId}&activity=${activity}&startDate=${startDate}&endDate=${endDate}&startTime=${startTime}&endTime=${endTime}`);
  return result.data;
}
