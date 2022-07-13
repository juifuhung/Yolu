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
  width: 195px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left:10%;

  @media (max-width: 600px) {
    margin-left: 0;
  }
  }
`;

const HeaderCountDownWords = styled.span`
  font-size: 1.2rem;
  color: #ff0000;

  @media (max-width: 570px) {
    font-size: 1.1rem;
  }
`;

const HeaderChristmasTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #ff0000;

  @media (max-width: 570px) {
    font-size: 1rem;
  }
`;

const HeaderCountDownNumbers = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 40px;
  font-size: 1.3rem;
  color: #ffffff;
  font-weight: 400;
  background-color: #ff0000;
  margin: 0 8px 0 8px;

  @media (max-width: 800px) {
    width: 55px;
    height: 38px;
    font-size: 1.1rem;
  }

  @media (max-width: 600px) {
    width: 48px;
    height: 32px;
    font-size: 1rem;
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
      return <HeaderChristmasTitle>聖誕快樂</HeaderChristmasTitle>;
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
