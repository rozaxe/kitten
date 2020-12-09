import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { object, string } from "yup"
import { useKittenService } from "../../../hooks/useKittenService"
import CheckEmailDialog from "./CheckEmailDialog/CheckEmailDialog"

const authFormValues = object({
    email: string().email().required(),
    password: string().required(),
})

export default function Auth(): JSX.Element {
    const kittenService = useKittenService()
    const [disabled, setDisabled] = useState(false)
    const [isEmailInfoOpen, setIsEmailInfoOpen] = useState(false)

    const { register, handleSubmit, formState, reset } = useForm({
        mode: 'onChange',
        resolver: yupResolver(authFormValues),
    })

    const firstInputRef = useRef<HTMLInputElement | null>()

    useEffect(() => {
        firstInputRef.current?.focus()
    }, [])

    const handleSignIn = ({ email, password }: any) => {
        setDisabled(true)
        kittenService.signIn(email, password).catch(
            (error) => {
                console.log(error)
                alert('We could not logged you in. Please check your email and password.')
                reset({
                    email,
                })
                setDisabled(false)
            }
        )
    }

    const handleSignUp = ({ email, password }: any) => {
        setDisabled(true)
        kittenService.signUp(email, password)
            .then(
                () => {
                    setIsEmailInfoOpen(true)
                    reset({
                        email,
                    })
                }
            )
            .catch(
                (error) => {
                    console.log(error)
                    alert('We could not sign you up. Please come back later.')
                }
            )
    }

    return (
        <div className="or-column">
            <form onSubmit={handleSubmit(handleSignIn)} className="max-w-6/12g mx-auto w-full">
                <label className="app-label">
                    Email
                    <input className="or-input" placeholder="Email" name="email" ref={(node) => {
                        register(node, { required: true })
                        firstInputRef.current = node
                    }} />
                </label>
                <label className="app-label">
                    Password
                    <input className="or-input" placeholder="Password" type="password" name="password" ref={register({ required: true })} />
                </label>
                <div className="or-row--reverse pt-3">
                    <input className="or-button--primary flex-1" type="submit" value="Sign in" disabled={disabled || !formState.isValid} />
                    <button className="or-button flex-1" type="button" onClick={handleSubmit(handleSignUp)} disabled={disabled || !formState.isValid}>Create account</button>
                </div>
                <CheckEmailDialog isOpen={isEmailInfoOpen} onClose={() => setIsEmailInfoOpen(false)} />
            </form>
        </div>
    )
}
