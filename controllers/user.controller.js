const UserModel = require('../models/user.model')

// 100-199 => informational
// 200-299 => success
// 300-399 => redirection
// 400-499 => client error
// 500-599 => server error
// 201 is the status code for created
// 202 is the status code for accepted
// 300 is the status code for redirection
// 400 is the status code for bad request
// 401 is the status code for unauthorized
// 403 is the status code for forbidden
// 404 is the status code for not found
// 500 is the status code for internal server error


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
        const user = await UserModel.create(req.body)
        res.status(201).send({
            message: 'User created successfuly',
            data: {
                lastName,
                email,
                firstName
            }
        })

    }
    catch (error) {
        console.log(error);

        res.status(500).send({
            message: 'User creation failed',
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
    const {id} = req.params;

    try{
        const getUser = await UserModel.findById(id)
        res.status(200).send({
            message: 'User retrieved successfuly',
            data: getUser
        })
    }

    catch (error){
        console.log(error);
        res.status(400).send({
            message: 'User retrieval failed',
        })
    }

}

const getAllUsers = async (req, res) => {
    
    try{
        const getFullUsers = await UserModel.find()
        res.status(200).send({
            message: 'Users retrieved successfuly',
            data: getFullUsers
        })
    }

    catch(error){
        console.log(error);
        res.status(400).send({
            message: 'Users retrieval failed',
        })
    }
}   
    


module.exports = {
    createUser, editUser, deleteUser, getUser, getAllUsers
}
