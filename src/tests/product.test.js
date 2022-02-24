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

    it('[FAILING] tests without token in', async () => {
        const response = await axios({
            url: 'http://localhost:3030/api/v1/products',
            method: 'GET',
        })
            .catch((err) => {
                expect(err.response.status).toBe(400);
                expect(err.response.data.auth).toBeFalsy();
                expect(err.response.data.message).toBe("The request has not been applied because the authentication token is missing.")
            });
    });

    it('[FAILING] tests with bad token', async () => {
        const response = await axios({
            url: 'http://localhost:3030/api/v1/products',
            method: 'GET',
            headers: {
                'x-access-token': "fake",
            }
        })
            .catch((err) => {
                expect(err.response.status).toBe(401);
                expect(err.response.data.auth).toBeFalsy();
                expect(err.response.data.message).toBe("The request has not been applied because it lacks valid authentication credentials for the target resource.")
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
        expect(response.data.message).toBe("Product has been created.");
        expect(response.data.success).toBeTruthy();
        expect(response.data.product).toEqual(expect.any(Object));
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
        expect(response.data.message).toBe("Products have been fetched.");
        expect(response.data.success).toBeTruthy();
        expect(response.data.product).toEqual(expect.any(Object));
    });

    it("[FAILING] findById product", async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/product/fakeid`,
            method: "GET",
            headers: {
                "x-access-token": token,
            },
        })
            .catch((err) => {
                expect(err.response.status).toBe(500);
                expect(err.response.data.success).toBeFalsy();
                expect(err.response.data.message).toBe("An error has occurred while fetching the product.");
            });
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
        expect(response.data.message).toBe("Product has been fetched.");
        expect(response.data.success).toBeTruthy();
        expect(response.data.product).toEqual(expect.any(Object));
    });

    it("[FAILING] findByCateg product", async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/products/category/fakeid`,
            method: "GET",
            headers: {
                "x-access-token": token,
            },
        })
            .catch((err) => {
                expect(err.response.status).toBe(500);
                expect(err.response.data.message).toBe("An error has occurred while fetching the category's products.");
            });
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
        expect(response.data).toEqual(expect.any(Object));
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
        expect(response.data).toEqual(expect.any(Object));
    });

    it("[FAILING] findByIdAndUpdate product", async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/product/fakeid`,
            method: "PATCH",
            headers: {
                "x-access-token": token,
            },
            data: {
                color: "#FFF",
            },
        })
            .catch((err) => {
                expect(err.response.status).toBe(500);
                expect(err.response.data.success).toBeFalsy();
                expect(err.response.data.message).toBe("An error has occurred while updating the product.");
            });
    });

    it("findByIdAndUpdate product", async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/product/${productID}`,
            method: "PATCH",
            headers: {
                "x-access-token": token,
            },
            data: {
                color: "#FFF",
            },
        });

        expect(response.status).toBe(200);
        expect(response.data.message).toBe("Product has been updated.");
        expect(response.data.success).toBeTruthy();
        expect(response.data.product).toEqual(expect.any(Object));
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
        expect(response.data.message).toBe("You shown your interest to the seller for the product.");
        expect(response.data.success).toBeTruthy();
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
        expect(response.data).toEqual(expect.any(Object));
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
        expect(response.data).toBeTruthy();

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
        expect(response.data).toEqual(expect.any(Object));
    });

    it("[FAILING] delete product", async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/product/fakeid`,
            method: "DELETE",
            headers: {
                "x-access-token": token,
            },
        })
            .catch((err) => {
                expect(err.response.status).toBe(500);
                expect(err.response.data.success).toBeFalsy();
                expect(err.response.data.message).toBe("An error has occurred while deleting the product.");
            });
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
        expect(response.data.message).toBe("Product has been deleted.");
        expect(response.data.success).toBeTruthy();
        expect(response.data.product).toEqual(expect.any(Object));
    });
});
