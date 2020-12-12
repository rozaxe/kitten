import { yupResolver } from '@hookform/resolvers/yup'
import { Dialog } from 'r-maple'
import React from 'react'
import { date, number, object, string } from 'yup'
import { useFocusOnMountRef } from '../../../../../../../hooks/useFocusOnMountRef'
import { useForm } from '../../../../../../../hooks/useForm'
import { useKittenService } from '../../../../../../../hooks/useKittenService'

type UpdateExpenseDialogProps = {
    isOpen: boolean
    onClose: () => void
    expenseId: string
}

const formSchema = object({
    memo: string().required(),
    date: date().required(),
    amount: number().required(),
})

export default function UpdateExpenseDialog({ isOpen, onClose, expenseId }: UpdateExpenseDialogProps): JSX.Element {
    return (
        <Dialog isOpen={isOpen} onClose={onClose} className="max-w-9/12g">
            <UpdateExpenseForm onClose={onClose} expenseId={expenseId} />
        </Dialog>
    )
}

function UpdateExpenseForm({ expenseId, onClose }: any) {
    const kittenService = useKittenService()
    const expense = kittenService.getExpense(expenseId)

    const { register, registerRef, handleSubmit, formState } = useForm({
        mode: 'onChange',
        defaultValues: {
            memo: expense.memo,
            date: kittenService.formatDateInputValue(expense.date),
            amount: kittenService.integerToCurrency(expense.amount),
        },
        resolver: yupResolver(formSchema),
    })

    const memoRef = useFocusOnMountRef()

    const onSubmit = (values: any) => {
        kittenService.updateExpense(expenseId, { ...values, amount: kittenService.currencyToInteger(Math.abs(values.amount)) })
        onClose()
    }

    return (
        <>
            <div className="or-dialog__header px-1">New expense</div>
            <form onSubmit={handleSubmit(onSubmit)} className="or-column">
                <div className="or-dialog__content or-column">
                    <label className="app-label">
                        Description
                        <input className="or-input" placeholder="Description" name="memo" ref={registerRef(memoRef, { required: true })} />
                    </label>
                    <label className="app-label">
                        Amount
                        <input className="or-input" placeholder="Amount" type="number" name="amount" step="any" ref={register({ required: true })} />
                    </label>
                    <label className="app-label">
                        Date
                        <input className="or-input" placeholder="Date" type="date" name="date" ref={register} defaultValue={kittenService.formatDateInputValue(new Date())} />
                    </label>
                </div>
                <div className="or-row--reverse p-1">
                    <input className="or-button--primary min-w-2/12g" type="submit" value="Update" disabled={!formState.isValid} />
                    <button type="button" className="or-button min-w-2/12g" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </>
    )
}
