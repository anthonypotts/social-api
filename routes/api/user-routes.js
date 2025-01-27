const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend,
} = require('../../controllers/user-controller');

router
    .route('/')
    .get(getAllUsers)
    .post(createUser)

router
    .route('/:userid')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser)
    

router
    .route('/:userid/friends/:friendid')
    .post(addFriend)
    .delete(removeFriend)


module.exports = router;