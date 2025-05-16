import { EOfferType, IBatch, IGymCard, IGymDetails } from "../types/gyms";
import IUser from "../types/user";

interface PastAppBookingObject {
  [key: string]: boolean; // Changed to boolean since it's used as a boolean check
}

/**
 * Calculates the final amount and discount after applying a percentage deduction
 * @param basePrice - Original price before discount
 * @param discountPercentage - Percentage to deduct (0-100)
 * @returns [finalAmount, discountAmount] - Array containing final price and discount amount
 */
export function calculateDiscountedPrice(
  basePrice: number,
  discountPercentage: number,
): [number, number] {
  const finalAmount = Math.floor(basePrice * (1 - discountPercentage / 100));
  const discountAmount = basePrice - finalAmount;
  return [finalAmount, discountAmount];
}

// Constants
export const FIRST_BOOKING_DISCOUNT_TEXT =
  "50% off on your first booking on ZenfitX";

/**
 * Determines if discount should be shown based on gym, user, and booking conditions
 * @param gym - Gym details object
 * @param userDetails - User details (null for new users)
 * @param isFromApp - Whether request is from mobile app
 * @param pastAppBookings - Object containing past booking history
 * @returns boolean indicating whether to show discount
 */
export function shouldShowDiscount(
  gym: IGymCard | IGymDetails,
  userDetails: IUser | null,
  isFromApp: boolean,
  pastAppBookings: PastAppBookingObject,
  batch: IBatch | null
): boolean {
  // If request is not from app, don't show discount
  if(!isFromApp) {
    return false;
  }

  if(batch?.offerPercentage === 0 || gym.offerPercentage === 0) {
    return false;
  }

  if(batch?.discountType === "NONE" || batch?.discountType === "" || batch?.offerType === EOfferType.BATCH_WITH_GUESTS){
    return false;
  }

  //Case 1: If gym is not offering any discount
  if(gym.discountType === "NONE" || gym.discountType === "" || gym.offerType === EOfferType.BATCH_WITH_GUESTS){
    return false;
  }

  // Case 2: If user is not logged in
  if(!userDetails){
    return true;
  }

  // Case 3: If user has past booking
  if(hasPastBooking(gym.gymId, pastAppBookings) || !isFromApp){
    return false;
  }
  return true;

  // Check for conditions that definitely hide discount
  // if (
  //   gym.discountType === "NONE" ||
  //   gym.discountType === "" ||
  //   !isFromApp ||
  //   gym.offerType === EOfferType.BATCH_WITH_GUESTS ||
  //   hasPastBooking(gym.gymId, pastAppBookings)
  // ) {
  //   return false;
  // }

  // Show discount for new users or if no disqualifying conditions met
  // return !userDetails || true;
}

/**
 * Helper function to check if user has past bookings for a gym
 */
function hasPastBooking(
  gymId: number,
  pastAppBookings: PastAppBookingObject,
): boolean {
  return Boolean(pastAppBookings[gymId]);
}
