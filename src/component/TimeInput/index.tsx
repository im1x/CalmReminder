import { useState, useEffect } from "react";

const TimeInput: React.FC<{
  initialSeconds: number;
  onTimeChange?: (seconds: number) => void;
}> = ({ initialSeconds, onTimeChange }) => {
  // Convert seconds to HH:MM:SS format
  const secondsToTime = (seconds: number) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // Convert HH:MM:SS format to seconds
  const timeToSeconds = (timeStr: string) => {
    const [hrs, mins, secs] = timeStr.split(":").map(Number);
    return hrs * 3600 + mins * 60 + secs;
  };

  const [time, setTime] = useState(() => secondsToTime(initialSeconds));

  useEffect(() => {
    setTime(secondsToTime(initialSeconds));
  }, [initialSeconds]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    const totalSeconds = timeToSeconds(newTime);
    onTimeChange?.(totalSeconds);
  };

  return (
    <input type="time" step="1" value={time} onChange={handleTimeChange} />
  );
};

export default TimeInput;
