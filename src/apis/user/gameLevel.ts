import networkAdapter from "../network";

interface IGameLevelInput {
  batchActivityId: number; // Required according to backend
  level: string;           // Required according to backend
}

/**
 * Creates or updates a game level for a user
 * @param gameLevel - Game level data
 * @returns The response from the server
 */
export async function upsertGameLevel(gameLevel: IGameLevelInput) {
  const result = await networkAdapter.post('/gameLevels/', gameLevel);
  return result.data;
}

/**
 * Gets all game levels for the authenticated user
 * @returns The game levels for the user
 */
export async function getUserGameLevels() {
  const result = await networkAdapter.get('/gameLevels/');
  return result.data;
}