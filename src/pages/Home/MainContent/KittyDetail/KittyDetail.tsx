import { useObservable } from 'r-use-observable'
import React, { useState } from 'react'
import { useKittenService } from '../../../../hooks/useKittenService'
import { Kitty } from '../../../../models/Kitty'
import ExpenseDialog from './ExpenseDialog/ExpenseDialog'
import ExpenseDetail from './ExpenseDetail/ExpenseDetail'
import { filter, fold, isSome } from 'fp-ts/lib/Option'
import { map, mergeMap } from 'rxjs/operators'
import { of } from 'rxjs'

type KittyDetailProps = {
    kitty: Kitty
}

export default function KittyDetail({ kitty }: KittyDetailProps): JSX.Element {
    const kittenService = useKittenService()
    const [isFormOpen, setIsFormOpen] = useState(false)

    const funds = useObservable(
        () => kittenService.getKittySelected$().pipe(
            mergeMap(fold(
                () => of(0),
                (kitty) => kittenService.getFundsOfKitty$(kitty.id)
            ))
        ),
        0
    )

    const handleMakeSavings = (amount: number) => {
        kittenService.createSavingsToday({ kittyId: kitty.id, amount })
    }

    return (
        <div className="or-column">
            <div>{kitty.name}</div>
            <div>{funds}</div>
            <button className="or-button" onClick={() => setIsFormOpen(true)}>New expense</button>
            <button className="or-button" onClick={() => handleMakeSavings(1000)}>+10</button>
            <button className="or-button" onClick={() => handleMakeSavings(-1000)}>-10</button>
            <ExpenseDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} kittyId={kitty.id} />
            <div className="or-column">
                {kitty.expenses.map(expenseId => <ExpenseDetail key={expenseId} expenseId={expenseId} />)}
            </div>
        </div>
    )
}
