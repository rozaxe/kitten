import { faPiggyBank } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { none } from 'fp-ts/lib/Option'
import { useObservable } from 'r-use-observable'
import React from 'react'
import FoldOption from '../../../components/FoldOption'
import { useKittenService } from '../../../hooks/useKittenService'
import KittyDetail from './KittyDetail/KittyDetail'

type MainContentProps = {
    className?: string
}

export default function MainContent({ className = '' }: MainContentProps) {
    const kittenService = useKittenService()

    const optionOnKitty = useObservable(
        () => kittenService.getKittySelected$(),
        none
    )

    return (
        <div className={`${className}`}>
            <FoldOption
                option={optionOnKitty}
                onNone={() => (
                    <div className="or-theme--light-gray or-section min-h-full">
                        <FontAwesomeIcon icon={faPiggyBank} flip="horizontal" />
                    </div>
                )}
                onSome={kitty => <KittyDetail kitty={kitty} />}
            />
        </div>
    )
}
