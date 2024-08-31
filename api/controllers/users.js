const mongoose = require('mongoose');
const { use } = require('passport');
const User = mongoose.model('User');


async function register(req, res) {
    // return res.json(req.body)
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.phoneNumber || !req.body.password || !req.body.passwordConfirmation) {
        return res
        .status(400)
        .json({'message': 'All fields are required'});
    }

    if (req.body.password !== req.body.passwordConfirmation) {
        return res
        .status(400)
        .json({'message': 'Passwords don\'t match'});
    }

    let userInfo = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    }

    let newUser = new User(userInfo);
    newUser.savePassword(req.body.password);

    try {
        await newUser.save();
        return res
        .status(201)
        .json({'message': 'user created'});
    } catch (e) {
        return res
        .status(400)
        .json({'message': 'Something went wrong'})
    }
}

async function login(req, res) {
    if (!req.body.email || !req.body.password) {
        return res
        .status(400)
        .json({'message': 'All fields are required'});
    }

    let user = await User.findOne({email: req.body.email});

    if (!user) {
        return res
        .status(400)
        .json({'message': 'Invalid credentials'});
    }

    if (!user.validatePassword(req.body.password)) {
        return res
        .status(400)
        .json({'message': 'Invalid credentials'});
    }

    return res
    .status(200)
    .json({token: user.generateJWT()});
}

async function changePassword(req, res) {
    if (!req.body.oldPassword || !req.body.newPassword || !req.body.passwordConfirmation) {
        return res
        .status(400)
        .json({'message': 'All fields are required'});
    }

    if (req.body.newPassword !== req.body.passwordConfirmation) {
        return res
        .status(400)
        .json({'message': 'Passwords don\'t match'});
    }

    const user = await User.findById(req.auth.id);
    if (!user.validatePassword(req.body.oldPassword)) {
        return res
        .status(400)
        .json({'message': 'Old password incorrect'});
    }

    user.savePassword(req.body.newPassword);
    await user.save();
    return res
    .status(200)
    .json({'message': 'Password changed'});
}

async function changePin(req, res) {
    if (!req.body.oldPin || !req.body.newPin || !req.body.pinConfirmation) {
        return res
        .status(400)
        .json({'message': 'All fields are required'});
    }

    if (req.body.newPin !== req.body.pinConfirmation) {
        return res
        .status(400)
        .json({'message': 'Pins don\'t match'});
    }

    const user = await User.findById(req.auth.id);
    if (user.pin !== req.body.oldPin) {
        return res
        .status(400)
        .json({'message': 'Old pin incorrect'});
    }

    user.pin = req.body.newPin;
    await user.save();
    return res
    .status(200)
    .json({'message': 'Pin changed'});
}

async function getAllTransactions(req, res) {
    const user = await User.findById(req.auth.id);

    return res
    .status(200)
    .json({'transactions': user.transactions});
}

async function airtimeToCash(req, res) {
    const user = await User.findById(req.auth.id);

    if (user.pin !== req.body.pin) {
        return res
        .status(400)
        .json({'message': 'Pin incorrect'});
    }

    const newTransaction = {
        serviceType: req.body.network+' airtime conversion',
        number: req.body.phoneNumber,
        amount: req.body.amount,
        totalAmount: req.body.amount,
        status: 'Successful',
        paymentMethod: "Transfer",
        transactionNumber: '2223445563210769090',
        transactionDate: new Date().toISOString(),
    };

    user.transactions.push(newTransaction);

    try {
        await user.save();
        return res
        .status(200)
        .json({'message': 'Transaction successful'});
    } catch (e) {
        return res
        .status(400)
        .json({'message': 'Transaction failed'})
    }
}


module.exports = {
    register,
    login,
    changePassword,
    getAllTransactions,
    airtimeToCash,
    changePin
}