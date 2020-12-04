import { none, Option } from "fp-ts/lib/Option";
import { Spinner } from "r-maple";
import { useObservable } from "r-use-observable";
import { useEffect } from "react";
import FoldOption from "../../components/FoldOption";
import { useKittenService } from "../../hooks/useKittenService";
import Auth from "./Auth/Auth";
import Home from "./Home/Home";

export default function Main() {
    const kittenService = useKittenService()

    const optionOnSignedIn = useObservable(
        kittenService.getSomeSignedIn$,
        none
    )

    useEffect(() => {
        kittenService.auth()
    }, [ kittenService ])

    return (
        <FoldOption
            option={optionOnSignedIn}
            onNone={() => <Spinner />}
            onSome={(signedIn) => signedIn
                ? <Home />
                : <Auth />
            }
        />
    )
}
