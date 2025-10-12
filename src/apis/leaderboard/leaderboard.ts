import networkAdapter from "../network";

export async function getTop3Players(activityId: number) {
  const result = await networkAdapter.get(`/leaderboard/top-players?activity_id=${activityId}`);
  return result.data;
}

export async function getLeaderboard({activityId, pageSize, pageNumber}: {activityId: number, pageSize: number, pageNumber: number}) {
  const result = await networkAdapter.get(`/leaderboard/activity?activity_id=${activityId}&pageSize=${pageSize}&pageNumber=${pageNumber}`);
  return result.data;
}