import React, { useState } from 'react'
import styles from './SideBar.module.scss';
import { useObservable } from 'r-use-observable'
import { none, fold } from 'fp-ts/lib/Option'
import { useKittenService } from '../../../../hooks/useKittenService';
import { Kitty } from '../../../../models/Kitty';
import FoldOption from '../../../../components/FoldOption';
import TreasuryDialog from './TreasuryDialog/TreasuryDialog';
import NewKittyDialog from './NewKittyDialog/NewKittyDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';

type SideBarProps = {
    className?: string
}

export default function SideBar({ className = '' }: SideBarProps): JSX.Element {
    const kittenService = useKittenService()
    const kitties = useObservable(kittenService.getVisibleKittiesId$, [])
    const [isTreasuryFormOpen, setIsTreasuryFormOpen] = useState(false)
    const [isNewKittyFormOpen, setIsNewKittyFormOpen] = useState(false)

    const treasury = useObservable(kittenService.getTreasury$, 0)

    return (
        <div className={`${className} or-column or-section or-theme--light-gray`}>
            <div className="or-row--padded or-theme--dark-gray or-section sticky items-center">
                Treasury
                <div className="flex-1 text-right">{kittenService.formatPrice(treasury)}</div>
                <button className="or-button--ghost" onClick={() => setIsTreasuryFormOpen(true)}>
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                <TreasuryDialog isOpen={isTreasuryFormOpen} onClose={() => setIsTreasuryFormOpen(false)} />
            </div>
            <button className="or-button--ghost m-0 rounded-none p-2" onClick={() => setIsNewKittyFormOpen(true)}>
                <FontAwesomeIcon icon={faPlusSquare} className="mr-2" /> New kitty
            </button>
            <NewKittyDialog isOpen={isNewKittyFormOpen} onClose={() => setIsNewKittyFormOpen(false)} />
            {kitties.map(kittyId => <KittyCard key={kittyId} kittyId={kittyId} />)}
        </div>
    )
}

type KittyCardProps = {
    kittyId: string
}

function KittyCard({ kittyId }: KittyCardProps): JSX.Element {
    const kittenService = useKittenService()

    const optionOnKitty = useObservable(
        () => kittenService.getSomeKitty$(kittyId),
        none
    )

    const optionOnSelectedKitty = useObservable(
        () => kittenService.getKittySelected$(),
        none,
    )

    const funds = useObservable(
        () => kittenService.getFundsOfKitty$(kittyId),
        0
    )

    const handleSelection = () => {
        kittenService.setKittySelected(kittyId)
    }

    const isSelected = fold<Kitty, boolean>(
        () => false,
        selected => fold<Kitty, boolean>(
            () => false,
            current => current.id === selected.id
        )(optionOnKitty)
    )(optionOnSelectedKitty)

    return (
        <button className={`${styles.kittyCard} ${isSelected ? 'selected' : ''} or-column or-section or-theme--light`} onClick={handleSelection}>
            <div className={`${styles.kittyCardThumb} or-column`}>
                <div className="or-row--padded or-section">
                    <FoldOption
                        option={optionOnKitty}
                        onSome={
                            kitty => <>{kitty.name}</>
                        }
                    />
                    <div className="flex-1 text-right">
                        {kittenService.formatPrice(funds)}
                    </div>
                </div>
                <div className="or-row--padded">
                    <div className="flex-1">
                        <FoldOption
                            option={optionOnKitty}
                            onSome={
                                kitty => <>{kitty.expenses.length}</>
                            }
                        /> expenses.
                    </div>
                </div>
            </div>
        </button>
    )
}
