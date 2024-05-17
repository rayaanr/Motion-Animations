"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState, useContext, createContext } from "react";
import { useInView } from "framer-motion";

const defaultFeature = "todo-list";

// Create a context for the feature state
const FeatureContext = createContext({
    inViewFeature: defaultFeature,
    setInViewFeature: (feature: string) => {},
});

const FeatureProvider = ({ children }: { children: React.ReactNode }) => {
    const [inViewFeature, setInViewFeature] = useState<string>(defaultFeature);

    return (
        <FeatureContext.Provider value={{ inViewFeature, setInViewFeature }}>
            {children}
        </FeatureContext.Provider>
    );
};

const FeatureTitle = ({ children, id }: { children: React.ReactNode; id: string }) => {
    const ref = useRef<HTMLParagraphElement>(null);
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });
    const { setInViewFeature } = useContext(FeatureContext);

    useEffect(() => {
        if (isInView) setInViewFeature(id);
    }, [isInView, id, setInViewFeature]);

    return (
        <p ref={ref} className={`feature-title py-16 font-heading text-3xl md:text-5xl transition-colors ${isInView ? "text-black" : "text-gray-300"}`}>
            {children}
        </p>
    );
};

const FeatureCard = ({ children, id }: { children: React.ReactNode; id: string }) => {
    const { inViewFeature } = useContext(FeatureContext);

    return (
        <div className={`absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br ${inViewFeature === id ? "opacity-100" : "opacity-0"}`}>
            {children}
        </div>
    );
};

const features = [
    {
        title: "Use your calendar as a todo list",
        id: "todo-list",
        image: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80",
    },
    {
        title: "Color your calendar to organize",
        id: "colors",
        image: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
    },
    {
        title: "Instantly know if someone is available",
        id: "availability",
        image: "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
    },
    {
        title: "Track what you listened to when",
        id: "music",
        image: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3070&q=80",
    },
    {
        title: "Always know what your team is up to",
        id: "team",
        image: "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
    },
];

export default function PinScroll() {
    return (
        <FeatureProvider>
            <div className="mx-auto max-w-6xl px-4">
                <div className="h-52 bg-red-100"></div>
                <div className="flex w-full items-start md:gap-20 bg-green-100">
                    <div className="w-full py-[30vh]">
                        <ul>
                            {features.map((feature) => (
                                <li key={feature.id}>
                                    <FeatureTitle id={feature.id}>
                                        {feature.title}
                                    </FeatureTitle>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="sticky top-0 flex h-screen w-full items-center">
                        <div className="relative aspect-square w-full rounded-2xl bg-gray-100 [&:has(>_.active-card)]:bg-transparent">
                            {features.map((feature) => (
                                <FeatureCard key={feature.id} id={feature.id}>
                                    <Image
                                        src={feature.image}
                                        alt={feature.id}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-2xl"
                                    />
                                </FeatureCard>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="h-screen">More room to scroll</div>
            </div>
        </FeatureProvider>
    );
}
