const User = require('../../models/user.model');
const bcrypt = require('bcrypt');

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
            let hashedPassword = bcrypt.hashSync(args.password, 8);

            const newUser = new User({
                email: args.email,
                password: hashedPassword,
                firstname: args.firstname,
                lastname: args.lastname,
                admin: false,
            });
            return newUser.save();
        },
    },
};
