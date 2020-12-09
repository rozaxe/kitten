import * as ReactHookForm from "react-hook-form"

export function useForm(...args: any) {
    const form = ReactHookForm.useForm(...args)

    return { ...form, registerRef: makeRegisterRef(form.register) }
}

function makeRegisterRef(register: any) {
    return (ref: any, ...args: any) => (node:any) => {
        register(node, ...args)
        ref.current = node
    }
}
