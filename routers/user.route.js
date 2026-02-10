

const express = require('express');
const { createUser, editUser } = require('../controllers/user.controller');
const router = express.Router();


router.post('/register', createUser)
router.patch('/edituser/:id', editUser) // we use patch method to edit a user because we are only updating specific fields, not the entire user document.


module.exports = router