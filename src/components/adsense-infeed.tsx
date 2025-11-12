"use client";

import { useEffect } from 'react';

export const AdSenseInFeed = () => {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error(err);
        }
    }, []);

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
