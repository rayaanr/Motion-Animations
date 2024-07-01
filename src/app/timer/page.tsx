"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedDigit = React.memo(({ value }: { value: string }) => (
    <div className="relative inline-block w-[1ch] h-[1.3em] overflow-hidden">
        <AnimatePresence mode="popLayout">
            <motion.span
                key={value}
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
            >
                {value}
            </motion.span>
        </AnimatePresence>
    </div>
));

AnimatedDigit.displayName = "AnimatedDigit";

const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600)
        .toString()
        .padStart(2, "0");
    const minutes = Math.floor((time % 3600) / 60)
        .toString()
        .padStart(2, "0");
    const seconds = Math.max(0, time % 60)
        .toString()
        .padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
};

interface CounterProps {
    startTime: number;
    endTime: number;
    className?: string;
}

const Counter: React.FC<CounterProps> = ({ startTime, endTime, className }) => {
    const [isClient, setIsClient] = useState(false);
    const initialTime = Math.ceil((endTime - startTime) / 1000);
    const [currentTime, setCurrentTime] = useState(initialTime);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const updateTime = useCallback(() => {
        const now = Date.now();
        if (now >= endTime) {
            setCurrentTime(0);
        } else {
            setCurrentTime(Math.ceil((endTime - now) / 1000));
        }
    }, [endTime]);

    useEffect(() => {
        if (isClient) {
            let animationFrameId: number;
            const tick = () => {
                updateTime();
                animationFrameId = requestAnimationFrame(tick);
            };
            tick();
            return () => cancelAnimationFrame(animationFrameId);
        }
    }, [isClient, updateTime]);

    const formattedTime = useMemo(() => formatTime(currentTime), [currentTime]);

    return (
        <p className={`flex ${className}`}>
            {formattedTime
                .split("")
                .map((char, index) =>
                    char === ":" ? (
                        <span key={index}>:</span>
                    ) : (
                        <AnimatedDigit key={index} value={char} />
                    )
                )}
        </p>
    );
};

const Timer = () => {
    const startTime = Date.now();
    const endTime = startTime + 18000 * 1000; // 5 hours from now

    return (
        <div className="h-screen grid place-content-center">
            <Counter startTime={startTime} endTime={endTime} className="text-xl" />
        </div>
    );
};

export default Timer;