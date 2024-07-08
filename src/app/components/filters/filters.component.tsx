'use client'

import styles from './filters.module.scss'
import React, {ReactElement, useCallback, useEffect, useMemo, useState} from "react";
import {Filters, Filter, FilterType} from "@/types/filters";
import {FilterService} from "@/utils/filter.service";
type Props = {
    filters: Filters
    handleFilterChange: (...filter: Filter[]) => void
}

const debounce = (func: Function, wait: number) => {
    let timeout: number
    
    return function executedFunction(...args: any[]) {
        const later = (): void => {
            clearTimeout(timeout)
            func(...args)
        }

        clearTimeout(timeout)

        timeout = setTimeout(later, wait) as unknown as number
    }
}

/**
 * Filters component
 *
 * @param filters - filters object
 * @param setFilters - function to set filters
 */
export const FiltersComponent = ({filters, handleFilterChange}: Props): ReactElement => {
    const starRatingFilters: Filter[] = useMemo((): Filter[] => filters[FilterType.StarRating], [filters])
    const hotelFacilitiesFilters: Filter[] = useMemo((): Filter[] => filters[FilterType.HotelFacilities], [filters])
    const pricePerPersonFilters: Filter[] = useMemo((): Filter[] => filters[FilterType.PricePerPerson], [filters])

    const rangesForPricePerPerson: [number, number] = useMemo((): [number, number] => FilterService.getRangesForNumberFilter(pricePerPersonFilters), [pricePerPersonFilters])

    const [minPricePerPerson, setMinPricePerPerson] = useState<number>(rangesForPricePerPerson[0])
    const [maxPricePerPerson, setMaxPricePerPerson] = useState<number>(rangesForPricePerPerson[1])

    const debouncedHandleFilterChange = useCallback(
        debounce((...filterList: Filter[]) => handleFilterChange(...filterList), 300),
        []
    )
    
    useEffect((): void => {
        debouncedHandleFilterChange(...FilterService.applyRangeValueMinToFilters(pricePerPersonFilters, minPricePerPerson))
    }, [minPricePerPerson])

    useEffect((): void => {
        debouncedHandleFilterChange(...FilterService.applyRangeValueMaxToFilters(pricePerPersonFilters, maxPricePerPerson))
    }, [maxPricePerPerson])

    return <div className={styles.filterContainer}>
        <h3>Filters</h3>
        <div className={styles.filters}>
            <div className={styles.filterGroup}>
                <h4>{FilterType.StarRating}</h4>
                {starRatingFilters.map((starRatingFilter: Filter, index: number): ReactElement => (
                    <div key={'star-rating' + index} className={styles.filterEntry}>
                        <input
                            id={'star-rating' + index}
                            type='checkbox'
                            checked={starRatingFilter.checked}
                            onChange={(): void => {
                                handleFilterChange({...starRatingFilter, checked: !starRatingFilter.checked})
                            }}
                        />
                        <label htmlFor={'star-rating' + index}>{starRatingFilter.label}</label>
                    </div>
                ))}
            </div>
            <div className={styles.filterGroup}>
                <h4>{FilterType.HotelFacilities}</h4>
                {hotelFacilitiesFilters.map((hotelFacilitiesFilter: Filter, index: number): ReactElement => (
                    <div key={'hotel-facilities' + index} className={styles.filterEntry}>
                        <input
                            id={'hotel-facilities' + index}
                            type='checkbox'
                            checked={hotelFacilitiesFilter.checked}
                            onChange={(): void => {
                                handleFilterChange({...hotelFacilitiesFilter, checked: !hotelFacilitiesFilter.checked})
                            }}
                        />
                        <label htmlFor={'hotel-facilities' + index}>{hotelFacilitiesFilter.label}</label>
                    </div>
                ))}
            </div>
            <div className={styles.filterGroup}>
                <h4>{FilterType.PricePerPerson}</h4>
                <div className={styles.rangeFilterContainer}>
                    <input
                        className={styles.rangeInput}
                        aria-label='Min price per person filter'
                        id='min-price-filter'
                        type='range'
                        min={rangesForPricePerPerson[0]}
                        max={maxPricePerPerson - 100}
                        value={minPricePerPerson}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                            setMinPricePerPerson(Number(e?.target?.value ?? ''))
                        }}
                    />
                    <label htmlFor='min-price-filter'>Min Price: £{minPricePerPerson}</label>
                </div>
            </div>
            <div className={styles.filterGroup}>
                <h4>{FilterType.PricePerPerson}</h4>
                <div className={styles.rangeFilterContainer}>
                    <input
                        className={styles.rangeInput}
                        aria-label='Max price per person filter'
                        id={FilterType.PricePerPerson}
                        type='range'
                        min={minPricePerPerson}
                        max={rangesForPricePerPerson[1]}
                        value={maxPricePerPerson}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                            setMaxPricePerPerson(Number(e?.target?.value ?? ''))
                        }}
                    />
                    <label htmlFor={FilterType.PricePerPerson}>Max Price: £{maxPricePerPerson}</label>
                </div>
            </div>
        </div>
    </div>
}