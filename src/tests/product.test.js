const axios = require("axios");

let token = "";
let categoryID = "";
let productID = "";
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
      data: {
        name: ProductName,
        image: ProductImg,
      },
    });
    categoryID = category.data.category._id;
  });
  afterAll(async () => {
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
      data: {
        title: ProductName,
        description: ProductName,
        color: "#000",
        size: "S",
        price: 500,
        category: categoryID,
        image: [ProductImg],
      },
    });
    expect(response.status).toBe(200);
  });
  it("findAll product", async () => {
    const response = await axios({
      url: "http://localhost:3030/api/v1/products",
      method: "GET",
      headers: {
        "x-access-token": token,
      },
    });
    productID = response.data.product[0]._id;
    expect(response.status).toBe(200);
  });
  it("findById product", async () => {
    const response = await axios({
      url: `http://localhost:3030/api/v1/product/${productID}`,
      method: "GET",
      headers: {
        "x-access-token": token,
      },
    });
    expect(response.status).toBe(200);
  });
  it("findByCateg product", async () => {
    const response = await axios({
      url: `http://localhost:3030/api/v1/products/category/${categoryID}`,
      method: "GET",
      headers: {
        "x-access-token": token,
      },
    });
    expect(response.status).toBe(200);
  });
  it("findSellerProcducts product", async () => {
    const response = await axios({
      url: `http://localhost:3030/api/v1/products/seller/`,
      method: "GET",
      headers: {
        "x-access-token": token,
      },
    });
    expect(response.status).toBe(200);
  });
  it("findByIdAndUpdate product", async () => {
    const response = await axios({
      url: `http://localhost:3030/api/v1/product/${productID}`,
      method: "GET",
      headers: {
        "x-access-token": token,
      },
      data: {
        color: "#FFF",
      },
    });

    expect(response.status).toBe(200);
  });
  it("addBuyer product", async () => {
    const response = await axios({
      url: `http://localhost:3030/api/v1/products/${productID}/buyer/add`,
      method: "GET",
      headers: {
        "x-access-token": token,
      },
    });

    expect(response.status).toBe(200);
  });
  it("getBuyerProduct product", async () => {
    const response = await axios({
      url: `http://localhost:3030/api/v1/products/buyer`,
      method: "GET",
      headers: {
        "x-access-token": token,
      },
    });

    expect(response.status).toBe(200);
  });
  it("productHasBuyerID product", async () => {
    const response = await axios({
      url: `http://localhost:3030/api/v1/products/${productID}/buyer/contains`,
      method: "GET",
      headers: {
        "x-access-token": token,
      },
    });

    expect(response.status).toBe(200);
  });
  it("getSellerProduct product", async () => {
    const response = await axios({
      url: `http://localhost:3030/api/v1/products/seller/`,
      method: "GET",
      headers: {
        "x-access-token": token,
      },
    });

    expect(response.status).toBe(200);
  });
  it("delete product", async () => {
    const response = await axios({
      url: `http://localhost:3030/api/v1/product/${productID}`,
      method: "DELETE",
      headers: {
        "x-access-token": token,
      },
    });

    expect(response.status).toBe(200);
  });
});
