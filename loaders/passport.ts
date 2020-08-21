import * as express from 'express';
import { findOne, findById, comparePassword } from '../services/userdb';
const passport = require('passport');
let localStrategy = require('passport-local').Strategy

export default async ({app} : {app: express.Application}) => {

    passport.use(new localStrategy({
            usernameField: 'user',
            passwordField: 'pass', 
        },
        async function(username: any, password: any, done: Function) {
            await findOne(username, function(err: any, user: any) {
                if (err) { 
                    return done(err); 
                }
                if (!user) {
                    return done(null, false);
                }
                if (!comparePassword(password, user.password)) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }
    ));
    
    passport.serializeUser(function(user: any, done: any) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id: any, done:any) {
        findById(id, function(err: any, user: any) {
            if (err) {
                return done(err)
            }
            done(null, user);
        })
    });
}