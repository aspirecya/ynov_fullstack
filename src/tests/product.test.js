const axios = require("axios");
// router.post('/products/', product.create);
// router.get('/products/', product.findAll);
// router.get('/product/:id', product.findById);
// router.get('/products/seller/', product.getUserProducts);
// router.get('/products/:id/buyers/', product.getProductBuyers);
// router.get('/products/buyer/:id?', product.getBuyerProducts);
// router.get('/products/:id/buyer/add', product.addBuyerToProduct);
// router.get('/products/:id/buyer/contains', product.productHasBuyerId);
// router.get('/products/category/:id', product.getProductsByCategory);
// router.patch('/product/:id', verifyAuth, product.findByIdAndUpdate);
// router.delete('/product/:id', verifyAuth, product.findByIdAndRemove);

let token = "";
let categoryID = "";
let ProductName = "15156132184613";
let ProductImg =
  "https://variety.com/wp-content/uploads/2021/07/Rick-Astley-Never-Gonna-Give-You-Up.png?w=1024";



  
describe("Product tests ", () => {
  beforeAll(async () => {
    const login = await axios({
      url: "http://localhost:3030/api/v1/auth/login",
      method: "POST",
      data: {
        email: "test@test.fr",
        password: "test",
      },
    });

    token = login.data.token;

    const category = await axios({
      url: "http://localhost:3030/api/v1/categories/",
      method: "POST",
      headers: {
        "x-access-token": token,
      },
      body: JSON.stringify({
        name: ProductName,
        image: ProductImg,
      }),
    });
    categoryID = category.data.category._id;
  });

  afterAll( async () => {
    const category = await axios({
      url: `http://localhost:3030/api/v1/category/${categoryID}`,
      method: "DELETE",
      headers: {
        "x-access-token": token,
      },
    });
  });



    it("create product", async () => {
      const response = await axios({
        url: "http://localhost:3030/api/v1/products",
        method: "POST",
        headers: {
          "x-access-token": token,

        },
        body: JSON.stringify({
          title: ProductName,
          description: ProductName,
          color:"#000",
          size: "S",
          price: 2631561566516,
          category: ProductName,
          image: [
              ProductImg
          ],
        }),
      })
      expect(response.status).toBe(200);
    });


    it("create findAll", async () => {
        const response = await axios({
          url: "http://localhost:3030/api/v1/products",
          method: "GET",
          headers: {
            "x-access-token": token,
  
          },
        })
        console.log(response.json())
        expect(response.status).toBe(200);
        
      }); 



});
