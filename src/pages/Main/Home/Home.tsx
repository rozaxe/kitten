import React from 'react';
import styles from './Home.module.scss';
import MainContent from './MainContent/MainContent';
import SideBar from './SideBar/SideBar';

export default function Home(): JSX.Element {
    return (
        <div className="or-row flex-1">
            <SideBar className={styles.sideBar} />
            <div className={`${styles.divider} or-divider m-0`} />
            <MainContent className={styles.mainContent} />
        </div>
    )
}
