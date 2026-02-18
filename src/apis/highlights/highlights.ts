import networkAdapter from "../network";

export async function getHighlights(userId: string) {
  const result = await networkAdapter.get(`/highlights?user_id=${userId}`);
  return result.data;
}

export async function addUserHighlight(userId: string, highlightId: string) {
  const result = await networkAdapter.post(`/highlights/add-user-id`, {
    user_id: userId,
    highlight_id: highlightId
  });
  return result.data;
}

export async function requestHighlight(body: { user_id: string; batch_id: string }) {
  const result = await networkAdapter.post(`/highlights/request`, body);
  return result.data;
}