import { useEffect, useState } from "react";
import { Observable, ReplaySubject } from "rxjs";

export function useMemoObservable<T>(fn: (...args: any[]) => T, deps: any[]): Observable<T> {
    const [observable] = useState(
        () => new ReplaySubject<T>(1)
    )

    useEffect(() => {
        const values = fn(deps)
        observable.next(values)
    }, deps)

    return observable.asObservable()
}
