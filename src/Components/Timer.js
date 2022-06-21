import { useState, useEffect } from "react";
import dayJs from "dayjs";

const defaultRemainingTime = {
  seconds: "00",
  minutes: "00",
  hours: "00",
  days: "00",
};

const Countdown = () => {
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

  const countdownTimeStamp = 1671926400000;

  const getRemainingTime = (countdownTimeStamp) => {
    const timeStampDayJs = dayJs(countdownTimeStamp);
    const nowDayJs = dayJs();

    return {
      seconds: getRemainingSeconds(nowDayJs, timeStampDayJs),
      minutes: getRemainingMinutes(nowDayJs, timeStampDayJs),
      hours: getRemainingHours(nowDayJs, timeStampDayJs),
      days: getRemainingDays(nowDayJs, timeStampDayJs),
    };
  };

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateRemaninigTime(countdownTimeStamp);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [countdownTimeStamp]);

  const updateRemaninigTime = (countdownTimeStamp) => {
    setRemainingTime(getRemainingTime(countdownTimeStamp));
  };

  return (
    <div>
      <span>{remainingTime.days} </span>
      <span>days </span>
      <span>{remainingTime.hours} </span>
      <span>hours </span>
      <span>{remainingTime.minutes} </span>
      <span>minutes </span>
      <span>{remainingTime.seconds} </span>
      <span>seconds </span>
    </div>
  );
};

export default Countdown;
