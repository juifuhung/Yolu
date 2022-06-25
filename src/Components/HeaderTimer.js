import { useState, useEffect } from "react";
import dayJs from "dayjs";
import styled from "styled-components";
import { Font } from "../styles/styles";
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");
dayJs.extend(utc);
dayJs.extend(timezone);

const defaultRemainingTime = {
  seconds: "00",
  minutes: "00",
  hours: "00",
  days: "00",
  initialValue: true,
};

const HeaderCountDownSection = styled.section`
  display: flex;
  align-items: center;
`;

const HeaderCountDownWords = styled.span`
  font-size: 2rem;
  color: #ff0000;
`;

const HeaderCountDownNumbers = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95px;
  height: 69px;
  font-size: 2.2rem;
  color: #ffffff;
  font-weight: 400;
  background-color: #ff0000;
  margin: 0 8px 0 8px;

  @media (max-width: 480px) {
    width: 80px;
    height: 55px;
  }
`;

const Countdown = () => {
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

  const getNextChristimaDay = () => {
    let today = dayJs().tz("Europe/Helsinki");
    let christmasYear = today.year();

    if (today.month() == 11 && today.day() > 25) {
      christmasYear = christmasYear + 1;
    }

    let christmasDate = new Date(christmasYear, 11, 25);
    const christmasDateTimeStamp = Math.round(christmasDate.getTime());
    return christmasDateTimeStamp;
  };

  useEffect(() => {
    const getRemainingDays = (nowDayJs, timeStampDayJs) => {
      const days = timeStampDayJs.diff(nowDayJs, "days");
      return days;
    };

    const getRemainingTime = () => {
      const timeStampDayJs = dayJs(getNextChristimaDay()).tz("Europe/Helsinki");
      const nowDayJs = dayJs().tz("Europe/Helsinki");
      if (timeStampDayJs.isBefore(nowDayJs)) {
        return defaultRemainingTime;
      }

      return {
        days: getRemainingDays(nowDayJs, timeStampDayJs),
      };
    };

    setInterval(() => {
      setRemainingTime(getRemainingTime());
    }, 1000);
  }, [setRemainingTime]);

  const showMessage = (d) => {
    if (d <= 0) {
      return <span>Happy Christmas!</span>;
    } else {
      return (
        <>
          <Font>
            <HeaderCountDownSection>
              <HeaderCountDownWords>聖誕節倒數</HeaderCountDownWords>
              <HeaderCountDownNumbers>{d}</HeaderCountDownNumbers>
              <HeaderCountDownWords>天</HeaderCountDownWords>
            </HeaderCountDownSection>
          </Font>
        </>
      );
    }
  };

  const { days, hours, minutes, seconds, initialValue } = remainingTime;

  return <>{!initialValue && showMessage(days, hours, minutes, seconds)}</>;
};

export default Countdown;
