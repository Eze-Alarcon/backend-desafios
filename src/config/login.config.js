// ===== local login =====

const salt = '$2b$10$J5ypbFVWmwBt1x7MFfGW8O'

const signedCookieName = 'jwt_authorization'

const cookieSecret = 'cookie_secret'

const secretPasswordJwt = 'jwt_secret'

// ===== github login =====

const clientID = 'Iv1.b8c81653fd21e5a6'

const clientSecret = '1e8bda31fc395c53d411451b17f1452e7abfba05'

const githubCallbackUrl = 'http://localhost:8080/api/sessions/githubcallback'

export {
  salt,
  signedCookieName,
  cookieSecret,
  secretPasswordJwt,
  clientID,
  clientSecret,
  githubCallbackUrl
}
