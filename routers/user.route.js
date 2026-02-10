

const express = require('express');
const { createUser, editUser, deleteUser, getUser, getAllUsers} = require('../controllers/user.controller');
const router = express.Router();


router.post('/register', createUser)
router.patch('/edituser/:id', editUser) // we use patch method to edit a user because we are only updating specific fields, not the entire user document.

router.delete("/deleteuser/:id", deleteUser)
router.get("/getuser/:id", getUser)
router.get("/getallusers", getAllUsers)

module.exports = router