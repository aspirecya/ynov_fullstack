const User = require('../../models/user.model');

module.exports = {
    Query: {
        users: () => {
            return User.find();
        },
        user: (parent, args) => {
            console.log(args.id);
            return User.findById(args.id);
        },
    },
    Mutation: {
        createUser: (parent, args) => {
            const newUser = new User({
                email: args.email,
                password: args.password,
                firstname: args.firstname,
                lastname: args.lastname,
            });
            return newUser.save();
        },
    },
};
