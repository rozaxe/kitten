import React, { useState } from 'react'
import styles from './SideBar.module.scss';
import { useObservable } from 'r-use-observable'
import { none, fold } from 'fp-ts/lib/Option'
import { useKittenService } from '../../../hooks/useKittenService';
import { Kitty } from '../../../models/Kitty';
import FoldOption from '../../../components/FoldOption';
import TreasuryDialog from './TreasuryDialog/TreasuryDialog';

type SideBarProps = {
    className?: string
}

export default function SideBar({ className = '' }: SideBarProps): JSX.Element {
    const kittenService = useKittenService()
    const kitties = useObservable(kittenService.getKittiesId$, [])
    const [isFormOpen, setIsFormOpen] = useState(false)

    const treasury = useObservable(kittenService.getTreasury$, 0)

    return (
        <div className={`${className} or-column or-section or-theme--light-gray`}>
            <div className="or-row--padded or-theme--dark or-section sticky">
                Treasury
                <div className="flex-1 text-right">{kittenService.formatPrice(treasury)}</div>
                <button className="or-button--ghost" onClick={() => setIsFormOpen(true)}>Edit</button>
                <TreasuryDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
            </div>
            <div>
                New kitty
            </div>
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
