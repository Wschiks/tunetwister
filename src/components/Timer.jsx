import { useState, useEffect } from "react";

export default function Timer({ isRunning, resetSignal }) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => setTime(prev => prev + 1), 1000);
        return () => clearInterval(interval);
    }, [isRunning]);

    useEffect(() => setTime(0), [resetSignal]);

    const formatTime = t => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;

    return <div className="text-center text-white font-bold text-xl mt-2">⏱ {formatTime(time)}</div>;
}
