
const axios = require("axios");

let token = "";
let categoryID = "";
let productID = "";
let ProductName = "15156132184613";
let ProductImg =
  "https://variety.com/wp-content/uploads/2021/07/Rick-Astley-Never-Gonna-Give-You-Up.png?w=1024";



describe("Categories tests",()=>{
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

      });

      it("create Category", async () => {
        const response = await axios({
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
          categoryID = response.data.category._id;
        expect(response.status).toBe(200);
      });
      it("findAll Category", async () => {
        const response = await axios({
            url: "http://localhost:3030/api/v1/categories/",
            method: "GET",
            headers: {
              "x-access-token": token,
            },
          });
        expect(response.status).toBe(200);
      });
      it("findById Category", async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/category/${categoryID}`,
            method: "GET",
            headers: {
              "x-access-token": token,
            },
          });
        expect(response.status).toBe(200);
      });
      it("findByIdAndUpdate Category", async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/category/${categoryID}`,
            method: "PATCH",
            headers: {
              "x-access-token": token,
            },
          });
        expect(response.status).toBe(200);
      });
      it("delete Category", async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/category/${categoryID}`,
            method: "DELETE",
            headers: {
              "x-access-token": token,
            },
          });
        expect(response.status).toBe(200);
      });
})