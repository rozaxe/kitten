import { faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import { faArchive, faCalculator, faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { fold, none } from 'fp-ts/lib/Option'
import _first from 'lodash-es/first'
import { useObservable } from 'r-use-observable'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { number, object } from 'yup'
import FoldOption from '../../../../../components/FoldOption'
import { useKittenService } from '../../../../../hooks/useKittenService'
import { useMemoObservable } from '../../../../../hooks/useMemoObservable'
import ExpenseDetail from './ExpenseDetail/ExpenseDetail'
import ExpenseDialog from './NewExpenseDialog/NewExpenseDialog'
import UpdateKittyDialog from './UpdateKittyDialog/UpdateKittyDialog'

type KittyDetailProps = {
    kittyId: string
}

const savingsFormValues = object({
    amount: number().required(),
})

export default function KittyDetail({ kittyId }: KittyDetailProps): JSX.Element {
    const kittenService = useKittenService()
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isEditFormOpen, setIsEditFormOpen] = useState(false)
    
    const { register, handleSubmit, reset } = useForm({
        mode: 'onChange',
        resolver: yupResolver(savingsFormValues),
    })

    const kittyId$ = useMemoObservable<string>(_first as any, [kittyId])

    const optionOnKitty = useObservable(
        () => kittyId$.pipe(
            switchMap(
                (kittyId) => kittenService.getSomeKitty$(kittyId)
            )
        ),
        none
    )

    const expenses = useObservable(
        () => kittyId$.pipe(
            switchMap(
                (kittyId) => kittenService.getExpensesIdOfKitty$(kittyId)
            )
        ),
        []
    )

    const funds = useObservable(
        () => kittenService.getKittySelected$().pipe(
            switchMap(fold(
                () => of(0),
                (kitty) => kittenService.getFundsOfKitty$(kitty.id)
            ))
        ),
        0
    )

    const handleMakeSavings = (amount: number) => {
        kittenService.createSavingsToday({ kittyId: kittyId, amount })
    }

    const handleMakeCustomSavings = ({ amount }: any) => {
        handleMakeSavings(kittenService.currencyToInteger(amount))
        reset({ amount: '' })
    }

    const handleArchive = () => {
        kittenService.unsetKittySelected()
        kittenService.archiveKitty(kittyId)
    }

    return (
        <FoldOption
            option={optionOnKitty}
            onSome={kitty => (
                <div className="or-column px-3 py-1">
                    <div className="or-row items-center">
                        <div className="flex-1 text-left text-xl">
                            {kitty.name}
                        </div>
                        <button className="or-button" onClick={() => setIsEditFormOpen(true)} disabled={kitty.archived}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <UpdateKittyDialog isOpen={isEditFormOpen} onClose={() => setIsEditFormOpen(false)} kittyId={kittyId} />
                        <button className="or-button" onClick={handleArchive} disabled={kitty.archived}>
                            <FontAwesomeIcon icon={faArchive} />
                        </button>
                    </div>
                    <div className="or-divider my-4" />
                    <div className="or-row items-center">
                        <div className="text-2xl">{kittenService.formatPrice(funds)}</div>
                        <div className="flex-1" />

                        <button className="or-button--primary" onClick={() => handleMakeSavings(1000)}>+{kittenService.formatPriceWithoutFraction(1000)}</button>
                        <button className="or-button--primary" onClick={() => handleMakeSavings(5000)}>+{kittenService.formatPriceWithoutFraction(5000)}</button>

                        <button className="or-button" onClick={() => handleMakeSavings(-1000)}>-{kittenService.formatPriceWithoutFraction(1000)}</button>
                        <button className="or-button" onClick={() => handleMakeSavings(-5000)}>-{kittenService.formatPriceWithoutFraction(5000)}</button>

                        <div className="or-divider mx-2" />
                        <form className="or-row" onSubmit={handleSubmit(handleMakeCustomSavings)}>
                            <input className="or-input" name="amount" step="any" placeholder={`+${kittenService.formatPriceWithoutFraction(4200)}`} ref={register({ required: true })} />
                            <button type="submit" className="or-button">
                                <FontAwesomeIcon icon={faCalculator} />
                            </button>
                        </form>
                    </div>
                    <div className="or-divider my-4" />
                    <div className="or-column max-w-12g w-full mx-auto">
                        <button className="or-button self-end w-4/12g" onClick={() => setIsFormOpen(true)}>
                            <FontAwesomeIcon icon={faPlusSquare} className="mr-2" />
                            New expense
                        </button>
                        <ExpenseDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} kittyId={kittyId} />
                        {expenses.map(expenseId => <ExpenseDetail key={expenseId} expenseId={expenseId} />)}
                    </div>
                </div>
            )}
        />
    )
}
