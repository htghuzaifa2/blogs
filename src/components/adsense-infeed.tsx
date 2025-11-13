"use client";

import { useEffect, useState, useRef } from 'react';

export const AdSenseInFeed = () => {
    const [isClient, setIsClient] = useState(false);
    const adContainerRef = useRef<HTMLDivElement>(null);
    const insRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error(err);
        }
    }, [isClient]);

    // Check if the ad slot has been filled. If not, hide the container.
    useEffect(() => {
        if (!isClient) return;
        const checkAd = () => {
            if (insRef.current && insRef.current.clientHeight === 0) {
                 // Ad not filled, hide the container to prevent empty space
                if (adContainerRef.current) {
                    adContainerRef.current.style.display = 'none';
                }
            }
        };
        // Check after a short delay to give AdSense time to load
        const timer = setTimeout(checkAd, 1500);
        return () => clearTimeout(timer);
    }, [isClient]);

    if (!isClient) {
        return null; // Don't render on the server
    }

    return (
        <div ref={adContainerRef} className="h-full flex flex-col">
            <ins ref={insRef} className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-format="fluid"
                data-ad-layout-key="-fb+5w+4e-db+86"
                data-ad-client="ca-pub-3951816267285710"
                data-ad-slot="1428172349"></ins>
        </div>
    );
};