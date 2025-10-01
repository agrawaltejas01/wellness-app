import networkAdapter from "../network";

export async function getRatings(userId: number) {
  const result = await networkAdapter.get(`/rating?user_id=${userId}&activity_id=1`);
  return result.data;
}