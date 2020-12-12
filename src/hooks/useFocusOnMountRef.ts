import { useEffect, useRef } from "react"

export function useFocusOnMountRef() {
    const fieldRef = useRef<HTMLInputElement | null>()

    useEffect(() => {
        fieldRef.current?.focus()
    }, [])

    return fieldRef
}
