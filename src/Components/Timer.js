import { useState, useEffect } from "react";
import styled from "styled-components";
import dayJs from "dayjs";
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

const TimerSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: end;
  height: 150px;
  width: 80%;

  @media (max-width: 1350px) {
    height: 140px;
  }

  @media (max-width: 1280px) {
    height: 120px;
  }

  @media (max-width: 1180px) {
    height: 100px;
  }

  @media (max-width: 990px) {
    height: 90px;
  }

  @media (max-width: 850px) {
    height: 80px;
  }

  @media (max-width: 770px) {
    height: 70px;
  }

  @media (max-width: 650px) {
    height: 60px;
  }

  @media (max-width: 570px) {
    height: 55px;
    font-size: 1.5rem;
  }

  @media (max-width: 490px) {
    width: 90%;
    height: 42px;
  }
`;

const Days = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 210px;
  height: 100%;
  margin: 0 15px 0 25px;
  background-color: #ff0000;
  color: white;
  font-size: 4rem;
  border-radius: 1rem;

  @media (max-width: 1280px) {
    width: 180px;
  }

  @media (max-width: 1180px) {
    font-size: 3rem;
    width: 140px;
  }

  @media (max-width: 1080px) {
    width: 130px;
  }

  @media (max-width: 990px) {
    width: 120px;
  }

  @media (max-width: 850px) {
    font-size: 2.5rem;
  }

  @media (max-width: 770px) {
    font-size: 2rem;
    width: 90px;
    border-radius: 0.8rem;
    margin: 0 10px 0 15px;
  }

  @media (max-width: 570px) {
    width: 60px;
    font-size: 1.5rem;
    margin: 0 8px;
  }
`;

const Numbers = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 190px;
  height: 100%;
  margin: 0 15px 0 25px;
  background-color: #ff0000;
  color: white;
  font-size: 4rem;
  border-radius: 1rem;

  @media (max-width: 1280px) {
    width: 150px;
  }

  @media (max-width: 1180px) {
    font-size: 3rem;
    width: 120px;
  }

  @media (max-width: 1080px) {
    width: 110px;
  }

  @media (max-width: 990px) {
    width: 100px;
  }

  @media (max-width: 850px) {
    font-size: 2.5rem;
  }

  @media (max-width: 770px) {
    font-size: 2rem;
    width: 80px;
    border-radius: 0.8rem;
    margin: 0 10px 0 15px;
  }

  @media (max-width: 570px) {
    width: 50px;
    font-size: 1.5rem;
    margin: 0 8px;
  }
`;

const ChineseWords = styled.h4`
  font-size: 3rem;
  margin: 0;
  color: #ff0000;

  @media (max-width: 990px) {
    font-size: 2rem;
  }

  @media (max-width: 570px) {
    font-weight: 500;
    font-size: 1.5rem;
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
    const getRemainingSeconds = (nowDayJs, timeStampDayJs) => {
      const seconds = timeStampDayJs.diff(nowDayJs, "seconds") % 60;
      return padWithZeros(seconds, 2);
    };

    const getRemainingMinutes = (nowDayJs, timeStampDayJs) => {
      const minutes = timeStampDayJs.diff(nowDayJs, "minutes") % 60;
      return padWithZeros(minutes, 2);
    };

    const getRemainingHours = (nowDayJs, timeStampDayJs) => {
      const hours = timeStampDayJs.diff(nowDayJs, "hours") % 24;
      return padWithZeros(hours, 2);
    };

    const getRemainingDays = (nowDayJs, timeStampDayJs) => {
      const days = timeStampDayJs.diff(nowDayJs, "days");
      return days;
    };

    const padWithZeros = (number, minLength) => {
      const numberString = number.toString();
      if (numberString.length >= minLength) {
        return numberString;
      } else {
        return "0".repeat(minLength - numberString.length) + numberString;
      }
    };

    const getRemainingTime = () => {
      const timeStampDayJs = dayJs(getNextChristimaDay()).tz("Europe/Helsinki");
      const nowDayJs = dayJs().tz("Europe/Helsinki");
      if (timeStampDayJs.isBefore(nowDayJs)) {
        return defaultRemainingTime;
      }

      return {
        seconds: getRemainingSeconds(nowDayJs, timeStampDayJs),
        minutes: getRemainingMinutes(nowDayJs, timeStampDayJs),
        hours: getRemainingHours(nowDayJs, timeStampDayJs),
        days: getRemainingDays(nowDayJs, timeStampDayJs),
      };
    };

    setInterval(() => {
      setRemainingTime(getRemainingTime());
    }, 1000);
  }, [setRemainingTime]);

  const showMessage = (d, h, m, s) => {
    if (d <= 0 && h <= 0 && m <= 0 && s <= 0) {
      return <span>Happy Christmas!</span>;
    } else {
      return (
        <>
          <TimerSection>
            <Days>{d}</Days>
            <ChineseWords>天</ChineseWords>
            <Numbers>{h}</Numbers>
            <ChineseWords>時</ChineseWords>
            <Numbers>{m}</Numbers>
            <ChineseWords>分</ChineseWords>
            <Numbers>{s}</Numbers>
            <ChineseWords>秒</ChineseWords>
          </TimerSection>
        </>
      );
    }
  };

  const { days, hours, minutes, seconds, initialValue } = remainingTime;

  return <>{!initialValue && showMessage(days, hours, minutes, seconds)}</>;
};

export default Countdown;
