import { yupResolver } from '@hookform/resolvers/yup'
import { Dialog } from 'r-maple'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { date, number, object, string } from 'yup'
import { useKittenService } from '../../../../../hooks/useKittenService'

type ExpenseDialogProps = {
    isOpen: boolean
    onClose: () => void
    kittyId: string
}

const expenseFormValues = object({
    name: string().required(),
    date: date().required(),
    amount: number().required(),
})

export default function ExpenseDialog({ isOpen, onClose, kittyId }: ExpenseDialogProps): JSX.Element {
    return (
        <Dialog isOpen={isOpen} onClose={onClose} className="max-w-9/12g">
            <ExpenseForm onClose={onClose} kittyId={kittyId} />
        </Dialog>
    )
}

function ExpenseForm({ kittyId, onClose }: any) {
    const kittenService = useKittenService()

    const { register, handleSubmit, formState } = useForm({
        mode: 'onChange',
        resolver: yupResolver(expenseFormValues),
    })

    const descriptionRef = useRef<HTMLInputElement | null>()

    useEffect(() => {
        descriptionRef.current?.focus()
    }, [])

    const onSubmit = (values: any) => {
        kittenService.createExpense({ ...values, amount: kittenService.currencyToInteger(values.amount), kittyId })
        onClose()
    }

    return (
        <>
            <div className="or-dialog__header px-1">New expense</div>
            <form onSubmit={handleSubmit(onSubmit)} className="or-column">
                <div className="or-dialog__content or-column">
                    <label className="app-label">
                        Description
                        <input className="or-input" placeholder="Name" name="name" ref={(node) => {
                            register(node, { required: true })
                            descriptionRef.current = node
                        }} />
                    </label>
                    <label className="app-label">
                        Amount
                        <input className="or-input" placeholder="Amount" type="number" name="amount" ref={register({ required: true })} />
                    </label>
                    <label className="app-label">
                        Date
                        <input className="or-input" placeholder="Date" type="date" name="date" ref={register} defaultValue={kittenService.formatDateInputValue(new Date())} />
                    </label>
                </div>
                <div className="or-row-reverse p-1">
                    <input className="or-button--primary min-w-2/12g" type="submit" value="Save" disabled={!formState.isValid} />
                    <button className="or-button min-w-2/12g" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </>
    )
}
