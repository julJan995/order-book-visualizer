export interface OrderBookLevel {
    price: number;
    size: number;
}

export interface OrderBookData {
    bids: OrderBookLevel[];
    asks: OrderBookLevel[];
    timestamp: string;
}

export interface RawOrderBookSnapshot {
    Time: string;
    [key: string]: number | string;
}

export enum OrderType {
    BID = 'Bid',
    ASK = 'Ask'
}

export const ORDER_SUFFIX = {
    PRICE: '',
    SIZE: 'Size'
} as const;
