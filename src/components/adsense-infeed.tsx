"use client";

import { useEffect, useState } from 'react';

export const AdSenseInFeed = () => {
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
        <div className="h-full flex flex-col">
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-format="fluid"
                data-ad-layout-key="-fb+5w+4e-db+86"
                data-ad-client="ca-pub-3951816267285710"
                data-ad-slot="1428172349"></ins>
        </div>
    );
};
