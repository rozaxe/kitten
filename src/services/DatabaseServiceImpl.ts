import { createClient } from '@supabase/supabase-js';
import SupabaseClient from '@supabase/supabase-js/dist/main/SupabaseClient';
import _omit from 'lodash-es/omit'
import _pick from 'lodash-es/pick'
import { DateTime } from 'luxon';
//import ToasterService from 'r-maple/lib/Toast/ToasterService';
import { DatabaseService } from "../models/DatabaseService";
import { Expense } from '../models/Expense';
import { Funds } from '../models/Funds';
import { Kitty } from "../models/Kitty";
import { Savings } from '../models/Savings';
import { User } from '../models/User';

export class DatabaseServiceImpl implements DatabaseService {
    private supabase: SupabaseClient
    private user!: User

    constructor() {
        this.supabase = createClient(
            process.env.REACT_APP_SUPABASE_URL as string,
            process.env.REACT_APP_SUPABASE_KEY as string,
        )

        if (process.env.NODE_ENV === 'development') {
            // @ts-ignore
            window.supabase = this.supabase
        }
    }

    signUp = async (email: string, password: string) => {
        await this.supabase.auth.signUp({
            email,
            password,
        })
    }

    signIn = async (email: string, password: string) => {
        const { user, error } = await this.supabase.auth.signIn({
            email,
            password,
        })
        if (error) {
            throw error
        }
        this.user = user as any
    }

    signOut = async () => {
        await this.supabase.auth.signOut()
    }

    selectFunds = async(): Promise<Funds[]> => {
        const { data, error } = await this.supabase
            .from('funds')
            .select(`
                id,
                amount,
                date
            `)
        if (error) this.dispatchError(error)
        return Promise.resolve(data!)
    }

    selectKitties = async (): Promise<Kitty[]> => {
        const { data, error } = await this.supabase
            .from('kitties')
            .select(`
                id,
                name,
                archived,
                expenses (
                    id,
                    kitty_id,
                    memo,
                    amount,
                    date
                ),
                savings (
                    id,
                    kitty_id,
                    amount,
                    date
                )
            `)
        if (error) this.dispatchError(error)
        return Promise.resolve(data!)
    }

    insertKitty = async (kitty: Kitty): Promise<void> => {
        const { error } = await this.supabase
            .from('kitties')
            .insert([
                {
                    id: kitty.id,
                    user_id: this.user.id,
                    name: kitty.name,
                    archived: kitty.archived
                },
            ])
        if (error) this.dispatchError(error)
    }

    softDeleteKitty = async (id: string): Promise<void> => {
        const { error } = await this.supabase
            .from('kitties')
            .update({ archived: true })
            .eq('id', id)
        if (error) this.dispatchError(error)
    }

    patchKitty = async (id: string, patch: Partial<Kitty>): Promise<void> => {
        const cleanPatch = _omit(patch, ['id'])
        const { error } = await this.supabase
            .from('kitties')
            .update(cleanPatch)
            .eq('id', id)
        if (error) this.dispatchError(error)
    }

    insertExpense = async (expense: Expense): Promise<void> => {
        const { error } = await this.supabase
            .from('expenses')
            .insert([
                {
                    id: expense.id,
                    user_id: this.user.id,
                    kitty_id: expense.kittyId,
                    memo: expense.memo,
                    amount: expense.amount,
                    date: DateTime.fromJSDate(expense.date).toISODate(),
                },
            ])
        if (error) this.dispatchError(error)
    }

    patchExpense = async (id: string, patch: Partial<Expense>): Promise<void> => {
        const cleanPatch = _pick(patch, ['memo', 'date', 'amount'])
        const { error } = await this.supabase
            .from('expenses')
            .update(cleanPatch)
            .eq('id', id)
        if (error) this.dispatchError(error)
    }

    deleteExpense = async (id: string) => {
        const { error } = await this.supabase
            .from('expenses')
            .delete()
            .eq('id', id)
        if (error) this.dispatchError(error)
    }

    upsertSavings = async (savings: Savings): Promise<void> => {
        const {  error } = await this.supabase
            .from('savings')
            .insert([
                {
                    id: savings.id,
                    user_id: this.user.id,
                    kitty_id: savings.kittyId,
                    amount: savings.amount,
                    date: DateTime.fromJSDate(savings.date).toISODate(),
                },
            ],
            { upsert: true })
        if (error) this.dispatchError(error)
    }

    upsertFunds = async (funds: Funds): Promise<void> => {
        const { error } = await this.supabase
            .from('funds')
            .insert([
                {
                    id: funds.id,
                    user_id: this.user.id,
                    amount: funds.amount,
                    date: DateTime.fromJSDate(funds.date).toISODate(),
                },
            ],
            { upsert: true })
        if (error) this.dispatchError(error)
    }

    private dispatchError = (error: any) => {
        console.error(error)
        alert('Something went wrong. Please come back later.')
        throw error
    }
}
