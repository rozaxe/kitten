import React, { Suspense } from "react";
import { DatabaseMockProvider } from "../providers/DatabaseMockProvider";
import { KittenProvider } from "../providers/KittenProvider";
import { DatabaseProvider } from "../providers/DatabaseProvider";
import { Spinner } from "r-maple";


const Main = React.lazy(() => import('./Main/Main'))

export default function Root(): JSX.Element {
    return (
        <div className="or-app or-theme--light h-screen w-screen overflow-hidden">
            <DatabaseProvider>
                <KittenProvider>
                    <Suspense fallback={<Spinner />}>
                        <Main />
                    </Suspense>
                </KittenProvider>
            </DatabaseProvider>
        </div>
    )
}


