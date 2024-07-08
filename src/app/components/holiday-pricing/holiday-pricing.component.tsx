import styles from './holiday-pricing.module.scss'

import { Holiday } from "@/types/booking";
import {Dispatch, ReactElement, SetStateAction} from "react";
import HotelIcon from "@/app/icons/hotel.icon";

type Props = {
    holiday: Holiday
    totalNumberOfPeople: number
    isHotelDetailsVisible: boolean
    setIsHotelDetailsVisible: Dispatch<SetStateAction<boolean>>
}

/**
 * Holiday pricing component
 *
 * @param holiday {@link Holiday} - holiday object
 * @param totalNumberOfPeople - total number of people
 * @param isHotelDetailsVisible - boolean to determine if hotel details are visible
 * @param setIsHotelDetailsVisible - function to set hotel details visibility
 */
export const HolidayPricing = ({holiday, totalNumberOfPeople, isHotelDetailsVisible, setIsHotelDetailsVisible}: Props): ReactElement => <div className={styles.priceContainer}>
    <div className={styles.priceBlock}>
        <div className='srs-sr-pp-price'>
            <span className={styles.price}>
                £{holiday?.pricePerPerson}
            </span>
            per person
        </div>
        <div className='srs-sr-total-price'>
            <span className={styles.price}>
                £{holiday?.totalPrice}
            </span>
            for {totalNumberOfPeople} guest{totalNumberOfPeople > 1 ? 's' : ''}
        </div>
    </div>
    <div className={styles.holidayButtonContainer}>
        <button
            id={`hotel-details-trigger-${holiday?.hotel?.id}`}
            aria-label={isHotelDetailsVisible ? 'Hide hotel details' : 'Show hotel details'}
            className={styles.hotelDetailsTrigger}
            onClick={(): void => setIsHotelDetailsVisible((hotelDetailsVisible: boolean): boolean => !hotelDetailsVisible)}
        >
            <HotelIcon />
        </button>
        <button aria-label='Continue' className={styles.priceContinue} id='continue-button'>View Details</button>
    </div>
</div>