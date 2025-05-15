
import { Card, Flex } from "antd";
import ActivityTiles from "../../components/activity-tiles";
import {
  addDays,
  formatDate,
  formatTimeIntToAmPm,
  getDayOfWeek,
} from "../../utils/date";
import { RightOutlined } from "@ant-design/icons";
import { IBatch, IGymDetails } from "../../types/gyms";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getGymBatchesForDate } from "../../apis/gym/batches";
import { errorToast } from "../../components/Toast";

import { ReactComponent as NoBatchImage } from "../../images/gym/no-batch.svg";
import { navigate } from "@reach/router";
import colors from "../../constants/colours";
import { Rs } from "../../constants/symbols";
import { toLetterCase } from "../../utils/string-operation";
import { Mixpanel } from "../../mixpanel/init";
import { Slide } from "react-toastify";

function generateBatchTile(gymData: IGymDetails, batches: IBatch[]) {
  const batchTile = (batch: IBatch) => {
    return (
      <Card
        style={{
          // paddingTop: "16px",
          // paddingBottom: "16px",
          // paddingLeft: "8px",
          paddingRight: "16px",
          borderTopWidth: "0px",
          borderBottomWidth: "0px",
        }}
        onClick={() => {
          navigate(`/checkout/batch/${batch.batchId}`, {
            state: {
              batchId: batch.batchId.toString(),
              batchDetails: batch,
              gymData,
            },
          });
        }}
      >
        <Flex flex={1}>
          <Flex flex={2}>
            <span>
              <span
                style={{
                  backgroundColor: colors.border,
                  borderRadius: "4px",
                  padding: "5px",
                }}
              >
                {batch.isDayPass
                  ? "All Day"
                  : formatTimeIntToAmPm(batch.startTime)}
              </span>
            </span>
          </Flex>
          <Flex
            flex={4}
            style={{
              borderBottomWidth: "1px",
              borderBottomColor: colors.border,
              borderBottomStyle: "solid",

              paddingBottom: "8px",
            }}
          >
            <Flex flex={2} vertical>
              <Flex flex={1} style={{ fontWeight: "bold" }}>
                {batch.activityName}
              </Flex>
              {batch.trainer ? <Flex flex={1}>By {batch.trainer}</Flex> : null}
              {!batch.isDayPass ? (
                <Flex
                  style={{ color: colors.secondary, marginTop: "4px" }}
                  flex={1}
                >
                  {batch.duration} min
                </Flex>
              ) : null}
            </Flex>
            <Flex flex={1}>
              <span>
                {Rs}
                {batch.price}{" "}
              </span>
              <span style={{ marginLeft: "auto" }}>
                {" "}
                <RightOutlined />{" "}
              </span>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    );
  };

  return (
    <Flex flex={1} vertical>
      {batches.map((batch) => {
        return <span key={batch.batchId}> {batchTile(batch)} </span>;
      })}
    </Flex>
  );
}

function noBatchComponent() {
  return (
    <Flex
      flex={1}
      align="center"
      justify="center"
      vertical
      style={{ marginTop: "48px", paddingBottom: "20px" }}
    >
      <NoBatchImage />
      <span style={{ marginTop: "8px" }}>No slots for today!</span>
      <span style={{ marginTop: "4px" }}>
        Try searching for slots in other dates
      </span>
    </Flex>
  );
}

interface IBatchSchedule {
  gymData: IGymDetails;
}

const BatchSchedule: React.FC<IBatchSchedule> = ({ gymData }) => {
  const [selectedDate, setSelectedDate] = useState(
    formatDate(new Date()).isoDate
  );
  const [selectedActivity, setSelectedActivity] = useState("all");

  const [batches, setBatches] = useState(gymData.batches);
  const userId = window.localStorage["zenfitx-user-details"]
        ? JSON.parse(window.localStorage["zenfitx-user-details"]).id || "0"
        : "0";


  const { mutate: _getGymBatchesForDate } = useMutation({
    mutationFn: getGymBatchesForDate,
    onSuccess: (result) => {
      let batches = result.batches;
      
      setBatches(result.batches);
      if (!batches.length) errorToast("No batches found");
    },
    onError: (error) => {
      setBatches([]);
      errorToast("Error in getting batches");
    },
  });

  function generateDateTiles() {
    const style: React.CSSProperties = {
      marginLeft: "11px",
      cursor: "pointer",
      fontSize: "14px",
      minWidth: "60px",
      flex: "0 0 auto"
    };

    let selectedStyle: React.CSSProperties = {
      ...style,
      borderBottomWidth: "2px",
      borderBottomStyle: "solid",
      fontWeight: "bold",
    };

    const dateTile = (number: number, day: string, dateString: string, userId: string) => (
      <Flex
        vertical
        justify="center"
        align="center"
        style={selectedDate == dateString ? selectedStyle : style}
        onClick={() => {
          Mixpanel.track("clicked_date_gym", {
            gymId: gymData.gymId,
            date: dateString,
            day: `${number}-${day}`,
            userId: userId,
          });
          setSelectedDate(dateString);
          _getGymBatchesForDate({
            id: gymData.gymId,
            date: dateString,
            activity: selectedActivity,
            userId: userId,
          });
        }}
      >
        <span style={{ marginBottom: "4px" }}> {number} </span>
        <span> {day} </span>
      </Flex>
    );
    
    //generate code
    const generateNext14Days = () => {
      const dates = [];
      for (let days = 0; days < 7; days++) {
        let date = addDays(new Date(), days);
        dates.push(formatDate(date).isoDate);
      }
      return dates;
    };

    // API dates if available, otherwise fallback
    const availableDates = gymData.availableDates?.length 
      ? gymData.availableDates 
      : generateNext14Days();

    const weekDateAndDays = availableDates.map((dateString: string) => {
      const date = new Date(dateString);
      return {
        number: date.getDate(),
        day: toLetterCase(getDayOfWeek(date)),
        dateString: dateString,
      };
    });

    return (
      <Flex
        flex={1}
        style={{
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: colors.border,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
        justify="flex-start"
      >
        {weekDateAndDays.map(({ number, day, dateString }) => (
          <span key={dateString}> {dateTile(number, day, dateString, userId)} </span>
        ))}
      </Flex>
    );
  }

  return (
    <Flex flex={1} vertical>
      <Flex flex={1} style={{ paddingLeft: "24px" }}>
        <ActivityTiles
          activities={gymData.activities}
          activitySelected={selectedActivity}
          onClickFunction={(activity: string) => {
            Mixpanel.track("clicked_activity_pill_gym", {
              gymId: gymData.gymId,
              activity,
            });
            setSelectedActivity(activity);
            _getGymBatchesForDate({
              id: gymData.gymId,
              date: selectedDate,
              activity: activity,
              userId: userId,
            });
          }}
        />
      </Flex>

      <Flex flex={1}>{generateDateTiles()}</Flex>

      <Flex flex={3} style={{ marginTop: "10px" }}>
        {batches.length
          ? generateBatchTile(gymData, batches)
          : noBatchComponent()}
      </Flex>
    </Flex>
  );
};

export default BatchSchedule;
