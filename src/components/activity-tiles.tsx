import { Card, Flex } from "antd";
import colors from "../constants/colours";
import { toLetterCase } from "../utils/string-operation";
import { useEffect, useRef, useState } from "react";

interface IActivityTiles {
  activities: string[];
  activitySelected: string;
  onClickFunction?: (activity: string) => void;
  reposition?:boolean
}

const ActivityTiles: React.FC<IActivityTiles> = ({
  activities,
  activitySelected,
  onClickFunction,
  reposition
}) => {

  const divRef = useRef<HTMLElement>(null);

  const tempActivities= reposition ? repositionActivity(activities,activitySelected):activities

function repositionActivity(arr: string[], str: string) {
  const index = arr?.indexOf(str.toUpperCase());
  if (index !== -1 && index !== 1) {
    // Remove the string from its current position
    arr?.splice(index, 1);
    // Insert the number at the second position
    arr?.splice(1, 0, str);
  }
  return arr;
}

  const style: React.CSSProperties = {
    marginRight: "12px",
    cursor: "pointer",
    padding: "8px 16px",
    border: '1px solid #F1F1F1',
    borderRadius: '8px',
    color:'#05070B',
    fontWeight:'400',
  };

  let selectedStyle: React.CSSProperties = {
    ...style,
    backgroundColor: "#05070B",
    color: "#000",
    fontWeight:'700',
    border: '0.5px solid #05070B',
    background: 'rgba(5, 7, 11, 0.05)'
  };

  const cardTile = (activity: string) => {
    return(
    <Flex
      style={activity == activitySelected ? selectedStyle : style}
      className={activity === activitySelected ? 'selectedTile':''}
      ref={divRef}
      onClick={async () => {
        if (onClickFunction) onClickFunction(activity);
      }}
    >
      <span
        style={{
         whiteSpace:'nowrap'
        }}
      >
        {toLetterCase(activity).replace("One", "1").replace("Two", "2").replace("Three", "3")}
      </span>
    </Flex>
  );
}

  return (
    <div
      style={{
        width: "90vw",
        overflow: "auto",
        marginTop: "21px",
        marginBottom: "21px",
        scrollbarWidth: "none",
        scrollBehavior:'smooth'

      }}
    >
      <Flex
        style={{
          flex: 1,
          // justifyContent: "space-evenly",
          alignContent: "center",
          fontWeight: "bold",
        }}
      >
        <span key={"ALL"}>{cardTile("all")}</span>
        {window.location.pathname.length<2 && <span key={"TRENDING"}>{cardTile("trending")}</span>}

        {tempActivities?.map((activity) => (
          <span key={activity}>{cardTile(activity.toLowerCase())}</span>
        ))}
      </Flex>
    </div>
  );
};

export default ActivityTiles;
