

const express = require('express');
const { createUser, editUser, deleteUser, getUser, getAllUsers, login} = require('../controllers/user.controller'); // this line of code imports the functions from the user.controller.js file in the controllers folder. These functions are responsible for handling the logic of creating, editing, deleting, and retrieving users from the database. We will use these functions as callbacks for our routes in this router.
const router = express.Router();


router.post('/register', createUser)
router.patch('/edituser/:id', editUser) // we use patch method to edit a user because we are only updating specific fields, not the entire user document.

router.delete("/deleteuser/:id", deleteUser)
router.get("/getuser/:id", getUser)
router.get("/getallusers", getAllUsers)

router.post("/login", login)

module.exports = router  // this line of code exports the router object so that it can be used in other files, such as index.js, where we will import it and use it to handle routes related to user operations.