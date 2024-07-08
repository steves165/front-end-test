import {Holiday} from "@/types/booking";
import {FilterService} from "@/utils/filter.service";
import {Filter, Filters, FilterType} from "@/types/filters";

describe('Filter Service Tests', (): void => {
    describe('Filter builder tests', (): void => {
        it('should handle undefined', (): void => {
            // Given
            const holidays: Holiday[] | undefined = undefined

            // When
            const filters: Filters = FilterService.buildFiltersFromHolidays(holidays)

            // Then
            expect(filters[FilterType.StarRating].length).to.be.equal(0)
            expect(filters[FilterType.HotelFacilities].length).to.be.equal(0)
            expect(filters[FilterType.PricePerPerson].length).to.be.equal(0)
        })

        it('should handle empty', (): void => {
            // Given
            const holidays: Holiday[] = []

            // When
            const filters: Filters = FilterService.buildFiltersFromHolidays(holidays)

            // Then
            expect(filters[FilterType.StarRating].length).to.be.equal(0)
            expect(filters[FilterType.HotelFacilities].length).to.be.equal(0)
            expect(filters[FilterType.PricePerPerson].length).to.be.equal(0)
        })

        it('should handle combination of valid and invalid data', (): void => {
            // Given
            cy.fixture('holidays.json').then((holidays: Holiday[]) => {
                // When
                const filters: Filters = FilterService.buildFiltersFromHolidays(holidays)

                // Then
                expect(filters[FilterType.StarRating].length).to.be.equal(4)
                expect(filters[FilterType.HotelFacilities].length).to.be.equal(17)
                expect(filters[FilterType.PricePerPerson].length).to.be.equal(74)
                expect(filters[FilterType.StarRating]?.[0]?.value).to.be.equal('3')
            })
        })
    })


    describe('Apply Filters Tests', (): void => {
        it('should handle undefined', (): void => {
            // Given
            const holidays: Holiday[] = []
            const filters: Filters = {
                [FilterType.StarRating]: [],
                [FilterType.HotelFacilities]: [],
                [FilterType.PricePerPerson]: []
            }

            // When
            const filteredHolidays: Holiday[] = FilterService.applyFilters(holidays, filters)

            // Then
            expect(filteredHolidays.length).to.be.equal(0)
        })

        it('should handle empty', (): void => {
            // Given
            cy.fixture('holidays.json').then((holidays: Holiday[]) => {
                const filters: Filters = {
                    [FilterType.StarRating]: [],
                    [FilterType.HotelFacilities]: [],
                    [FilterType.PricePerPerson]: []
                }

                // When
                const filteredHolidays: Holiday[] = FilterService.applyFilters(holidays, filters)

                // Then
                expect(filteredHolidays.length).to.be.equal(80)
            })
        })

        it('should handle valid star rating filter', (): void => {
            // Given
            cy.fixture('holidays.json').then((holidays: Holiday[]) => {
                const filters: Filters = {
                    [FilterType.StarRating]: [
                        {label: '3', value: '3', checked: true}
                    ],
                    [FilterType.HotelFacilities]: [
                        {label: 'Bar', value: 'Bar', checked: false}
                    ],
                    [FilterType.PricePerPerson]: [
                        {label: '£3003', value: 3003, checked: false}
                    ]
                }

                // When
                const filteredHolidays: Holiday[] = FilterService.applyFilters(holidays, filters)

                // Then
                expect(filteredHolidays.length).to.be.equal(17)
                expect(filteredHolidays.filter(holiday => holiday.hotel.content.starRating === '3').length).to.be.equal(17)
            })
        })

        it('should handle valid hotel facilities filter', (): void => {
            // Given
            cy.fixture('holidays.json').then((holidays: Holiday[]) => {
                const filters: Filters = {
                    [FilterType.StarRating]: [
                        {label: '3', value: '3', checked: false}
                    ],
                    [FilterType.HotelFacilities]: [
                        {label: 'Bar', value: 'Bar', checked: true}
                    ],
                    [FilterType.PricePerPerson]: [
                        {label: '£3003', value: 3003, checked: false}
                    ]
                }

                // When
                const filteredHolidays: Holiday[] = FilterService.applyFilters(holidays, filters)

                // Then
                expect(filteredHolidays.length).to.be.equal(66)
                expect(filteredHolidays.filter(holiday => holiday.hotel.content.hotelFacilities.includes('Bar')).length).to.be.equal(66)
            })
        })

        it('should handle valid price per person filter', (): void => {
            // Given
            cy.fixture('holidays.json').then((holidays: Holiday[]) => {
                const filters: Filters = {
                    [FilterType.StarRating]: [
                        {label: '3', value: '3', checked: false}
                    ],
                    [FilterType.HotelFacilities]: [
                        {label: 'Bar', value: 'Bar', checked: false}
                    ],
                    [FilterType.PricePerPerson]: [
                        {label: '£2100.9', value: 2100.9, checked: true}
                    ]
                }

                // When
                const filteredHolidays: Holiday[] = FilterService.applyFilters(holidays, filters)

                // Then
                expect(filteredHolidays.length).to.be.equal(1)
                expect(filteredHolidays.filter(holiday => holiday.pricePerPerson === 2100.9).length).to.be.equal(1)
            })
        })
    })

    describe('Get ranges for number filter tests', (): void => {
        it('should handle empty', (): void => {
            // Given
            const filters: Filter[] = []

            // When
            const [min, max]: [number, number] = FilterService.getRangesForNumberFilter(filters)

            // Then
            expect(min).to.be.equal(Infinity)
            expect(max).to.be.equal(-Infinity)
        })

        it('should handle valid', (): void => {
            // Given
            const filters: Filter[] = [
                {label: '£3003', value: 3003, checked: true},
                {label: '£2100.9', value: 2100.9, checked: false}
            ]

            // When
            const [min, max]: [number, number] = FilterService.getRangesForNumberFilter(filters)

            // Then
            expect(min).to.be.equal(2100.9)
            expect(max).to.be.equal(3003)
        })

        it('should handle valid with large dataset', (): void => {
            // Given
            const filters: Filter[] = Array.from({length: 10000}, (_, index) => ({
                label: `£${index}`, value: index, checked: true
            }))

            // When
            const [min, max]: [number, number] = FilterService.getRangesForNumberFilter(filters)

            // Then
            expect(min).to.be.equal(0)
            expect(max).to.be.equal(9999)
        })
    })

    describe('Apply range value min to filters tests', (): void => {
        it('should handle empty', (): void => {
            // Given
            const filters: Filter[] = []
            const value: number = 3003

            // When
            const updatedFilters: Filter[] = FilterService.applyRangeValueMinToFilters(filters, value)

            // Then
            expect(updatedFilters.length).to.be.equal(0)
        })

        it('should handle valid', (): void => {
            // Given
            const filters: Filter[] = [
                {label: '£3003', value: 3003, checked: false},
                {label: '£2100.9', value: 2100.9, checked: false},
                {label: '£10000', value: 10000, checked: false}
            ]
            const value: number = 3004

            // When
            const updatedFilters: Filter[] = FilterService.applyRangeValueMinToFilters(filters, value)

            // Then
            expect(updatedFilters.length).to.be.equal(3)
            expect(updatedFilters[0].checked).to.be.false
            expect(updatedFilters[1].checked).to.be.false
            expect(updatedFilters[2].checked).to.be.true
        })

        it('should handle valid with large dataset', (): void => {
            // Given
            const filters: Filter[] = Array.from({length: 10000}, (_, index: number) => ({
                label: `£${index}`, value: index, checked: false
            }))
            const value: number = 3003

            // When
            const updatedFilters: Filter[] = FilterService.applyRangeValueMinToFilters(filters, value)

            // Then
            expect(updatedFilters.length).to.be.equal(10000)
            expect(updatedFilters.filter(filter => filter.checked).length).to.be.equal(6997)
        })
    })

    describe('Apply range value max to filters tests', (): void => {
        it('should handle empty', (): void => {
            // Given
            const filters: Filter[] = []
            const value: number = 3003

            // When
            const updatedFilters: Filter[] = FilterService.applyRangeValueMaxToFilters(filters, value)

            // Then
            expect(updatedFilters.length).to.be.equal(0)
        })

        it('should handle valid', (): void => {
            // Given
            const filters: Filter[] = [
                {label: '£3003', value: 3003, checked: false},
                {label: '£2100.9', value: 2100.9, checked: false},
                {label: '£10000', value: 10000, checked: false}
            ]
            const value: number = 3003

            // When
            const updatedFilters: Filter[] = FilterService.applyRangeValueMaxToFilters(filters, value)

            // Then
            expect(updatedFilters.length).to.be.equal(3)
            expect(updatedFilters[0].checked).to.be.true
            expect(updatedFilters[1].checked).to.be.true
            expect(updatedFilters[2].checked).to.be.false
        })

        it('should handle valid with large dataset', (): void => {
            // Given
            const filters: Filter[] = Array.from({length: 10000}, (_, index: number) => ({
                label: `£${index}`, value: index, checked: false
            }))
            const value: number = 3003

            // When
            const updatedFilters: Filter[] = FilterService.applyRangeValueMaxToFilters(filters, value)

            // Then
            expect(updatedFilters.length).to.be.equal(10000)
            expect(updatedFilters.filter(filter => filter.checked).length).to.be.equal(3004)
        })
    })
})