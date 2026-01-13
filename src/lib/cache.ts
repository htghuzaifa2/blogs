
// Client-side cache for search-data.json
let cachedSearchData: any[] | null = null;
let pendingPromise: Promise<any[]> | null = null;

export async function getSearchData() {
    if (cachedSearchData) {
        return cachedSearchData;
    }

    if (pendingPromise) {
        return pendingPromise;
    }

    pendingPromise = fetch('/search-data.json')
        .then(res => {
            if (!res.ok) {
                throw new Error(`Content service is unavailable (HTTP ${res.status}). Please try again later.`);
            }
            return res.json();
        })
        .then(data => {
            cachedSearchData = data;
            pendingPromise = null;
            return data;
        })
        .catch(err => {
            pendingPromise = null;
            throw err;
        });

    return pendingPromise;
}
