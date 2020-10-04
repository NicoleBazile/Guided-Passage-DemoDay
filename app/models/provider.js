// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var providerSchema = mongoose.Schema({

    local                    : {
        badgeNumber          : Number,
        password             : String,
    },

    google                   : {
        id                   : String,
        token                : String,
        email                : String,
        name                 : String
    }

});

// generating a hash
providerSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
providerSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Provider', providerSchema);
