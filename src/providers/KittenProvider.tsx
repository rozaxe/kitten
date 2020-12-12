import React, { ReactNode } from 'react'
import { KittenContext } from "../contexts/KittenContext"
import { KittenService } from "../services/KittenService"
import { useDatabaseService } from '../hooks/useDatabaseService'

type KittenProviderProps = {
    children: ReactNode
}

export function KittenProvider({ children }: KittenProviderProps): JSX.Element {
    const databaseService = useDatabaseService()
    return (
        <KittenContext.Provider value={new KittenService(databaseService)}>
            {children}
        </KittenContext.Provider>
    )
}