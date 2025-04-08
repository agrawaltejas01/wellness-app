import { atomWithStorage, createJSONStorage } from "jotai/utils";
import IUser, { IPlusDetails } from "../types/user";
import { IBookNowFooter } from "../Pages/checkout/book-now-footer";
import { atom } from "jotai";

const storage = createJSONStorage(() => localStorage);
export const accessTokenAtom = atomWithStorage(
  "zenfitx-access-token",
  "",
  storage
);

const userDetailsStorage = createJSONStorage<IUser | null>(() => localStorage);
export const userDetailsAtom = atomWithStorage<IUser | null>(
  "zenfitx-user-details",
  null,
  userDetailsStorage
);

const plusDetailsStorage = createJSONStorage<IPlusDetails | null>(
  () => localStorage
);
export const plusDetailsAtom = atomWithStorage<IPlusDetails | null>(
  "zenfitx-plus-details",
  null,
  plusDetailsStorage
);

export interface IAfterLoginRedirect {
  afterLoginUrl: string;
}

const checkoutSdkRedirectStorage =
  createJSONStorage<IAfterLoginRedirect | null>(() => localStorage);
export const afterLoginRedirectAtom =
  atomWithStorage<IAfterLoginRedirect | null>(
    "zenfitx-batch-checkout-details",
    null,
    checkoutSdkRedirectStorage
  );

// Temporary storage for game level before saving to backend
export interface IPendingGameLevel {
  batchActivityId: number;
  level: string;
}

const pendingGameLevelStorage = createJSONStorage<IPendingGameLevel | null>(() => localStorage);
export const pendingGameLevelAtom = atomWithStorage<IPendingGameLevel | null>(
  "zenfitx-pending-game-level",
  null,
  pendingGameLevelStorage
);
