
import { DatabaseService } from '../models/DatabaseService'
import { Expense } from '../models/Expense'
import { Kitty } from '../models/Kitty'

const kitties: Kitty[] = [
    { id: 'a', name: 'Trip', expenses: [], savings: [] }
]

export class DatabaseServiceMock implements DatabaseService {

    //#region Kitty

    selectKitties = (): Promise<Kitty[]> => {
        return Promise.resolve(kitties)
    }

    insertKitty = async (kitty: Kitty): Promise<void> => {
        return Promise.resolve()
    }

    //#endregion

    //#region Expense

    insertExpense = async (expense: Expense): Promise<void> => {
        return Promise.resolve()
    }

    //#endregion

    /*
    //#region Savings

    selectSavingsByKittyAndDate = async (kittyId: string, date: number): Promise<Option<SavingsDocument>> => {
        const savingsOrNull = await this.db.savings.findOne({
            selector: {
                kittyId: { $eq: kittyId },
                date: { $eq: date }
            }
        }).exec()
        return fromNullable(savingsOrNull)
    }

    selectSavings$ = (id: string): Observable<Savings> => {
        return this.db.savings.findOne().where('id').eq(id).$.pipe(
            filter(isNotNull)
        )
    }

    selectAllSavings$ = (): Observable<SavingsDocument[]> => {
        return this.db.savings.find().$
    }

    insertSavings = async (savings: Omit<Savings, 'id'>): Promise<SavingsDocument> => {
        return this.db.savings.insert({
            ...savings,
            id: uuidv4(),
        })
    }

    upsertSavings = async (savings: Omit<Savings, 'id'>): Promise<SavingsDocument> => {
        const documentOrNull = await this.db.savings.findOne().where('date').eq(savings.date).exec()
        if (documentOrNull == null) {
            return this.db.savings.insert({
                ...savings,
                id: uuidv4()
            })
        }
        return documentOrNull.update({
            $set: {
                ...savings,
            }
        })
    }

    //#endregion

    //#region Funds

    insertFunds = async (funds: Omit<Funds, 'id'>): Promise<FundsDocument> => {
        return this.db.funds.insert({
            ...funds,
            id: uuidv4(),
        })
    }

    selectLastFunds$ = (): Observable<FundsDocument> => {
        return this.db.funds.findOne().sort('date').$.pipe(
            filter(isNotNull)
        )
    }

    //#endregion
    */
}
