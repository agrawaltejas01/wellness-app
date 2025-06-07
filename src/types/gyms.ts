export interface IGymCard {
  area: string;
  gymId: number;
  name: string;
  photos: string[];
  activities: string[];
  minPrice: number;
  medias: string[];
  offerType: EOfferType;
  isExclusive: boolean;
  maxDiscount: number;
  offerPercentage: number;
  discountType: string;
}

export enum EOfferType {
  NONE = "NONE",
  BATCH_WITH_GUESTS = "BATCH_WITH_GUESTS",
  PLATFORM = "PLATFORM",
  APP = "APP",
}

export interface IBatchActivity {
  id: number;
  code: string;
  name: string;
  showGameLevel: boolean;
  showSlots: boolean;
}

export interface IBatch {
  id?: number;
  batchId: number;
  date: Date | string;
  duration: number;
  price: number;
  startTime: number;
  activity: string;
  activityName: string;
  trainer?: string;
  isDayPass: boolean;
  DurationMin: number;
  aboutTheActivity?: string;
  whatToBring?: string;
  whatToExpect?: string;
  moreInfo?: string;
  gymId: number;
  image?: string;
  description?: string;
  slots: number;
  slotsBooked: number;
  maxDiscount: number;
  discountType: string;
  participants?: ParticipantDetail[];
  noOfParticipants?: number;

  batchActivity?: IBatchActivity; // Added batchActivity field
  
  guestsAllowed?: boolean;
  offerType?: EOfferType;
  offerPercentage: number;
  minGuestsForOffer?: number;
  venue?: string;
  address?: string;
  isRideActivity?: boolean;
  rideDetails?: {
    totalRides: number;
    availableRides: number[];
  };

  venueAddressLine1?: string;
  venueAddressLine2?: string;
  updatedAt?: string;
}

export interface ParticipantDetail {
  participantName: string;
  participantAge: number;
  participantGender: string;
  // jerseyName?: string;
  jerseySize: string;
}

export interface IGymDetails extends Omit<IGymCard, "medias"> {
  description: string;
  batches: IBatch[];
  lat: number;
  long: number;
  addressLine1: string;
  addressLine2: string;
  amenities: [];
  googleRating?: number;
  googleReviews?: number;
  operatingHours: [];
  isExclusive: boolean;
  instaLink?: string;
  isOnlyWeekend: boolean;
  availableDates: string[];
  medias: [{ type: string; url: string }];
}
