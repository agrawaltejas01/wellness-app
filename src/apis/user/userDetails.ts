import networkAdapter from "../network";

export async function getUserDeatils() {
  const result = await networkAdapter.get(`/users`);
  return result.data;
}

export async function getUserSkillLevel({userId, batchId}: {userId: number, batchId: number}) {
  const result = await networkAdapter.get(`/users/skill-level?userId=${userId}&batchId=${batchId}`);
  return result.data;
}

export async function updateUserSkillLevel({userId, activityId, skillLevel}: {userId: number, activityId: number, skillLevel: string}) {
  const result = await networkAdapter.post(`/api/v1/skill-level/upsert`, {userId, activityId, skillLevel});
  return result.data;
}
