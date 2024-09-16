var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const addToDOM = (parent, value) => {
    parent.textContent = value;
};
const satsToBTC = (sats) => {
    return sats / 100000000;
};
const btcToUSD = (btc) => __awaiter(void 0, void 0, void 0, function* () {
    const price = yield btcPrice(`https://mempool.space/api/v1/historical-price?currency=USD&timestamp=${Date.now()}`);
    let usd = price.prices[0].USD;
    console.log(usd);
    return parseFloat((usd * satsToBTC(btc)).toFixed(2));
});
const getData = (endpoint) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = yield response.json();
        return data;
    }
    catch (error) {
        console.error("API call failed:", error);
        throw error;
    }
});
const btcPrice = (endpoint) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = yield response.json();
        return data;
    }
    catch (error) {
        console.error("API call failed:", error);
        throw error;
    }
});
export { addToDOM, getData, satsToBTC, btcToUSD };
