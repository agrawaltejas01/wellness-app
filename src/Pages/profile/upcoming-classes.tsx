import { Flex } from "antd";
import ClassCardInProfile from "./class-card";
import colors from "../../constants/colours";
import { IBookings } from "../../types/user";

function generateCards(bookings: IBookings[]) {
  return (
    <Flex vertical justify="space-evenly">
      {bookings.map((booking, index) => (
        <ClassCardInProfile key={`upcoming-${index}`} booking={booking} isPast={false} />
      ))}
    </Flex>
  );
}

interface IUpcomingBookings {
  bookings: IBookings[];
}

const UpcomingClasses: React.FC<IUpcomingBookings> = ({ bookings }) => {
  return (
    <Flex vertical style={{ padding: "16px" }}>
      <Flex vertical>
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Upcoming Bookings
        </span>
        <span
          style={{
            color: colors.secondary,
            fontSize: "12px",
            marginTop: "4px",
          }}
        >
          Show this booking at the centre
        </span>
      </Flex>

      <Flex
        flex={1}
        justify="center"
        align="center"
        style={{ marginTop: "16px" }}
      >
        {generateCards(bookings)}
      </Flex>
    </Flex>
  );
};

export default UpcomingClasses;
