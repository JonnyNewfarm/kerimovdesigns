"use client";

import { useEffect, useState } from "react";

export default function LocalTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const formattedTime = new Intl.DateTimeFormat("nb-NO", {
        timeZone: "Europe/Oslo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date());

      setTime(formattedTime);
    };

    updateTime();

    const interval = window.setInterval(updateTime, 60_000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <span className="whitespace-nowrap">Local time / {time || "--:--"}</span>
  );
}
