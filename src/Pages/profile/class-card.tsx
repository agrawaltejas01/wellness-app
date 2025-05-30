import { Button, Flex, Input } from "antd";
import { useState } from "react";
import activityToSvgMap from "../../images/class-images/activity-map";
import colors from "../../constants/colours";

import { ReactComponent as LocationSVG } from "../../images/home/location.svg";
import { Rs } from "../../constants/symbols";
import { IBookings } from "../../types/user";
import { formatDate, formatTimeIntToAmPm } from "../../utils/date";
import useWindowDimensions from "../../hooks/getWindowDimensions";
import { createMapsLink, toLetterCase } from "../../utils/string-operation";
import { navigate } from "@reach/router";
import { ReactComponent as MenuDotsSVG } from "../../images/utils/menu-dots.svg";
import { BottomUpModal } from "./half-page-modal";
import { CancellationReasons } from "./cancellation-reasons";
import CancelConfirmation from "./cancel-confirmation";
import CancelledImage from "../../images/utils/cancelled.png";
import CancellationDetails from "./cancellation-details";
import CancellationSuccess from "./cancellation-success";
import RefundPolicy from "./refund-policy";
import { CenterModal } from "./center-modal";
import CancelError from "./cancel-error";
import { Mixpanel } from "../../mixpanel/init";

// Function to get background color based on game level
const getGameLevelColor = (level: string): string => {
  const normalizedLevel = level.toLowerCase();
  
  switch (normalizedLevel) {
    case 'beginner':
      return 'rgba(104, 227, 156, 0.15)'; // Light green
    case 'amaeture':
    case 'amateur':
      return 'rgba(255, 199, 91, 0.15)'; // Light amber
    case 'intermediate':
      return 'rgba(108, 160, 220, 0.15)'; // Light blue
    case 'advanced':
      return 'rgba(156, 106, 222, 0.15)'; // Light purple
    default:
      return '#F0F0F0'; // Default light gray
  }
};

interface BookingClassCard {
  booking: IBookings & {
    guests?: Array<{
      name?: string;
      skillLevel?: string;
      gamesPlayed?: number;
    }>;
  } & {
    status?: string;
  };
  isPast?: boolean;
}

const ClassCardInProfile: React.FC<BookingClassCard> = ({ booking, isPast = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showRefundInfoModal, setShowRefundInfoModal] = useState(false);
  let addressLine1: string, addressLine2: string;
  if (booking.venueAddressLine1 && booking.venueAddressLine2) {
    addressLine1 = booking.venueAddressLine1;
    addressLine2 = booking.venueAddressLine2;
  } else {
    addressLine1 = booking.addressLine1;
    addressLine2 = booking.addressLine2;
  }
  const mapsLink = createMapsLink(addressLine1, addressLine2);
  const userId = window.localStorage["zenfitx-user-details"]
          ? JSON.parse(window.localStorage["zenfitx-user-details"]).id || null
          : null;
  

  return (
    <>
      <Flex
        flex={1}
        style={{
          // alignSelf: "stretch",
          backgroundColor: "white",
          borderRadius: "12px",
          minWidth: "90vw",
          marginBottom: "10px",
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease",
          height: isExpanded ? "auto" : undefined,
          opacity: booking.status === "CANCELLED" ? 0.5 : 1,
          pointerEvents: booking.status === "CANCELLED" ? "none" : "auto",
        }}
      >
        <Flex
          vertical
          flex={1}
          style={{
            padding: "16px",
          }}
        >
          <Flex
            flex={1}
            justify="center"
            align="center"
            style={{
              borderBottom: "2px dashed",
              borderBottomColor: colors.border,
              paddingBottom: "16px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            {/* <Flex align="flex-start">{activityToSvgMap(booking.activity)}</Flex> */}
            <Flex vertical align="flex-start" style={{ marginLeft: "8px" }}>
              <Flex
                flex={1}
                style={{ color: colors.secondary, fontSize: "14px" }}
              >
                {" "}
                {toLetterCase(booking.activityName)} . {booking.durationMin}min{" "}
              </Flex>

              <Flex flex={1} style={{ fontSize: "16px", marginTop: "4px" }}>
                {" "}
                {formatTimeIntToAmPm(booking.startTime)},{" "}
                {formatDate(booking.date)["date suffix"]}
              </Flex>

              <Flex
                flex={1}
                style={{
                  color: colors.secondary,
                  fontSize: "12px",
                  marginTop: "8px",
                }}
              >
                <Flex
                  flex={1}
                  justify="flex-start"
                  style={{ justifyContent: "flex-start" }}
                >
                  {Rs}
                  {booking.bookingPrice}
                </Flex>
                <Flex flex={1} justify="flex-end">
                  Booking Id: {booking.bookingId.replace(/book_/g, "")}
                </Flex>
              </Flex>
            </Flex>
            <Flex vertical flex={1} align="flex-end">
              {!isPast && (
                <div style={{ cursor: "pointer", alignSelf: "flex-end"}} onClick={() => {
                  Mixpanel.track("upcoming_booking_three_dots_clicked", {
                    bookingId: booking.bookingId,
                    userId: userId,
                    activity: booking.activity,
                    date: booking.date,
                    time: booking.startTime,
                  });
                  setShowCancelModal(true);
                }}>
                  <MenuDotsSVG />
                </div>
              )}
              {booking?.status === "CANCELLED" && (
                <div className="border-1 shadow-md bg-red-400 rounded-md p-2 text-xs">
                  Cancelled
                </div>  
              ) }
            </Flex>
          </Flex>

          {booking.rideNumbers && booking.rideNumbers.length > 0 && (
            <Flex
              flex={1}
              style={{
                paddingTop: "16px",
                fontSize: "12px",
                color: colors.secondary,
              }}
            >
              {booking.rideNumbers.length === 1
                ? `Ride number: ${booking.rideNumbers[0]}`
                : `Rides numbers: ${booking.rideNumbers.join(", ")}`}
            </Flex>
          )}

          <Flex flex={1} style={{ paddingTop: "16px", fontSize: "12px" }}>
            <Flex flex={1} justify="flex-start">
              <span style={{ marginRight: "8px" }}>
                {" "}
                <LocationSVG />{" "}
              </span>
              <span> {booking.name} </span>
            </Flex>

            <Flex style={{ gap: "24px" }}>
              <Flex
                justify="flex-end"
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => {
                  window.open(mapsLink);
                }}
              >
                <u>Get Direction</u>
              </Flex>

              {booking.guests && (<Flex
                justify="flex-end"
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <u>{isExpanded ? "Less Info" : "More Info"}</u>
                <span
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  ↓
                </span>
              </Flex>)}
            </Flex>
          </Flex>

          {/* Expanded Section */}
          {isExpanded && booking.guests && (
            <Flex
              vertical
              style={{
                marginTop: "24px",
                borderTop: "1px solid",
                borderTopColor: colors.border,
                paddingTop: "16px",
              }}
            >
              <Flex vertical gap="16px">
                <h3 style={{ margin: 0, fontSize: "16px" }}>Participants</h3>

                {booking.guests?.map((guest, index) => (
                  <Flex
                    key={index}
                    justify="space-between"
                    style={{
                      padding: "10px",
                      background: "#F8F8F8",
                      borderRadius: "8px",
                    }}
                  >
                    <Flex vertical gap="4px">
                      {guest?.name && (
                        <span style={{ fontSize: "12px", fontWeight: "500" }}>
                          {guest.name}
                        </span>
                      )}
                      {guest?.skillLevel && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: colors.secondary,
                            padding: "2px 8px",
                            background: getGameLevelColor(guest.skillLevel),
                            borderRadius: "4px",
                            display: "inline-block",
                          }}
                        >
                          {toLetterCase(guest.skillLevel)}
                        </span>
                      )}
                    </Flex>
                    {guest?.gamesPlayed && (
                      <Flex vertical align="flex-end" gap="4px">
                        <span
                          style={{
                            fontSize: "12px",
                            color: colors.secondary,
                          }}
                        >
                          Games Played:
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {guest.gamesPlayed}
                        </span>
                      </Flex>
                    )}
                  </Flex>
                ))}
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
      
      {showCancelModal && (
        <BottomUpModal 
          isOpen={showCancelModal} 
          onClose={() => {setShowCancelModal(false);}} 
          title={toLetterCase(booking.activity)}
          showCloseButton={false}
          borderBottom={true}
        >
          <CancellationDetails booking={booking} setShowCancelReasonModal={setShowCancelReasonModal} setShowCancelModal={setShowCancelModal} setShowRefundInfoModal={setShowRefundInfoModal} />
          {/* <Button type="primary" onClick={() => {setShowCancelReasonModal(true); setShowCancelModal(false)}}>Cancel Booking</Button> */}
        </BottomUpModal>
      )}
      {showCancelReasonModal && (
        <BottomUpModal 
          isOpen={showCancelReasonModal} 
          onClose={() => {setShowCancelReasonModal(false); setSelectedReason("")}} 
          title="Ditching us already? 💔"
          subtitle="Spill the tea - what made you cancel this sesh?"
          showCloseButton={false}
        > 
          <CancellationReasons bookingId={booking.bookingId} selectedReason={selectedReason} setSelectedReason={setSelectedReason} setShowCancelReasonModal={setShowCancelReasonModal} setShowSuccessModal={setShowSuccessModal} setShowErrorModal={setShowErrorModal} />
        </BottomUpModal>
      )}
      {showRefundInfoModal && (
        <CenterModal isOpen={showRefundInfoModal} onClose={() => {setShowRefundInfoModal(false)}} title="Refund Policy">
          <RefundPolicy booking={booking} />
        </CenterModal>
      )}
      {/* {showCancelConfirmationModal && (
        <BottomUpModal 
          isOpen={showCancelConfirmationModal} 
          onClose={() => {setShowCancelConfirmationModal(false); setSelectedReason("")}} 
          title="Cancel Booking"
          showCloseButton={false}
          borderBottom={true}
        >
          <CancelConfirmation bookingId={booking.bookingId} reason={selectedReason} setShowCancelConfirmationModal={setShowCancelConfirmationModal} setShowCancelReasonModal={setShowCancelReasonModal} setShowSuccessModal={setShowSuccessModal} setShowErrorModal={setShowErrorModal} />
        </BottomUpModal>
      )} */}
      {showSuccessModal && (
        <BottomUpModal isOpen={showSuccessModal} onClose={() => {setShowSuccessModal(false); setSelectedReason(""); navigate("/")}} showCloseButton={true}>
          <CancellationSuccess booking={booking} isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}/>
        </BottomUpModal>
      )}
      {showErrorModal && (
        <BottomUpModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} showCloseButton={true}>
          <CancelError />
        </BottomUpModal>
      )}
    </>
  );
};

export default ClassCardInProfile;
