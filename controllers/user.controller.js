const UserModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const mailSender = require('../middleware/mailer');
const otpgen = require("otp-generator")
const dotenv = require('dotenv').config()
const OTPModel = require('../models/otp.model');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODE_MAIL,
        pass: process.env.NODE_PASS,
    }
});

// HTTP status codes are used to indicate the status of a request. They are divided into five categories:
// 100-199 => informational
// 200-299 => success
// 300-399 => redirection
// 400-499 => client error
// 500-599 => server error
// 201 is the status code for created
// 202 is the status code for accepted
// 204 is the status code for no content
// 300 is the status code for redirection
// 400 is the status code for bad request
// 401 is the status code for unauthorized
//402 is the status code for payment required
// 403 is the status code for forbidden
// 404 is the status code for not found
//409 is the status code for conflict
// 422 is the status code for unprocessable entity
// 500 is the status code for internal server error

// secret and  ,jwt will help to generate a token, wjere the user can use it to make req, and the dev can decode the token to verify the user activies or request


const createUser = async (req, res) => {

    console.log("Full request body:", req.body);
    console.log("Received password:", req.body?.password)
    const { firstName, lastName, email, password } = req.body;
    // const user = UserModel.create(req.body)


    // try {
    //      const user = await UserModel.create(req.body)
    //      res.status(201).
    // }
    // catch (error){

    // }

    try {
        const saltround = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, saltround)

        const user = await UserModel.create({ firstName, lastName, email, password: hashedPassword })




        
        const renderMail = await mailSender("welcomeMail.ejs", { firstName })

        let mailOptions = {
            from: process.env.NODE_MAIL,
            to: email,   // [email, another2gmail.com, another3gmail.com] if you want to send the email to multiple recipients
            subject: `welcome, ${firstName}`,
            html: renderMail
        };

        try {
            const info = await transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }

        catch (mailError){
            console.error("error sending welcome mail", mailError)

        }


        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "5h" })

        

        res.status(201).send({
            message: 'User created successfuly',
            data: {
                lastName,
                email,
                firstName,
                roles: user.roles
            },
            token,
        })





    }

    catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(400).send({
                message: "User already registered"
            })
        }

        res.status(500).send({
            message: 'User creation failed',
            error: error.message
        })
    }

}

const login = async (req, res) => {

    const { email, password } = req.body

    try {
        const isUser = await UserModel.findOne({ email })

        if (!isUser) {
            console.log("oooooooo");

            return res.status(404).send({
                message: "Invalid credentials"
            })
        }

        const isMatch = await bcrypt.compare(password, isUser.password)
        if (!isMatch) {
            return res.status(404).send({
                message: "Invalid Credentials"
            })
        }

        const token = await jwt.sign({ id: isUser._id, roles: isUser.roles }, process.env.JWT_SECRET, { expiresIn: "5h" })


        res.status(200).send({
            message: "User logged in successfully",
            data: {
                email: isUser.email,
                roles: isUser.roles,
                firstName: isUser.firstName,
                lastName: isUser.lastName
            },
            token
        })
    }


    catch (error) {
        console.log(error);

        res.status(400).send({
            message: 'Invalid credential',
            error: error.message
        })
    }


}

const editUser = async (req, res) => {
    const { firstName, lastName } = req.body;
    const { id } = req.params;
    try {
        let allowedUpdates = {
            ...(firstName && { firstName }), // this means if firstName exists in the req body, then we add it to the allowedUpdates object, otherwise we ignore it. This is a way to only update the fields that are provided in the req body.
            ...(lastName && { lastName })
        }
        const newUser = await UserModel.findByIdAndUpdate(id, allowedUpdates)
        res.status(200).send({
            message: 'User updated successfuly',

        })
    }

    catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'User update failed',

        })
    }

}


const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await UserModel.findByIdAndDelete(id)
        res.status(200).send({
            message: 'User deleted successfuly',
        })
    }

    catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'User deletion failed',

        })
    }
}

const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const getUser = await UserModel.findById(id)
        res.status(200).send({
            message: 'User retrieved successfuly',
            data: getUser
        })


    }

    catch (error) {

        console.log(error);
        res.status(400).send({
            message: 'User retrieval failed',
        })
    }

}
// req.body is the data that is sent in the request body, it is usually used for POST and PATCH requests to send data to the server.
//  req.params is the data that is sent in the URL parameters, it is usually used for GET and DELETE requests to specify which resource we want to retrieve or delete. In this case, we are using req.params to get the id of the user that we want to retrieve or delete.
const getAllUsers = async (req, res) => {

    const user = req.user.roles

    try {
        if (user !== "admin") {
            res.status(403).send({
                message: "Forbidden request"
            })

            return
        }
        const getFullUsers = await UserModel.find().select('-password -roles') // this means we want to exclude the password and roles fields from the result, because we don't want to send them to the client for security reasons.
        res.status(200).send({
            message: 'Users retrieved successfuly',
            data: getFullUsers
        })
    }

    catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'Users retrieval failed',
        })
    }
}

const verifyUser = async (req, res, next) => {
    const token = req.headers['authorization'].split(" ")[1] ? req.headers['authorization'].split(" ")[1] : req.headers['authorization'].split(" ")[0]


    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {

        if (err) {
            res.status(401).send({
                message: "user unauthorized"
            })

            return;
        }


        console.log(decoded);
        req.user = decoded

        next()

    })


}

const getMe = async (req, res) => {

    console.log(req.user);

    try {
        const user = await UserModel.findById(req.user.id).select("-password")

        res.status(200).send({
            message: "user retrieved successfully",
            data: user
        })
    }
    catch (error) {


        res.status(401).send({
            message: "User not found"
        })

    }


}




const requestOTP = async (req, res) => {
    const { email } = req.body
    try {
        // save their otp and mail in the db
        // send them a mail with the otp


        const isUser = await UserModel.findOne({ email })
        if (!isUser) {
            res.status(401).send({
                message: "account with this email does not exist, please register",

            })
            return
        }



        const sendOTP = otpgen.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digit: true })

        const user = OTPModel.create({
            email: email,
            otp: sendOTP
        })
        const otpMail = await mailSender("otpMail.ejs", { otp: sendOTP })


        res.status(200).send({
            message: "OTP sent to your email",

        })

        const renderMail = await mailSender("otpMail.ejs", { otp: sendOTP })


        let mailOptions = {
            from: process.env.NODE_MAIL,
            to: email,   // [email, another2gmail.com, another3gmail.com] if you want to send the email to multiple recipients
            subject: "OTP for password reset",
            html: renderMail
        };


        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });



    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            message: "OTP request failed"
        })
    }

}
const forgotPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body

    try {
        const isUser = await OTPModel.findOne({ email })

        if (!isUser) {
            res.status(404).send({
                message: "Invalid OTP"
            })

            return
        }

        let isMatch = (otp === isUser.otp)
        if (!isMatch) {
            res.status(404).send({
                message: "Invalid OTP"
            })

            return
        }

        const saltround = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, saltround)
        const user = await UserModel.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true })

        res.status(200).send({
            message: "password updated successfully"
        })

    }

    catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Password reset failed"
        })
    }
}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body


    try {
        const isUser = await UserModel.findById(req.user.id)

        if (!isUser) {
            res.status(404).send({
                message: "User not found"
            })
            return
        }

        const isMatch = await bcrypt.compare(oldPassword, isUser.password)

        if (!isMatch) {
            res.status(404).send({
                message: "Invalid old password"
            })
            return
        }

        const saltround = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, saltround)
        const user = await UserModel.findOneAndUpdate({ _id: req.user.id }, { password: hashedPassword }, { new: true })


    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Failed to change password"
        })
    }

}




module.exports = {
    createUser, editUser, deleteUser, getUser, getAllUsers, login, verifyUser, getMe, requestOTP, forgotPassword, changePassword
}
