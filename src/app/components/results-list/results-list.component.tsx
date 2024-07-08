'use client'

import {ReactElement, useEffect, useState} from "react";
import {Holiday} from "@/types/booking";
import {SearchResultComponent} from "@/app/components/search-result/search-result.component";
import {Filter, Filters, FilterType} from "@/types/filters";
import {FiltersComponent} from "@/app/components/filters/filters.component";
import {FilterService} from "@/utils/filter.service";
import styles from "@/app/components/search-results/search-results.module.scss";

type Props = {
    holidays: Holiday[]
    totalNumberOfPeople: number
    filtersInitial: Filters
}

/**
 * Results list component
 *
 * @param holidays - array of holidays
 * @param totalNumberOfPeople - total number of people
 * @param filters - filters object
 */
export const ResultsList = ({holidays, totalNumberOfPeople, filtersInitial}: Props): ReactElement => {
    const [filters, setFilters] = useState<Filters>(filtersInitial)
    const [holidaysCurrent, setHolidaysCurrent] = useState<Holiday[]>(holidays)

    const handleFilterChange = (...filter: Filter[]): void => {
        setFilters((currentFilters: Filters): Filters =>
            Object.fromEntries(Object.entries(currentFilters).map(([filterType, filterList]: [string, Filter[]]): [FilterType, Filter[]] => {
                return [filterType as FilterType, filterList.map((currentFilter: Filter): Filter => {
                    const appliedFilter: Filter | undefined = filter.find((filter: Filter): boolean => filter.label === currentFilter.label)

                    if (appliedFilter) {
                        return {...currentFilter, checked: appliedFilter.checked}
                    }

                    return currentFilter
                }) as Filter[]]
            })) as Filters
        )
    }

    useEffect((): void => {
        if (filters) {
            setHolidaysCurrent(FilterService.applyFilters(holidays, filters))
        }
    }, [filters, holidays])

    return <div className='search-results'>
        <h2 className={styles.title}>{holidaysCurrent?.length} results found</h2>
        <div className={styles.filterResultsContainer}>
            <FiltersComponent filters={filters} handleFilterChange={handleFilterChange}/>
            <div className={styles.resultsList}>
                {holidaysCurrent.map((holiday: Holiday): ReactElement => (
                    <SearchResultComponent
                        key={holiday.hotel.id}
                        totalNumberOfPeople={totalNumberOfPeople}
                        holiday={holiday}
                    />
                ))}
            </div>
        </div>
    </div>
}