import { useContext } from "react";
import { DatabaseService } from "../models/DatabaseService";
import { DatabaseContext } from "../contexts/DatabaseContext";

export function useDatabaseService(): DatabaseService {
    return useContext(DatabaseContext)
}
