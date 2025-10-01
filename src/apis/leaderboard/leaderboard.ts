import networkAdapter from "../network";

export async function getTop3Players(activityId: number) {
  const result = await networkAdapter.get(`/leaderboard/top-players?activity_id=${activityId}`);
  return result.data;
}