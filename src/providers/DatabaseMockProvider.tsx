import React, { ReactNode } from 'react'
import { DatabaseContext } from '../contexts/DatabaseContext'
import { DatabaseServiceMock } from '../services/DatabaseServiceMock'

type DatabaseMockProviderProps = {
    children: ReactNode
}

export function DatabaseMockProvider({ children }: DatabaseMockProviderProps): JSX.Element {
    return (
        <DatabaseContext.Provider value={new DatabaseServiceMock()}>
            {children}
        </DatabaseContext.Provider>
    )
}