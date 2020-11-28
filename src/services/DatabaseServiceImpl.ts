import { DatabaseService } from "../models/DatabaseService";
import { Kitty } from "../models/Kitty";

export class DatabaseServiceImpl implements DatabaseService {
    selectKitties(): Promise<Kitty[]> {
        throw new Error("Method not implemented.");
    }
}
