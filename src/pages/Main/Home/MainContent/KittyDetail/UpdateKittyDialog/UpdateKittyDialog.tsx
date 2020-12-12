import { yupResolver } from '@hookform/resolvers/yup'
import { Dialog } from 'r-maple'
import React from 'react'
import { object, string } from 'yup'
import { useFocusOnMountRef } from '../../../../../../hooks/useFocusOnMountRef'
import { useForm } from '../../../../../../hooks/useForm'
import { useKittenService } from '../../../../../../hooks/useKittenService'

type ExpenseDialogProps = {
    isOpen: boolean
    onClose: () => void
    kittyId: string
}

const formSchema = object({
    name: string().required(),
})

export default function UpdateKittyDialog({ isOpen, onClose, kittyId }: ExpenseDialogProps): JSX.Element {
    return (
        <Dialog isOpen={isOpen} onClose={onClose} className="max-w-9/12g">
            <UpdateKittyForm onClose={onClose} kittyId={kittyId} />
        </Dialog>
    )
}

function UpdateKittyForm({ kittyId, onClose }: any) {
    const kittenService = useKittenService()
    const kitty = kittenService.getKitty(kittyId)

    const { registerRef, handleSubmit, formState } = useForm({
        mode: 'onChange',
        defaultValues: {
            name: kitty.name
        },
        resolver: yupResolver(formSchema),
    })

    const firstInputRef = useFocusOnMountRef()

    const onSubmit = (values: any) => {
        kittenService.updateKitty(kittyId, values)
        onClose()
    }

    return (
        <>
            <div className="or-dialog__header px-1">Update kitty</div>
            <form onSubmit={handleSubmit(onSubmit)} className="or-column">
                <div className="or-dialog__content or-column">
                    <label className="app-label">
                        Name
                        <input className="or-input" placeholder="e.g. Trip to Paris" name="name" ref={registerRef(firstInputRef, { required: true})} />
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
