import { useState, useEffect } from "react";
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
          <span>{d}</span>
          <span>days </span>
          <span>{h}</span>
          <span>hours </span>
          <span>{m}</span>
          <span>minutes </span>
          <span>{s}</span>
          <span>seconds </span>
        </>
      );
    }
  };

  const { days, hours, minutes, seconds, initialValue } = remainingTime;

  return <>{!initialValue && showMessage(days, hours, minutes, seconds)}</>;
};

export default Countdown;
