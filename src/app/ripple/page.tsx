"use client";

import React, { useState, useCallback, memo } from "react";
import { Button, ButtonProps } from "@/components/ui/button";

interface RippleState {
    x: number;
    y: number;
    id: number;
}

interface RippleButtonProps extends ButtonProps {
    children: React.ReactNode;
}

const Ripple: React.FC<RippleState> = memo(({ x, y }) => (
    <span
        className="absolute rounded-full bg-white opacity-50 animate-ripple pointer-events-none"
        style={{
            top: y,
            left: x,
            transform: "translate(-50%, -50%)",
        }}
    />
));

Ripple.displayName = "Ripple";

export const RippleButton: React.FC<RippleButtonProps> = memo(({ children, onClick, ...props }) => {
    const [ripples, setRipples] = useState<RippleState[]>([]);

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const newRipple = { x, y, id: Date.now() };

            setRipples((prevRipples) => [...prevRipples, newRipple]);

            setTimeout(() => {
                setRipples((prevRipples) => prevRipples.filter((r) => r.id !== newRipple.id));
            }, 600);

            onClick?.(e);
        },
        [onClick]
    );

    return (
        <div className="relative overflow-hidden">
            <Button {...props} onClick={handleClick}>
                {children}
            </Button>
            {ripples.map((ripple) => (
                <Ripple key={ripple.id} {...ripple} />
            ))}
        </div>
    );
});

RippleButton.displayName = "RippleButton";

const Page: React.FC = () => (
    <main className="h-screen grid place-content-center">
        <RippleButton>Click me</RippleButton>
    </main>
);

export default Page;