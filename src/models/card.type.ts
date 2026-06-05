export interface CardModel {
    title: string,
    bgColor?: string
    textColor?: string
    iconColor?: string
    color?: string
    value: string
    change?: string
    trend?: string
    icon: React.ElementType
    numericValue?: number
    prefix?: string
    suffix?: string
    accentGradient?: string
    iconGradient?: string
}