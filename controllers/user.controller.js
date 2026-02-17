const UserModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
// 403 is the status code for forbidden
// 404 is the status code for not found
// 500 is the status code for internal server error

// secret and  ,jwt will help to generate a token, wjere the user can use it to make req, and the dev can decode the token to verify the user activies or request


const createUser = async (req, res) => {
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
        const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "5h"})

        res.status(201).send({
            message: 'User created successfuly',
            data: {
                lastName,
                email,
                firstName,
                roles: user.roles
            },
            token
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

        const token = await jwt.sign({id: isUser._id}, process.env.JWT_SECRET, {expiresIn: "5h"})


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

    try {
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



module.exports = {
    createUser, editUser, deleteUser, getUser, getAllUsers, login
}
