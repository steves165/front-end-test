import styles from './search-results.module.scss'

import {BookingResponse, PartyComposition} from "@/types/booking";
import {Rooms} from "@/utils/composition.service";
import {Filters} from "@/types/filters";
import {ResultsList} from "@/app/components/results-list/results-list.component";
import {FilterService} from "@/utils/filter.service";

async function getData(params: { [key: string]: string | string[] | undefined }) {
    const body = {
        bookingType: params.bookingType,
        direct: false,
        location: params.location,
        departureDate: params.departureDate,
        duration: params.duration,
        gateway: params.gateway,
        partyCompositions: Rooms.parseAndConvert([params.partyCompositions as string]),
    };

    const res: Response = await fetch(
        "https://www.virginholidays.co.uk/cjs-search-api/search",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    )

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export default async function SearchResultsComponent({
                                                         searchParams,
                                                     }: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const req: BookingResponse = await getData(searchParams)
    let results: BookingResponse = req

    const partyCompositions: PartyComposition[] = Rooms.parseAndConvert([searchParams.partyCompositions as string])
    const totalNumberOfPeople: number = partyCompositions.reduce((acc: number, room: PartyComposition) => acc + room.adults + room.childAges.length + room.infants, 0)

    const filters: Filters = FilterService.buildFiltersFromHolidays(results.holidays)

    return (
        <section>
            <ResultsList holidays={results.holidays} totalNumberOfPeople={totalNumberOfPeople} filtersInitial={filters} />
        </section>
    );
}
