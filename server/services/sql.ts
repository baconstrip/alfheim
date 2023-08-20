import {ConnectionOptions, createConnection, Connection, EntityManager, Repository} from "typeorm";
import { AuthUser } from "../models/User";

const options: ConnectionOptions = {
    type: "sqlite",
    database: `data/db.sqlite`,
    entities: [__dirname + "/../models/*.ts"],
    //logging: true,
    synchronize: true
}

// Singleton connection.
class DBConn {
    cnx!: Connection;
}
var inst: DBConn;

export default async ({}) => {
    let cnx = await createConnection(options);
    inst = new DBConn();
    inst.cnx = cnx;
   // cnx.manager.save(user).then(x => {console.log("Saved x")});
    return cnx;
}

export function entManager(): EntityManager {
    return inst?.cnx?.manager
}

export function userRepository(): Repository<AuthUser> {
    return inst?.cnx?.getRepository(AuthUser);
}