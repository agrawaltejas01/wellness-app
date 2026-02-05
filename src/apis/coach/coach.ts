import networkAdapter from "../network";

export interface CoachQueryRequest {
  user_query: string;
  user_id: string;
  n_results: number;
}

export interface CoachQueryResponse {
  response: string;
}

export async function queryCoach(payload: CoachQueryRequest) {
  const result = await networkAdapter.post("/coach/query", {
    user_query: payload.user_query,
    user_id: payload.user_id,
    n_results: payload.n_results
  });
  return result.data;
}
