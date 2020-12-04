
import { DatabaseService } from '../models/DatabaseService'
import { Expense } from '../models/Expense'
import { Funds } from '../models/Funds'
import { Kitty } from '../models/Kitty'
import { Savings } from '../models/Savings'

const kitties: Kitty[] = [
    { id: 'a', name: 'Trip', expenses: [], savings: [], archived: false }
]

export class DatabaseServiceMock implements DatabaseService {
    patchExpense = (id: string, patch: Partial<Expense>): Promise<void> => {
        return Promise.resolve()
    }
    
    signUp = (email: string, password: string): Promise<void> => {
        return Promise.resolve()
    }

    signIn = (email: string, password: string): Promise<void> => {
        return Promise.resolve()
    }

    softDeleteKitty = (id: string): Promise<void> => {
        return Promise.resolve()
    }

    selectFunds = (): Promise<Funds[]> => {
        return Promise.resolve([])
    }

    upsertFunds = (funds: Funds): Promise<void> => {
        return Promise.resolve()
    }

    deleteExpense = (id: string): Promise<void> => {
        return Promise.resolve()
    }


    //#region Kitty

    selectKitties = (): Promise<Kitty[]> => {
        return Promise.resolve(kitties)
    }

    insertKitty = async (kitty: Kitty): Promise<void> => {
        return Promise.resolve()
    }

    patchKitty = async () => {
        return Promise.resolve()
    }

    //#endregion

    //#region Expense

    insertExpense = async (expense: Expense): Promise<void> => {
        return Promise.resolve()
    }

    //#endregion

    upsertSavings(savings: Savings): Promise<void> {
        return Promise.resolve()
    }

    trySignIn = () => {
        return Promise.resolve()
    }
}
