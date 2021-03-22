const { Thought, User } = require('../models');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
            .sort({ createdAt: -1 })
            .then((dbThoughtData) => {
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    getThoughtById(req, res) {
        Thought.findOne({ _id: req.params.thoughtid })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought with this id!' });
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    createThought(req, res) {
        Thought.create(req.body)
            .then((dbThoughtData) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userid },
                    { $push: { thoughts: dbThoughtData._id }},
                    { new: true }
                );
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user with this id' });
                }
        
                res.json({ message: 'Success! A Thought created!' });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtid },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json( { message: 'No thought with this id!'});
                }
                res.json(dbThoughtData)
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtid })
            .then((dbThoughtData) => {
                if(!dbThoughtData) {
                    return res.status(404).json({ message: 'No thought with this id!' });
                }

                return User.findOneAndUpdate(
                    { thoughts: req.params.thoughtid },
                    { $pull: { thoughts: req.params.thoughtid }},
                    { new: true }
                );
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user with this id!' });
                }
                res.json({ message: 'Thought deleted' });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            }); 
    },

    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtid },
            { $addToSet: { reactions: req.body }},
            { runValidators: true, new: true }
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought with this id' });
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtid },
            { $pull: { reactions: { reactionId: req.params.reactionId }}},
            { runValidators: true, new: true }
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought with this id' });
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    }
}

module.exports = thoughtController;