import type { Currency } from "./currency.type"

export interface ExchangeRate {
    id: number
    fromCurrencyId: number
    toCurrencyId: number
    rate: number
    date: string
    fromCurrency?: Currency
    toCurrency?: Currency
    isActive: boolean
}
