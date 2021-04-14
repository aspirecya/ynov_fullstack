const Product = require('../../models/product.model');

module.exports = {
  Query: {
    products: () => {
      return Product.find();
    },
    product: (parent, args) => {
      console.log(args.id);
      return Product.findById(args.id);
    },
  },
  Mutation: {
    createProduct: (parent, args) => {
      const newProduct = new Product({
        title: args.title,
        price: args.price,
        description: args.description,
      });
      return newProduct.save();
    },
    updateProduct: (parent, args) => {
      if(!args.id) return;
      return Product.findOneAndUpdate(
        {
          _id: args.id
        },
        {
          $set: {
            title: args.title,
            description: args.description,
            price: args.price,
            categories: args.categories,
            image: args.image
          },
        }, {new: true}, (err, Product) => {
          if (err) {
            console.log('Something went wrong when updating the user');
          }
        }
      );
    },
    deleteProduct: (parent, args) => {
      if (!args.id) return;
      return Product.findByIdAndDelete({ _id: args.id });
    }
  },
};
