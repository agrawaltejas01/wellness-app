import networkAdapter from "../network";

export async function getAllActivities() {
  const result = await networkAdapter.get("/activities/all");
  return result.data;
}

export async function getGymsByActivity(activity?: string) {
  activity = activity || "all";

  let url = `/gyms/byActivity?activity=${activity}`;
  const result = await networkAdapter.get(url);
  return result.data;
}

export async function getExclusiveGyms() {
  let url = `/gyms/exclusive`;
  const result = await networkAdapter.get(url);
  return result.data;
}

export async function getGymById(id: string) {
  const result = await networkAdapter.get(`/gyms/?id=${id}`);
  return result.data;
}

export async function getActivityById({id, userId}: {id: string, userId: string }) {
  const result = await networkAdapter.get(`gyms/batch/byBatchId?batchId=${id}&userId=${userId}`);
  return result.data;
}

/**
 * Gets batch details with game level information
 * @param id - The batch ID
 * @returns The batch details with game level information
 */
export async function getBatchWithGameLevel(id: string) {
  const result = await networkAdapter.get(`gyms/batch/${id}/withGameLevel`);
  return result.data;
}

export async function getPastAppBookings(id: string){
  const result = await networkAdapter.get(`bookings/pastAppBookings?id=${id}`);
  return result.data;
}

export async function getCoplayers(id: string){
  const result = await networkAdapter.get(`users/batch-coplayers?batchId=${id}`);
  return result.data;
}
