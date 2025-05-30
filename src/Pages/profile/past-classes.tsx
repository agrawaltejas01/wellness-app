import { Flex } from "antd";
import ClassCardInProfile from "./class-card";
import { IBookings } from "../../types/user";

function generateCards(bookings: IBookings[]) {
  return (
    <Flex vertical justify="space-evenly">
      {" "}
      {bookings.map((booking, index) => (
        <ClassCardInProfile key={`past-${index}`} booking={booking} isPast={true} />
      ))}
    </Flex>
  );
}

interface IPastBookings {
  bookings: IBookings[];
}

const PastClasses: React.FC<IPastBookings> = ({ bookings }) => {
  return (
    <Flex vertical style={{ padding: "16px" }}>
      <Flex style={{ fontWeight: "bold", fontSize: "16px" }}>
        Past Bookings{" "}
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

export default PastClasses;
