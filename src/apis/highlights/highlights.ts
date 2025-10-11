import networkAdapter from "../network";

export async function getHighlights(userId: string) {
  const result = await networkAdapter.get(`/highlights?user_id=${userId}`);
  return result.data;
}
