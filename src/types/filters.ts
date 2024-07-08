export enum FilterType {
    StarRating = 'Star Ratings',
    HotelFacilities = 'Hotel Facilities',
    PricePerPerson = 'Price per person'
}

export type Filter = {
    label: string | number
    value: string | number
    checked: boolean
}

export type Filters = Record<FilterType, Filter[]>