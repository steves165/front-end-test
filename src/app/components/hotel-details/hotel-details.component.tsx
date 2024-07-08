import searchResultStyles from "@/app/components/search-result/search-result.module.scss";
import styles from "@/app/components/hotel-details/hotel-details.module.scss";
import {ReactElement} from "react";
import {Holiday} from "@/types/booking";

type Props = {
    holiday: Holiday
    isHotelDetailsVisible: boolean
}

/**
 * Hotel details component
 *
 * @param holiday {@link Holiday} - holiday object
 * @param isHotelDetailsVisible - boolean to determine if hotel details are visible
 */
export const HotelDetailsComponent = ({holiday, isHotelDetailsVisible}: Props): ReactElement => <div
    className={`${styles.hotelDetails} ${isHotelDetailsVisible ? styles.hotelDetailsOpen : ''}`}
>
    {holiday?.hotel?.content?.hotelDescription ? <div className={styles.hotelDetailsDescriptionContainer}>
        <h4>Description</h4>

        <p
            className={styles.hotelDetailDescription}
            dangerouslySetInnerHTML={{__html: holiday?.hotel?.content?.hotelDescription}}></p>
    </div> : <></>}
    <div className={styles.hotelFacilities}>
        <h4>Facilities</h4>
        {holiday?.hotel?.content?.hotelFacilities?.length > 0 ?
            <ul className={`${searchResultStyles.searchResultFacilities} ${styles.hotelFacilities}`}>
                {holiday?.hotel?.content?.hotelFacilities?.map((item: string, index: number) => <li
                    className={searchResultStyles.searchResultFacility} key={index}>{item}</li>)}
            </ul> : <></>}
    </div>
</div>