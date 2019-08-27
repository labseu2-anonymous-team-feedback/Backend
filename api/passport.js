const passport = require('passport');
const { Strategy: GoogleTokenStrategy } = require('passport-google-token');

const GoogleTokenStrategyCallback = (
  accessToken,
  refreshToken,
  profile,
  done
) =>
  done(null, {
    accessToken,
    refreshToken,
    profile
  });

passport.use(
  new GoogleTokenStrategy(
    {
      clientID:
        '284224854797-r67pm253o7rj7f5nmfck95n7i2ufrcb0.apps.googleusercontent.com',
      clientSecret: 'G2n9133kSvLJTb6fl4m73gf6'
    },
    GoogleTokenStrategyCallback
  )
);

const authenticateGoogle = (req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      'google-token',
      { session: false },
      (err, data, info) => {
        if (err) reject(err);
        resolve({ data, info });
      }
    )(req, res);
  });

module.exports = { authenticateGoogle };
