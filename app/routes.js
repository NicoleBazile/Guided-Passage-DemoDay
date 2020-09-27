module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('roulette').find({'userId': `${req.user._id}`}).toArray((err, result) => {
          console.log(req.user);
          // console.log(roulette.result)
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            roulette: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.put('/bet', (req, res) => {
      let spin = Math.floor(Math.random()*37)
      console.log('the spin landed at: ' + spin + 'your choice was ' + req.body.userChoice)

      // if user wins ////////
      if (spin === parseInt(req.body.userChoice)) {
        console.log('winner, winner, winner');
        let winnings = req.body.wager * 35

        db.collection('roulette')
        .findOneAndUpdate({userId: req.body.userId}, {
          $set: {
            balance:req.body.balance+winnings
          }
        }, {
          sort: {_id: -1},
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)
          // res.send(spin)
        })
      } // end of if

      /////// if user loses
      else{
        console.log('you loss');

        db.collection('roulette')
        .findOneAndUpdate({userId: req.body.userId}, {
          $set: {
            balance:req.body.balance - req.body.wager
          }
        }, {
          sort: {_id: -1},
          upsert: true
        }, (err, result) => {
          if (err) return res.send(err)

          res.json(spin)
        })

      } // end of if

      // res.json({wager:req.body.wager})

    })

    app.delete('/messages', (req, res) => {
      db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // owners login form
        app.get('/ownersLogin', function(req, res) {
            res.render('ownersLogin.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form -> to owners page
        app.post('/ownersLogin', passport.authenticate('local-login', {
            successRedirect : '/ownersProfile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
