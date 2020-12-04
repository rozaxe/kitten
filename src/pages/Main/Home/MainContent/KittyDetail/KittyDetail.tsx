import { faArchive, faCalculator, faEdit } from '@fortawesome/free-solid-svg-icons'
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { yupResolver } from '@hookform/resolvers/yup'
import { fold, none } from 'fp-ts/lib/Option'
import { useObservable } from 'r-use-observable'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { number, object } from 'yup'
import FoldOption from '../../../../../components/FoldOption'
import { useKittenService } from '../../../../../hooks/useKittenService'
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


    const optionOnKitty = useObservable(
        () => kittenService.getSomeKitty$(kittyId),
        none
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
                <div className="or-column">
                    <div>
                        {kitty.name}: {kittenService.formatPrice(funds)}
                        <button className="or-button" onClick={() => setIsEditFormOpen(true)} disabled={kitty.archived}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <UpdateKittyDialog isOpen={isEditFormOpen} onClose={() => setIsEditFormOpen(false)} kittyId={kittyId} />
                        <button className="or-button" onClick={handleArchive} disabled={kitty.archived}>
                            <FontAwesomeIcon icon={faArchive} />
                        </button>
                    </div>
                    <div></div>
                    <div className="or-row">
                        <button className="or-button--primary" onClick={() => handleMakeSavings(1000)}>+10</button>
                        <button className="or-button--primary" onClick={() => handleMakeSavings(5000)}>+50</button>
                        <button className="or-button" onClick={() => handleMakeSavings(-1000)}>-10</button>
                        <form className="ml-4 or-row" onSubmit={handleSubmit(handleMakeCustomSavings)}>
                            <input className="or-input" name="amount" placeholder="+ 42" ref={register({ required: true })} />
                            <button type="submit" className="or-button">
                                <FontAwesomeIcon icon={faCalculator} />
                            </button>
                        </form>
                    </div>
                    <button className="or-button" onClick={() => setIsFormOpen(true)}>
                        <FontAwesomeIcon icon={faPlusSquare} className="mr-2" />
                        New expense
                    </button>
                    <ExpenseDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} kittyId={kittyId} />
                    <div className="or-column">
                        {kitty.expenses.map(expenseId => <ExpenseDetail key={expenseId} expenseId={expenseId} />)}
                    </div>
                </div>
            )}
        />
    )
}
