import { Kitty } from "./Kitty";

export interface DatabaseService {

    selectKitties(): Promise<Kitty[]>

}
