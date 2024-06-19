import * as passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';
import models from "../database/models";
import { IUser } from "../database/models/user";

dotenv.config();


passport.use(
  new GoogleStrategy(
   {
     clientID: process.env.GOOGLE_CLIENT_ID ?? '', 
     clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
     callbackURL: '/auth/google/callback',
   },
    async ( accessToken: any, refreshToken: any, profile: any, done: any) => {
        const database=await models();
        const email = profile.emails[0].value;
        let user = await database.user.findOne({ where: { email } });
        if (!user) {
            user = await database.user.create({ email, password: '' });
        }
        done(null, user);
    }
)
);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID ?? '',
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '',
            callbackURL: '/auth/facebook/callback',
            profileFields: ['id', 'emails', 'name'],
        },
        async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        const database=await models();
      const email = profile.emails[0].value;
      let user = await database.user.findOne({ where: { email } });
      if (!user) {
        user = await database.user.create({ email, password: '' });
      }
      done(null, user);
    }
  )
);

passport.serializeUser((user: any, done: Function) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done: Function) => {
    const database=await models();
  const user = await database.user.findByPk(id);
  done(null, user);
});

export default passport;
