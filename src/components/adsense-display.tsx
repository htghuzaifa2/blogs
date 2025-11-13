"use client";

import { useEffect, useState, useRef } from 'react';

export const AdSenseDisplay = () => {
    const [isClient, setIsClient] = useState(false);
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
                if (insRef.current.parentElement) {
                    insRef.current.parentElement.style.display = 'none';
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
        <div className="my-6 text-center">
            <ins
                ref={insRef}
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-3951816267285710"
                data-ad-slot="4348213230"
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
};