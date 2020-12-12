import React from 'react'
import { fold, Option } from "fp-ts/lib/Option"

type FoldOptionProps<A> = {
    option: Option<A>
    onNone?: () => JSX.Element
    onSome?: (value: A) => JSX.Element
}

export default function FoldOption<A>({ option, onNone = () => <></>, onSome = () => <></> }: FoldOptionProps<A>): JSX.Element {
    return fold<A, JSX.Element>(
        () => onNone(),
        a => onSome(a)
    )(option)
}
