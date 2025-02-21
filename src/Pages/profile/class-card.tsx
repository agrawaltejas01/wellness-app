import { Flex } from "antd";
import { useState } from "react";
import activityToSvgMap from "../../images/class-images/activity-map";
import colors from "../../constants/colours";

import { ReactComponent as LocationSVG } from "../../images/home/location.svg";
import { Rs } from "../../constants/symbols";
import { IBookings } from "../../types/user";
import { formatDate, formatTimeIntToAmPm } from "../../utils/date";
import useWindowDimensions from "../../hooks/getWindowDimensions";
import { createMapsLink, toLetterCase } from "../../utils/string-operation";

interface BookingClassCard {
  booking: IBookings & {
    guests?: Array<{
      name?: string;
      skillLevel?: string;
      gamesPlayed?: number;
    }>;
  };
}

const ClassCardInProfile: React.FC<BookingClassCard> = ({ booking }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  let addressLine1: string, addressLine2: string;
  if (booking.venueAddressLine1 && booking.venueAddressLine2) {
    addressLine1 = booking.venueAddressLine1;
    addressLine2 = booking.venueAddressLine2;
  } else {
    addressLine1 = booking.addressLine1;
    addressLine2 = booking.addressLine2;
  }
  const mapsLink = createMapsLink(addressLine1, addressLine2);

  return (
    <Flex
      flex={1}
      style={{
        alignSelf: "stretch",
        backgroundColor: "white",
        borderRadius: "12px",
        minWidth: "90vw",
        marginBottom: "10px",
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease",
        height: isExpanded ? "auto" : undefined,
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
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Flex align="flex-start">{activityToSvgMap(booking.activity)}</Flex>
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
                          background:
                            guest.skillLevel.toLowerCase() === "advanced"
                              ? "#F0E6FF"
                              : "#E6F0FF",
                          borderRadius: "4px",
                          display: "inline-block",
                        }}
                      >
                        {guest.skillLevel}
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
  );
};

export default ClassCardInProfile;
