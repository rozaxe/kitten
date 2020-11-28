import React from 'react'
import { KittenContext } from "../contexts/KittenContext"
import { KittenService } from "../services/KittenService"
import { useDatabaseService } from '../hooks/useDatabaseService'

type KittenProviderProps = {
    children: JSX.Element
}

export function KittenProvider(props: KittenProviderProps): JSX.Element {
    const databaseService = useDatabaseService()
    return (
        <KittenContext.Provider value={new KittenService(databaseService)}>
            {props.children}
        </KittenContext.Provider>
    )
}