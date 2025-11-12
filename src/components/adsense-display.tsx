"use client";

import { useEffect, useState } from 'react';

export const AdSenseDisplay = () => {
    const [isClient, setIsClient] = useState(false);

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

    if (!isClient) {
        return null; // Don't render on the server
    }

    return (
        <div className="my-6 text-center">
            <ins
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
