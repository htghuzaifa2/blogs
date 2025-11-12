"use client";

import { useEffect } from 'react';

export const AdSenseMultiplex = () => {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <div className="my-6">
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-format="autorelaxed"
                data-ad-client="ca-pub-3951816267285710"
                data-ad-slot="8956745923"></ins>
        </div>
    );
};
