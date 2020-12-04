import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { none } from 'fp-ts/lib/Option'
import { useObservable } from 'r-use-observable'
import React, { useState } from 'react'
import FoldOption from '../../../../../../components/FoldOption'
import { useKittenService } from '../../../../../../hooks/useKittenService'
import UpdateExpenseDialog from './UpdateExpenseDialog/UpdateExpenseDialog'

type ExpenseDetailProps = {
    expenseId: string    
}

export default function ExpenseDetail({ expenseId }: ExpenseDetailProps): JSX.Element {
    const kittenService = useKittenService()
    const [isEditFormOpen, setIsEditFormOpen] = useState(false)

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
                    {expense.memo}: {kittenService.formatPrice(expense.amount)} {kittenService.formatDate(expense.date)}
                    <button className="or-button" onClick={() => setIsEditFormOpen(true)}><FontAwesomeIcon icon={faEdit} /></button>
                    <UpdateExpenseDialog isOpen={isEditFormOpen} onClose={() => setIsEditFormOpen(false)} expenseId={expenseId} />
                    <button className="or-button" onClick={handleRemove}><FontAwesomeIcon icon={faTrash} /></button>
                </div>
            )}
        />
    )
}
