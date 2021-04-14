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
                phone: args.phone,
                address: args.address,
                admin: false,
            });

            return newUser.save();
        },
        updateUser: (parent, args) => {
            if (!args.id) return;
            return User.findOneAndUpdate(
                {
                    _id: args.id
                },
                {
                    $set: {
                        email: args.email,
                        password: args.password,
                        firstname: args.firstname,
                        lastname: args.lastname,
                        phone: args.phone,
                        address: args.address
                    },
                }, {new: true}, (err, User) => {
                    if (err) {
                        console.log('Something went wrong when updating the user');
                    }
                }
            );
        },
        deleteUser: (parent, args) => {
            if (!args.id) return;
            return User.findByIdAndDelete({ _id: args.id });
        },
    },
};
