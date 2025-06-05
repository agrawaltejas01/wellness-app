import networkAdapter from "../network";

export async function getCoins(userId: number) {
  const result = await networkAdapter.get(`/coins/?userId=${userId}`);
  return result.data;
}

export async function getCoinsPackages() {
  const result = await networkAdapter.get(`/coins/packages`);
  return result.data;
}

export async function buyCoins(package_id: number, user_id: number) {
  const result = await networkAdapter.post(`/coins/rzp/order`, { package_id, user_id });
  return result.data;
}