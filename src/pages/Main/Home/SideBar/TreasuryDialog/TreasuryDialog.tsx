import { yupResolver } from '@hookform/resolvers/yup'
import { fold, none, some } from 'fp-ts/lib/Option'
import { Dialog } from 'r-maple'
import { useObservable } from 'r-use-observable'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { map } from 'rxjs/operators'
import { date, number, object, string } from 'yup'
import { useKittenService } from '../../../../../hooks/useKittenService'
import { Funds } from '../../../../../models/Funds'

type TreasuryDialogProps = {
    isOpen: boolean
    onClose: () => void
}

const treasuryFormSchema = object({
    amount: number().required(),
})

export default function TreasuryDialog({ isOpen, onClose }: TreasuryDialogProps): JSX.Element {
    return (
        <Dialog isOpen={isOpen} onClose={onClose} className="or-theme--light max-w-9/12g">
            <TreasuryForm onClose={onClose} />
        </Dialog>
    )
}

function TreasuryForm({ onClose }: any) {
    const kittenService = useKittenService()
    const optionOnLastMonthsLastFunds = useObservable(
        () => kittenService.getLastMonthsLastFunds$().pipe(
            map(some)
        ),
        none
    )

    const { register, handleSubmit, formState, watch } = useForm({
        mode: 'onChange',
        resolver: yupResolver(treasuryFormSchema),
    })

    const amountRef = useRef<HTMLInputElement | null>()

    useEffect(() => {
        amountRef.current?.focus()
    }, [])

    const onSubmit = (values: any) => {
        kittenService.createFundsToday({ ...values, amount: kittenService.currencyToInteger(values.amount) })
        onClose()
    }

    const amount = watch('amount')

    const deltaFromLastMonths = fold<Funds, number>(
        () => 0,
        (funds) => kittenService.currencyToInteger(amount || 0) - funds.amount
    )(optionOnLastMonthsLastFunds)

    return (
        <>
            <div className="or-dialog__header px-1">Set treasury</div>
            <form onSubmit={handleSubmit(onSubmit)} className="or-column">
                <div className="or-dialog__content or-column">
                    <label className="app-label">
                        Amount
                        <input className="or-input" placeholder={kittenService.formatPrice(4200000)} type="number" step="any" name="amount" ref={(node) => {
                            register(node, { required: true })
                            amountRef.current = node
                        }} />
                    </label>
                    <div className="or-text">
                        {amount === '' || deltaFromLastMonths === 0
                            ? <div className="opacity-0">S</div>
                            : <>Delta from last-month: {kittenService.formatPrice(deltaFromLastMonths)}</>
                        }
                    </div>
                </div>
                <div className="or-row--reverse p-1">
                    <input className="or-button--primary min-w-2/12g" type="submit" value="Save" disabled={!formState.isValid} />
                    <button type="button" className="or-button min-w-2/12g" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </>
    )
}
