'use client'

import styles from './search-result.module.scss'

import {ReactElement, useState} from "react";
import {Holiday} from "@/types/booking";
import Image from "next/image";
import {HotelDetailsComponent} from "@/app/components/hotel-details/hotel-details.component";
import {HolidayPricing} from "@/app/components/holiday-pricing/holiday-pricing.component";

type Props = {
    holiday: Holiday
    totalNumberOfPeople: number
}

/**
 * Search result component
 *
 * @param holiday {@link Holiday} - holiday object
 * @param totalNumberOfPeople - total number of people
 */
export const SearchResultComponent = ({holiday, totalNumberOfPeople}: Props): ReactElement => {
    const [isHotelDetailsVisible, setIsHotelDetailsVisible] = useState<boolean>(false)

    return <div className={styles.searchResult}>
        <div className={styles.searchResultHolidayContainer}>
            {(holiday?.hotel?.content?.images ?? []).length > 0 ? (<div className='srs-sr-image-container'>
                <Image
                    className={styles.searchResultImage}
                    src={`http:${holiday?.hotel?.content?.images?.[0]?.RESULTS_CAROUSEL?.url ?? ''}`}
                    width={315}
                    height={230}
                    alt={holiday?.hotel?.name ?? ''}
                />
            </div>) : <></>}
            <div className={styles.searchResultsHolidayDetails}>
                {holiday?.hotel?.name ? <h3 className={styles.searchResultTitle}>{holiday?.hotel?.name ?? ''}</h3> : <></>}
                {holiday?.hotel?.content?.parentLocation ?
                    <p className={styles.searchResultLocation}>{holiday?.hotel?.content?.parentLocation ?? ''}</p> : <></>}
                <div className='srs-sr-reviews-container'>
                    {holiday?.hotel?.content?.starRating ?
                        <div className='srs-sr-star-rating'>Star Rating: {holiday?.hotel?.content?.starRating}</div> : (<></>)}
                </div>
                {holiday?.hotel?.boardBasis ? <p className={styles.searchResultBoardBasis}>{holiday?.hotel?.boardBasis}</p> : <></>}
                {holiday?.hotel?.content?.atAGlance?.length > 0 ? <ul className={styles.searchResultAtAGlances}>
                    {holiday?.hotel?.content?.atAGlance?.map((item: string, index: number) => <li className={styles.searchResultAtAGlance} key={index} dangerouslySetInnerHTML={{__html: item}}></li>)}
                </ul> : <></>}
            </div>
            <HotelDetailsComponent holiday={holiday} isHotelDetailsVisible={isHotelDetailsVisible} />
        </div>
        <HolidayPricing holiday={holiday} totalNumberOfPeople={totalNumberOfPeople} isHotelDetailsVisible={isHotelDetailsVisible} setIsHotelDetailsVisible={setIsHotelDetailsVisible} />
    </div>
}