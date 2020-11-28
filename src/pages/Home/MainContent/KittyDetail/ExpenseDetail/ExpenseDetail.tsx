import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { none } from 'fp-ts/lib/Option'
import { useObservable } from 'r-use-observable'
import React from 'react'
import FoldOption from '../../../../../components/FoldOption'
import { useKittenService } from '../../../../../hooks/useKittenService'

type ExpenseDetailProps = {
    expenseId: string    
}

export default function ExpenseDetail({ expenseId }: ExpenseDetailProps): JSX.Element {
    const kittenService = useKittenService()

    const optionOnExpense = useObservable(
        () => kittenService.getSomeExpense$(expenseId),
        none
    )

    const handleRemove = () => {
        kittenService.removeExpense(expenseId)
    }

    return (
        <FoldOption
            option={optionOnExpense}
            onSome={expense => (
                <div>
                    {expense.name}: {kittenService.formatPrice(expense.amount)} {kittenService.formatDate(expense.date)}
                    <button className="or-button" onClick={handleRemove}><FontAwesomeIcon icon={faTrash} /></button>
                </div>
            )}
        />
    )
}
