import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
import users from '../models/users.js'

passport.use('login', new passportLocal.Strategy({
  usernameField: 'account',
  passwordField: 'password'
}, async (account, password, done) => {
  try {
    // 尋找一個帳號
    const user = await users.findOne({ account })
    if (!user) throw new Error('ACCOUNT')
    if (!bcrypt.compareSync(password, user.password)) throw new Error('PASSWORD')
    return done(null, user, null)
  } catch (error) {
    console.log(error)
    if (error.message === 'ACCOUNT') return done(null, null, { message: '帳號錯誤' })
    else if (error.message === 'PASSWORD') return done(null, null, { message: '密碼錯誤' })
    else return done(null, null, { message: '未知錯誤p-pass' })
  }
}
))

passport.use('jwt', new passportJWT.Strategy({
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
  // 略過過期檢查
  ignoreExpiration: true
}, async (req, payload, done) => {
  try {
  // jwt 解意出來 過期的日期
    // jwt 過期時間單位是秒，node.js 日期單位是毫秒
    const expired = payload.exp * 1000 < new Date().getTime()

    const url = req.baseUrl + req.path
    if (expired && url !== '/users/extend' && url !== '/user/logout') throw new Error('EXPIRED')

    const token = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    // 取得 token 後 檢查是否有這帳號存在
    const user = await users.findOne({ _id: payload._id, tokens: token })

    if (!user) throw new Error('JWT')

    return done(null, { user, token }, null)
  } catch (error) {
    console.log(error)
    if (error.message === 'EXPIRED') {
      return done(null, null, { message: 'JWT 過期' })
    } else if (error.message === 'JWT') return done(null, null, { message: 'JWT 無效' })
    else return done(null, null, { message: '未知錯誤' })
  }
}))
