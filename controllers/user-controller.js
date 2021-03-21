const { User } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
              console.log(err);
              res.status(400).json(err);
            });
    },

    getUserById(req, res) {
        User.findOne({ _id: req.params.userid })
            .select('-__v')
            .populate('friends')
            .populate('thoughts')
            .then((dbUserData) => {
              if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
              }
              res.json(dbUserData);
            })
            .catch(err => {
              console.log(err);
              res.status(400).json(err);
            });
    },

    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    updateUser(req, res) {
        User.findOneAndUpdate({ _id: req.params.userid }, { $set: req.body }, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.userid })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    addFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userid }, { $addToSet: { friends: req.params.friendid }}, { new: true })
        .then((dbUserData) => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user with this id!' });
              }
              res.json(dbUserData);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json(err);
            });
    },

    removeFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userid }, { $pull: { friends: req.params.friendid } }, { new: true })
          .then((dbUserData) => {
            if (!dbUserData) {
              return res.status(404).json({ message: 'No user with this id!' });
            }
            res.json(dbUserData);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      }
};

module.exports = userController;