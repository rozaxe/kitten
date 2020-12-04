import { Expense } from "./Expense";
import { Funds } from "./Funds";
import { Kitty } from "./Kitty";
import { Savings } from "./Savings";

export interface DatabaseService {

    selectFunds(): Promise<Funds[]>

    selectKitties(): Promise<Kitty[]>

    insertKitty(kitty: Kitty): Promise<void>

    softDeleteKitty(id: string): Promise<void>

    patchKitty(id: string, patch: Partial<Kitty>): Promise<void>

    insertExpense(expense: Expense): Promise<void>

    upsertSavings(savings: Savings): Promise<void>

    upsertFunds(funds: Funds): Promise<void>

    deleteExpense(id: string): Promise<void>

    patchExpense(id: string, patch: Partial<Expense>): Promise<void>

    signUp(email: string, password: string): Promise<void>

    signIn(email: string, password: string): Promise<void>

}
