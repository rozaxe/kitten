import { createContext } from "react";
import { DatabaseService } from "../models/DatabaseService";

export const DatabaseContext = createContext<DatabaseService>(null as any)
