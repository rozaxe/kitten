import React, { ReactNode } from 'react'
import { DatabaseContext } from '../contexts/DatabaseContext'
import { DatabaseServiceImpl } from '../services/DatabaseServiceImpl'

type DatabaseProviderProps = {
    children: ReactNode
}

export function DatabaseProvider({ children }: DatabaseProviderProps): JSX.Element {
    return (
        <DatabaseContext.Provider value={new DatabaseServiceImpl()}>
            {children}
        </DatabaseContext.Provider>
    )
}