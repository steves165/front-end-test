import {Holiday} from "@/types/booking";
import {Filter, Filters, FilterType} from "@/types/filters";

const dedupeAndRemoveEmptyFilters = (filters: Filter[] | undefined): Filter[] => filters?.reduce((uniqueFilters: Filter[], currentFilter: Filter) => {
    const isDuplicate: boolean = uniqueFilters.some((filter: Filter): boolean =>
        filter.value === currentFilter.value)

    if (!isDuplicate && currentFilter.value !== undefined && currentFilter.value !== '') {
        uniqueFilters.push(currentFilter)
    }

    return uniqueFilters
}, []) ?? []

export namespace FilterService {
    export const applyRangeValueMaxToFilters = (filters: Filter[], value: number): Filter[] =>
        filters.map((filter: Filter): Filter => ({
            ...filter,
            checked: Number(filter.value) <= value
        }))

    export const applyRangeValueMinToFilters = (filters: Filter[], value: number): Filter[] =>
        filters.map((filter: Filter): Filter => ({
            ...filter,
            checked: Number(filter.value) >= value
        }))

    export const getRangesForNumberFilter = (filters: Filter[]): [number, number] => {
        const values: number[] = filters.map((filter: Filter): number => Number(filter.value))

        return [Math.min(...values), Math.max(...values)]
    }

    export const applyFilters = (holidays: Holiday[], filters: Filters): Holiday[] =>
        holidays.filter((holiday: Holiday): boolean => {
            const starFilters: string[] = filters[FilterType.StarRating].filter((filter: Filter): boolean => filter.checked).map((filter: Filter): string => filter.value as string)
            const hotelFacilityFilters: string[] = filters[FilterType.HotelFacilities].filter((filter: Filter): boolean => filter.checked).map((filter: Filter): string => filter.value as string)
            const priceFilters: number[] = filters[FilterType.PricePerPerson].filter((filter: Filter): boolean => filter.checked).map((filter: Filter): number => filter.value as number)

            if (starFilters.length > 0 && !starFilters.includes(`${holiday.hotel.content.starRating}`)) {
                return false
            }

            if ((hotelFacilityFilters.length > 0 && !hotelFacilityFilters.every((facility: string): boolean => holiday.hotel.content.hotelFacilities.includes(facility))) ||
                hotelFacilityFilters.length > 0 && holiday.hotel.content.hotelFacilities.length === 0) {
                return false
            }

            return !(priceFilters.length > 0 && !priceFilters.includes(holiday.pricePerPerson))
        })

    export const buildFiltersFromHolidays = (holidays: Holiday[] | undefined): Filters => ({
        [FilterType.StarRating]: dedupeAndRemoveEmptyFilters(holidays?.map((holiday: Holiday): Filter => ({
            label: holiday.hotel.content.starRating,
            value: holiday.hotel.content.starRating,
            checked: false
        }))),
        [FilterType.HotelFacilities]: dedupeAndRemoveEmptyFilters(holidays?.reduce((acc: Filter[], holiday: Holiday): Filter[] => {
            holiday.hotel.content.hotelFacilities.forEach((facility: string): void => {
                if (!acc.find((filter: Filter): boolean => filter.value === facility)) {
                    acc.push({
                        label: facility,
                        value: facility,
                        checked: false
                    })
                }
            })
            return acc
        }, [])),
        [FilterType.PricePerPerson]: dedupeAndRemoveEmptyFilters(holidays?.map((holiday: Holiday): Filter => ({
            label: holiday.pricePerPerson,
            value: holiday.pricePerPerson,
            checked: false
        })))
    })
}