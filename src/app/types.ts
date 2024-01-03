export type Query = {
    value: string
    isManual: boolean
}

export type Recommendation = {
    id: number
    name: string
}

export type Item = {
    vending_id: number
    amount: number
    price: number
    vending: Vending
    cart: Cart
}

export type Cart = {
    nameid: number
    refine: number
    card0: number
    card1: number
    card2: number
    card3: number
}

export type Vending = {
    id: number
    map: string
    x: number
    y: number
    char: {
        name: string
        shopCode: number
    }
}

export type ItemHistory = {
    nameid: number,
    cheapestAvailable: number,
    cheapestSold: number,
    highestSold: number,
    quantitySold: number,
}

export enum TableType {
    Results = 0, PriceHistory = 1
  }