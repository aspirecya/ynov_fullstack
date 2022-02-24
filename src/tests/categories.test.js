const axios = require("axios");

let token = "";
let categoryID = "";
let productID = "";
let ProductName = "15156132184613";
let ProductImg =
    "https://variety.com/wp-content/uploads/2021/07/Rick-Astley-Never-Gonna-Give-You-Up.png?w=1024";


describe("Categories tests", () => {
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

    it('[FAILING] tests without token in', async () => {
        const response = await axios({
            url: 'http://localhost:3030/api/v1/categories',
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
            url: 'http://localhost:3030/api/v1/categories',
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
        expect(response.data.success).toBeTruthy();
        expect(response.data.message).toBe("Category has been created.");
        expect(response.data.category).toEqual(expect.any(Object));
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
        expect(response.data.success).toBeTruthy();
        expect(response.data.message).toBe("Categories have been fetched.");
        expect(response.data.category).toEqual(expect.any(Object));
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
        expect(response.data.success).toBeTruthy();
        expect(response.data.message).toBe("Category has been fetched.");
        expect(response.data.category).toEqual(expect.any(Object));
    });

    it("[FAILING] findById Category", async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/category/fakeid`,
            method: "GET",
            headers: {
                "x-access-token": token,
            },
        })
            .catch((err) => {
                expect(err.response.status).toBe(500);
                expect(err.response.data.success).toBeFalsy();
                expect(err.response.data.message).toBe("An error has occurred while fetching the category.");
            });
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
        expect(response.data.success).toBeTruthy();
        expect(response.data.message).toBe("Category have been updated.");
        expect(response.data.category).toEqual(expect.any(Object));
    });

    it("[FAILING] findByIdAndUpdate Category", async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/category/fakeid`,
            method: "PATCH",
            headers: {
                "x-access-token": token,
            },
        })
            .catch((err) => {
                expect(err.response.status).toBe(500);
                expect(err.response.data.success).toBeFalsy();
                expect(err.response.data.message).toBe("An error has occurred while updating the category.");
            });
    });

    it("[FAILING] delete Category", async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/category/fakeid`,
            method: "DELETE",
            headers: {
                "x-access-token": token,
            },
        })
            .catch((err) => {
                expect(err.response.status).toBe(500);
                expect(err.response.data.success).toBeFalsy();
                expect(err.response.data.message).toBe("An error has occurred while deleting the category.");
            });
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
        expect(response.data.success).toBeTruthy();
        expect(response.data.message).toBe("Category has been deleted.");
        expect(response.data.category).toEqual(expect.any(Object));
    });
})