import React, { useEffect } from 'react';
import { useKittenService } from '../../hooks/useKittenService';
import styles from './Home.module.scss';
import MainContent from './MainContent/MainContent';
import SideBar from './SideBar/SideBar';

export default function Home(): JSX.Element {
    const kittenService = useKittenService()

    useEffect(() => {
        kittenService.createKitty({ name: 'House' })
        const trip = kittenService.createKitty({ name: 'Trip' })
        //kittenService.createFunds({ amount: 30000, date: new Date('2020-10-01') })
        kittenService.createExpense({ name: 'Tickets', kittyId: trip.id, amount: 5000, date: new Date('2020-10-02') })
        kittenService.createSavings({ kittyId: trip.id, amount: 20000, date: new Date('2020-10-01') })
    }, [])

    return (
        <div className="or-row flex-1">
            <SideBar className={styles.sideBar} />
            <div className={`${styles.divider} or-divider m-0`} />
            <MainContent className={styles.mainContent} />
        </div>
    )
}
