import passport from "../loaders/passport";

import { entManager, userRepository } from "../loaders/sql"
import { AuthUser } from "../models/User";
import { Request } from "express";

const bcrypt = require('bcrypt');
const rounds = 10;

const testRec = [
    {id: 0, username: 'n', password: 'x', displayName: 'tester'}
];

export async function findOne(username: string, cb: Function) {
    username = username.toLowerCase();
    const repo = userRepository();
    const user = await repo.findOne({username: username});

    if (user?.username === username) {
        return cb(null, user);
    }

    return cb(null, null);
};

export async function findById(id: number, cb: Function) {
    const repo = userRepository();
    const user = await repo.findOne(id);
    if (user?.id === id) {
        return cb(null, user);
    }

    return cb(null, null);
};

export function comparePassword(clear: string, hashed: string): boolean {
    return bcrypt.compareSync(clear, hashed);
}

export async function addUser(username: string, password: string, displayName: string) {
    username = username.toLowerCase();
    let user = new AuthUser();
    user.username = username;
    user.password = bcrypt.hashSync(password, rounds);
    user.displayname = displayName;

    return await entManager().save(user);
};

export function userFromRequest(req: Request): AuthUser {
    return ((req as any).user as AuthUser)
}