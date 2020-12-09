import { Dialog } from 'r-maple'
import React from 'react'
import { date, number, object, string } from 'yup'

type CheckEmailDialogProps = {
    isOpen: boolean
    onClose: () => void
}

const formSchema = object({
    memo: string().required(),
    date: date().required(),
    amount: number().required(),
})

export default function CheckEmailDialog({ isOpen, onClose }: CheckEmailDialogProps): JSX.Element {
    return (
        <Dialog isOpen={isOpen} onClose={onClose} className="max-w-9/12g">
            <Inner onClose={onClose} />
        </Dialog>
    )
}

function Inner({ onClose }: any) {
    return (
        <>
            <div className="or-dialog__header px-1">New account registered</div>
            <div className="or-column">
                <div className="or-dialog__content or-column">
                    A confirmation email has been sent to your email. Please click the link before sign in.
                </div>
                <div className="or-row--reverse p-1">
                    <button className="or-button--primary min-w-2/12g" onClick={onClose}>Done</button>
                </div>
            </div>
        </>
    )
}
