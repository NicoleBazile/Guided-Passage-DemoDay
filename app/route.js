
//Patient routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    //Patient
    app.get('/patient_profile', isLoggedIn, function(req, res) {
        db.collection('patientRecords').find({'userId': `${req.user._id}`}).toArray((err, result) => {
          console.log(req.user);
          if (err) return console.log(err)
          res.render('patient_profile.ejs', {
            user : req.user,
            roulette: result
          })
        })
    });

    //Provider
    app.get('/profile', isLoggedIn, function(req, res) { //once you're login w a passport you'll get all the stuff about the user that is being login
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            messages: result
          })
        })
    });


    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
