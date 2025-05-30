export interface IPlusDetails {
  isPlusMember: boolean;
  plusClassesRemaining: number;
  plusDiscountPercent: number;
  moneySaved: number;
  plusMemberShipPrice: number;
}

interface IUser {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  gender?: "M" | "F" | "O";
  dob?: Date;
  addressLine1?: string;
  addressLine2?: string;
  noOfBookings: number;
  offerType?: string;
}

export interface IBookings {
  bookingId: string;
  bookingPrice: number;
  name: string;
  activity: string;
  activityName: string;
  startTime: number;
  durationMin: number;
  date: Date;
  addressLine1: string;
  addressLine2: string;
  venueAddressLine1?: string;
  venueAddressLine2?: string;
  rideNumbers?: number[];
  noOfParticipants?: number;
  participants?: Array<{
    participantName: string;
  }>;
  refundPolicy?: string;
}

export default IUser;
