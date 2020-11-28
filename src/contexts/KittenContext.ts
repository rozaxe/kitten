import { createContext } from "react";
import { KittenService } from "../services/KittenService";

export const KittenContext = createContext<KittenService>(null as any)
