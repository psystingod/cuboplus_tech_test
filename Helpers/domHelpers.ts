const addToDOM = (parent: HTMLElement, value: string): void => {
    parent.textContent = value;
}

const satsToBTC = (sats: number): number => {
    return sats / 100_000_000;
}

const btcToUSD = async (btc: number): Promise<number> => {
    const price = await btcPrice(`https://mempool.space/api/v1/historical-price?currency=USD&timestamp=${Date.now()}`);
    let usd = price.prices[0].USD;
    console.log(usd);
    return parseFloat((usd * satsToBTC(btc)).toFixed(2));
}

const getData = async (endpoint: string): Promise<any> => {
    try {

        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();

        return data;

    } catch (error) {

        console.error("API call failed:", error);
        throw error;

    }
}

const btcPrice = async (endpoint: string): Promise<any> => {
    try {

        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();

        return data;

    } catch (error) {

        console.error("API call failed:", error);
        throw error;

    }
}

export {addToDOM, getData, satsToBTC, btcToUSD}