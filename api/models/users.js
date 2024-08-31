const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const transactionSchema = new mongoose.Schema({
    serviceType: String,
    number: String,
    amount: Number,
    totalAmount: Number,
    status: String,
    paymentMethod: String,
    transactionNumber: String,
    transactionDate: String,
})

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    pin: {
        type: String,
        default: '0000'
    },
    hash: String,
    salt: String,
    transactions: [transactionSchema]
})

userSchema.methods.savePassword = function (passwordString) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(passwordString, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function (passwordString) {
    const hash = crypto.pbkdf2Sync(passwordString, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
}

userSchema.methods.generateJWT = function() {
    let exp = (new Date().getTime() / 1000) + (60 * 60 * 2); // expires in 2 hours
    return jwt.sign(
        {
            id: this._id,
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber,
            email: this.email,
            exp
        },
        'subssum_jwt_key'
    )
}

mongoose.model('User', userSchema);