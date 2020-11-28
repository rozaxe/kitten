import React from "react";
import Home from "./Home/Home";
import { DatabaseMockProvider } from "../providers/DatabaseMockProvider";
import { KittenProvider } from "../providers/KittenProvider";

export default function Root(): JSX.Element {
    return (
        <div className="or-app or-theme--light">
            <DatabaseMockProvider>
                <KittenProvider>
                    <Home />
                </KittenProvider>
            </DatabaseMockProvider>
        </div>
    )
}
