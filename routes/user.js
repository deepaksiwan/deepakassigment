const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getLoggedInUserDetails,
    updatePassword,
    updateUserDetails,
    getUsers,
    getAllUserByManager,
    getUser,
    adminUpdateOneUser,
    adminDeleteOneUser,
} = require('../controllers/userController');

const { isLoggedIn, customRole,} = require('../middlewares/user');

// user only routes
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotpassword').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/userdashboard').get(isLoggedIn, getLoggedInUserDetails);
router.route('/password/update').post(isLoggedIn, updatePassword);
router.route('/user/update').post(isLoggedIn, updateUserDetails);

// admin only routes
router.route('/admin/users').get(isLoggedIn, customRole('admin'), getUsers);
router.route('/admin/user/:id').get(isLoggedIn, customRole('admin'), getUser)
    .put(isLoggedIn, customRole('admin'), adminUpdateOneUser)
    .delete(isLoggedIn, customRole('admin'), adminDeleteOneUser);

// manager only route
router.route('/manager/alluser').get(isLoggedIn,customRole('manager'), getAllUserByManager);

module.exports = router;