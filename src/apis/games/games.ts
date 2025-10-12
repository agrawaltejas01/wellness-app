import networkAdapter from "../network";

export async function getGamesPlayed(userId: number) {
  const result = await networkAdapter.get(`/games/played-count?user_id=${userId}&activity_id=1`);
  return result.data;
}