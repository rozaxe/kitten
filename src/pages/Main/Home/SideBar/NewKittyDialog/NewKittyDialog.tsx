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

type NewKittyDialogProps = {
    isOpen: boolean
    onClose: () => void
}

const newKittyFormSchema = object({
    name: string().required(),
})

export default function NewKittyDialog({ isOpen, onClose }: NewKittyDialogProps): JSX.Element {
    return (
        <Dialog isOpen={isOpen} onClose={onClose} className="or-theme--light max-w-9/12g">
            <NewKittyForm onClose={onClose} />
        </Dialog>
    )
}

function NewKittyForm({ onClose }: any) {
    const kittenService = useKittenService()

    const { register, handleSubmit, formState, watch } = useForm({
        mode: 'onChange',
        resolver: yupResolver(newKittyFormSchema),
    })

    const nameRef = useRef<HTMLInputElement | null>()

    useEffect(() => {
        nameRef.current?.focus()
    }, [])

    const onSubmit = (values: any) => {
        kittenService.createKitty(values)
        onClose()
    }

    return (
        <>
            <div className="or-dialog__header px-1">New kitty</div>
            <form onSubmit={handleSubmit(onSubmit)} className="or-column">
                <div className="or-dialog__content or-column">
                    <label className="app-label">
                        Name
                        <input className="or-input" placeholder="Name" name="name" ref={(node) => {
                            register(node, { required: true })
                            nameRef.current = node
                        }} />
                    </label>
                </div>
                <div className="or-row-reverse p-1">
                    <input className="or-button--primary min-w-2/12g" type="submit" value="Create" disabled={!formState.isValid} />
                    <button type="button" className="or-button min-w-2/12g" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </>
    )
}
