import { none } from "fp-ts/lib/Option";
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
        if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_AUTO_SIGNIN === 'true') {
            kittenService.signIn(process.env.REACT_APP_SUPABASE_DEV_EMAIL as string, process.env.REACT_APP_SUPABASE_DEV_PASSWORD as string)
        } else {
            kittenService.auth()
        }
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
