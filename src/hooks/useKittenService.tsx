import { useContext } from "react";
import { KittenService } from "../services/KittenService";
import { KittenContext } from "../contexts/KittenContext";

export function useKittenService(): KittenService {
    return useContext(KittenContext)
}
