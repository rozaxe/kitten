import { faPaw, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useKittenService } from '../../../hooks/useKittenService';
import styles from './Home.module.scss';
import MainContent from './MainContent/MainContent';
import SideBar from './SideBar/SideBar';

export default function Home(): JSX.Element {
    const kittenService = useKittenService()

    const handleSignOut = () => {
        kittenService.signOut()
    }

    return (
        <>
            <div className="flex flex-row or-section or-theme--dark p-1 items-center">
                <div className="or-text font-bold">
                    <FontAwesomeIcon icon={faPaw} className="ml-1 mr-3" color="rgb(255, 165, 108)" />
                    Kitten
                </div>
                <div className="text-xs ml-2 px-1 rounded bg-red-60">alpha</div>
                <div className="flex-1" />
                <button className="or-button--ghost" onClick={handleSignOut}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
            </div>
            <div className="or-row flex-1 overflow-hidden">
                <SideBar className={styles.sideBar} />
                <MainContent className={styles.mainContent} />
            </div>
        </>
    )
}
