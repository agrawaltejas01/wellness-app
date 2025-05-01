import networkAdapter from "../network";

export async function getGymBatchesForDate({
  id,
  date,
  activity,
}: {
  id: number;
  date: string;
  activity: string;
}) {
  const result = await networkAdapter.get(
    `/gyms/batch/?gymId=${id}&date=${date}&activity=${activity}`
  );
  return result.data;
}

export async function getGymBatchesForSchedulePage({
  id,
  isWeekendOnly,
}: {
  id: number;
  isWeekendOnly: boolean;
}) {
  const result = await networkAdapter.get(
    `/gyms/batch/schedulePage?gymId=${id}&isWeekendOnly=${isWeekendOnly}`
  );
  return result.data;
}

export async function getCoplayersForBatch({
  id,
}: {
  id: number;
}) {
  const result = await networkAdapter.get(`/gyms/batch/coplayers?batchId=${id}`);
  return result.data;
}