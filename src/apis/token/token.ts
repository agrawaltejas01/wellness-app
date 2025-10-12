import networkAdapter from "../network";

export async function getToken(phone: string) {
  const result = await networkAdapter.get(`/token/generate?phone=${phone}`);
  return result.data;
}