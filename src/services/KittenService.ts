import { fold, fromNullable, isNone, none, Option, some } from 'fp-ts/lib/Option'
import _map from 'lodash-es/map'
import _reduce from 'lodash-es/reduce'
import _isEqual from 'lodash-es/isEqual'
import { DateTime } from 'luxon'
import { createStore, Store } from 'r-reactive-store'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { distinctUntilChanged, filter, map, mergeMap, startWith, tap } from 'rxjs/operators'
import { v4 as uuidv4 } from 'uuid'
import { DatabaseService } from '../models/DatabaseService'
import { Expense } from '../models/Expense'
import { Funds } from '../models/Funds'
import { Kitty } from '../models/Kitty'
import { Savings } from '../models/Savings'
import { isNotNull } from '../utils/isNotNull'

type KittenCollections = {
    kitties: Kitty
    savings: Savings
    expenses: Expense
    funds: Funds
}

export class KittenService {

    private store: Store<KittenCollections>
    private kittySelected$ = new BehaviorSubject<Option<string>>(none)
    private locale: string = 'en-US'
    private currency: string = 'USD'
    private currencyFactor: number = 0

    constructor(private databaseService: DatabaseService) {
        this.store = createStore('kitties', 'savings', 'expenses', 'funds')
        this.databaseService.selectKitties().then(kitties => {
            kitties.forEach(this.store.kitties.create)
        })
        this.computeLocale()
        
    }

    private computeLocale = () => {
        this.locale = navigator.language
        this.computeCurrency()
        this.computeCurrencyFactor()
    }

    private computeCurrency = () => {
        function localeToCurrency(locale: string) {
            switch (locale) {
                case 'fr':
                case 'fr-FR':
                    return 'EUR'
                default:
                    return 'USD'
            }
        }
        this.currency = localeToCurrency(this.locale)
    }

    private computeCurrencyFactor = () => {
        const priceOfOne = new Intl.NumberFormat(this.locale, { style: 'currency', currency: this.currency }).format(1)
        const numberOfZero = (priceOfOne.match(/0/g) ?? []).length
        this.currencyFactor = 10 ** numberOfZero
    }

    //#region Kitties

    getKittiesId$ = (): Observable<string[]> => {
        return this.store.kitties.getAll$().pipe(
            map(kitties => kitties.filter(kitty => !kitty.archived)),
            map(kitties => kitties.map(kitty => kitty.id)),
            distinctUntilChanged(_isEqual)
        )
    }

    //#endregion

    //#region Kitty

    getKitty$ = (id: string): Observable<Kitty> => {
        return this.store.kitties.get$(id).pipe(
            filter(isNotNull),
        )
    }

    getSomeKitty$ = (id: string): Observable<Option<Kitty>> => {
        return this.getKitty$(id).pipe(
            map(some),
        )
    }

    createKitty = (values: Pick<Kitty, 'name'>): Kitty => {
        const kitty = { ...values, archived: false, id: uuidv4(), expenses: [], savings: [] }
        this.store.kitties.create(kitty)
        return kitty
    }

    //#endregion

    //#region Savings
    
    createSavings = (values: Omit<Savings, 'id'>): Savings => {
        this.assertKittyExists(values.kittyId)
        const kitty = this.store.kitties.get(values.kittyId)!
        const optionSavings = this.getSavingsOfDay(kitty.id, values.date)
        let savingsId = isNone(optionSavings) ? uuidv4() : optionSavings.value.id;
        if (isNone(optionSavings)) {
            this.store.savings.create({ id: savingsId, kittyId: values.kittyId, amount: 0, date: values.date })
            this.store.kitties.patch(kitty.id, { savings: [ ...kitty.savings, savingsId ]})
        }
        const savings = this.store.savings.get(savingsId)!
        return this.store.savings.patch(savings.id, { amount: savings.amount + values.amount })
    }

    createSavingsToday = (values: Pick<Savings, 'kittyId' | 'amount'>): Savings => {
        return this.createSavings({ ...values, date: new Date() })
    }

    private getSavingsOfDay = (kittyId: string, date: Date): Option<Savings> => {
        this.assertKittyExists(kittyId)
        const kitty = this.store.kitties.get(kittyId)!
        const savings = kitty.savings.map(id => this.store.savings.get(id)!)
        return fromNullable(
            savings.find(s => DateTime.fromJSDate(s.date).hasSame(DateTime.fromJSDate(date), 'day'))
        )
    }

    //#endregion

    //#region Expense

    createExpense = (values: Omit<Expense, 'id'>): Expense => {
        this.assertKittyExists(values.kittyId)
        const kitty = this.store.kitties.get(values.kittyId)!
        const expense = { ...values, id: uuidv4() }
        this.store.expenses.create(expense)
        this.store.kitties.patch(kitty.id, { expenses: [ ...kitty.expenses, expense.id ] })
        return expense
    }

    removeExpense = (id: string): void => {
        this.assertExpenseExists(id)
        const expense = this.store.expenses.get(id)!
        const kitty = this.store.kitties.get(expense.kittyId)!
        this.store.expenses.remove(id)
        this.store.kitties.patch(kitty.id, { expenses: kitty.expenses.filter(i => i !== id) })
    }

    //#endregion

    //#region Funds

    createFunds = (values: Omit<Funds, 'id'>): Funds => {
        const optionFunds = this.getFundsOfDay(values.date)
        let fundsId = isNone(optionFunds) ? uuidv4() : optionFunds.value.id;
        if (isNone(optionFunds)) {
            this.store.funds.create({ id: fundsId, amount: 0, date: values.date })
        }
        const funds = this.store.funds.get(fundsId)!
        return this.store.funds.patch(funds.id, { amount: values.amount })
    }

    createFundsToday = (values: Omit<Funds, 'id' | 'date'>): Funds => {
        return this.createFunds({ ...values, date: new Date() })
    }
    
    private getFundsOfDay = (date: Date): Option<Funds> => {
        const funds = this.store.funds.getAllIds().map(id => this.store.funds.get(id)!)
        return fromNullable(
            funds.find(f => DateTime.fromJSDate(f.date).hasSame(DateTime.fromJSDate(date), 'day'))
        )
    }

    //#endregion

    private assertKittyExists = (id: string) => {
        if (this.store.kitties.get(id) == null) {
            throw 'Kitty does not exists !'
        }
    }

    private assertExpenseExists = (id: string) => {
        if (this.store.expenses.get(id) == null) {
            throw 'Expense does not exists !'
        }
    }
    //#region Utils



    //#endregion

    private getExpensesOfKitty$ = (kittyId: string): Observable<Expense[]> => {
        return this.getKitty$(kittyId).pipe(
            mergeMap(kitty => combineLatest(
                _map(
                    kitty.expenses,
                    expenseId => this.getExpense$(expenseId)
                )
            ).pipe(
                startWith([])
            ))
        )
    }

    private getSavingsOfKitty$ = (kittyId: string): Observable<Savings[]> => {
        return this.getKitty$(kittyId).pipe(
            mergeMap(kitty => combineLatest(
                _map(
                    kitty.savings,
                    savingsId => this.getSavings$(savingsId)
                )
            ))
        )
    }

    getFundsOfKitty$ = (kittyId: string): Observable<number> => {
        return combineLatest([
            this.getSavingsOfKitty$(kittyId),
            this.getExpensesOfKitty$(kittyId)
        ]).pipe(
            startWith([], []),
            map(([savings, expenses]) => {
                const sumOfSavings = this.sumOfAmount(savings)
                const sumOfExpenses = this.sumOfAmount(expenses)
                return sumOfSavings - sumOfExpenses
            })
        )
    }

    getExpense$ = (id: string): Observable<Expense> => {
        return this.store.expenses.get$(id).pipe(
            filter(isNotNull)
        )
    }

    getSomeExpense$ = (id: string): Observable<Option<Expense>> => {
        return this.getExpense$(id).pipe(
            map(some),
        )
    }

    getSavings$ = (id: string): Observable<Savings> => {
        return this.store.savings.get$(id).pipe(
            filter(isNotNull)
        )
    }

    getAllSavings$ = (): Observable<Savings[]> => {
        return this.store.savings.getAllIds$().pipe(
            mergeMap(ids => combineLatest(
                _map(
                    ids,
                    id => this.getSavings$(id)
                )
            ))
        )
    }

    setKittySelected = (kittyId: string) => {
        this.kittySelected$.next(some(kittyId));
    }

    getTreasury$ = (): Observable<number> => {
        return combineLatest([
            this.getLastFunds$(),
            this.getAllSavings$()
        ]).pipe(
            map(([funds, savings]) => funds.amount - this.sumOfAmount(savings)),
        )
    }

    getLastFunds$ = (): Observable<Funds> => {
        return this.getFunds$().pipe(
            map(this.older)
        )
    }

    getLastMonthsLastFunds$ = (): Observable<Funds> => {
        return this.getFunds$().pipe(
            map(funds => funds.filter(f => DateTime.fromJSDate(f.date).startOf('month') < DateTime.local().startOf('month'))),
            filter((funds) => funds.length > 0),
            map(this.older)
        )
    }

    private getFunds$ = (): Observable<Funds[]> => {
        return this.store.funds.getAllIds$().pipe(
            mergeMap(ids => combineLatest(
                _map(
                    ids,
                    id => this.store.funds.get$(id).pipe(
                        filter(isNotNull)
                    )
                )
            )),
        )
    }

    getKittySelected$ = (): Observable<Option<Kitty>> => {
        return this.kittySelected$.pipe(
            mergeMap(fold(
                () => of(none),
                kittyId => this.getSomeKitty$(kittyId)
            ))
        )
    }

    formatPrice = (amount: number): string => {
        return new Intl.NumberFormat(this.locale, { style: 'currency', currency: this.currency }).format(amount / this.currencyFactor)
    }

    formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat(this.locale, { year: 'numeric', month: 'long', day: 'numeric'}).format(date)
    }

    formatDateInputValue = (date: Date): string => {
        return DateTime.fromJSDate(date).toISODate()
    }

    currencyToInteger = (amount: number): number => {
        return Math.ceil(amount * this.currencyFactor)
    }

    private sumOfAmount = (items: Array<{ amount: number }>): number => {
        return _reduce(items, (acc, i) => acc + i.amount, 0)
    }

    private older = <T>(items: Array<T & { date: Date }>): T => {
        return items.reduce((a, b) => a.date > b.date ? a : b)
    }
}
