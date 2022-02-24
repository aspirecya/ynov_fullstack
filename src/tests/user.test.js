const axios = require('axios');

describe('user tests suite', () => {
    // test vars
    let testingAccount = {
        "email": "testing@account.fr",
        "password": "test",
        "firstname": "abc",
        "lastname": "abc"
    };

    let token = "";
    let _testUserId = "";


    beforeAll(async () => {
        const loginResponse = await axios({
            url: 'http://localhost:3030/api/v1/auth/login',
            method: 'POST',
            data: {
                "email": "test@test.fr",
                "password": "test"
            }
        });

        token = loginResponse.data.token;
    });

    it('[FAILING] tests without token in', async () => {
        const response = await axios({
            url: 'http://localhost:3030/api/v1/users',
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
            url: 'http://localhost:3030/api/v1/users',
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

    it('tests user fetch', async () => {
        const response = await axios({
            url: 'http://localhost:3030/api/v1/users',
            method: 'GET',
            headers: {
                'x-access-token': token,
            }
        })

        expect(response.status).toBe(200);
        expect(response.data).toEqual(expect.any(Object));
    });

    it('tests user email unique check', async () => {
        const response = await axios({
            url: 'http://localhost:3030/api/v1/users',
            method: 'POST',
            data: {
                "email": "test@test.fr",
                "password": "test",
                "firstname": "abc",
                "lastname": "abc"
            }
        })
            .catch((err) => {
                expect(err.response.data.message).toBe("The entered email is already registered.");
                expect(err.response.status).toBe(500);
            });
    });

    it('tests user creation', async () => {
        const response = await axios({
            url: 'http://localhost:3030/api/v1/users',
            method: 'POST',
            data: testingAccount
        });

        _testUserId = response.data._id;
        expect(response.status).toBe(200);
        expect(response.data).toEqual(expect.any(Object));
    });

    it("tests fetching user by id", async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/user/${_testUserId}`,
            method: 'GET',
            headers: {
                'x-access-token': token,
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.email).toEqual(testingAccount.email);
        expect(response.data.firstname).toEqual(testingAccount.firstname);
        expect(response.data.lastname).toEqual(testingAccount.lastname);
    });

    it("tests fetching[FAILING]  user by id", async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/user/fakeid`,
            method: 'GET',
            headers: {
                'x-access-token': token,
            }
        })
            .catch((err) => {
                expect(err.response.status).toBe(500);
                expect(err.response.data.message).toBe("An error has occurred while fetching the user.");
            });
    });

    it("tests fetching user by token", async () => {
        const response = await axios({
            url: "http://localhost:3030/api/v1/user/",
            method: 'GET',
            headers: {
                'x-access-token': token,
            }
        });

        expect(response.status).toBe(200);
        expect(response.data).toEqual(expect.any(Object));
    });

    it("[FAILING] tests user updating", async () => {
        let newFirstName = "cba";

        const response = await axios({
            url: `http://localhost:3030/api/v1/user/fakeid`,
            method: 'PATCH',
            headers: {
                'x-access-token': token,
            },
            data: {
                "firstname": newFirstName
            }
        })
            .catch((err) => {
                expect(err.response.status).toBe(500);
                expect(err.response.data.message).toBe("An error has occurred while updating the user.");
            });
    });

    it("tests user updating", async () => {
        let newFirstName = "cba";

        const response = await axios({
            url: `http://localhost:3030/api/v1/user/${_testUserId}`,
            method: 'PATCH',
            headers: {
                'x-access-token': token,
            },
            data: {
                "firstname": newFirstName
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.message).toBe("Account has been updated.");
        expect(response.data.success).toBeTruthy();
        expect(response.data.user.firstname).toEqual(newFirstName);
    });

    it("tests user is admin", async () => {
        const response = await axios({
            url: "http://localhost:3030/api/v1/user/isAdmin",
            method: 'GET',
            headers: {
                'x-access-token': token,
            }
        });

        expect(response.status).toBe(200);
        expect(response.data).toBeTruthy();
    });

    it("tests user deletion", async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/user/${_testUserId}`,
            method: 'DELETE',
            headers: {
                'x-access-token': token,
            }
        });

        expect(response.status).toBe(200);
        expect(response.data).toEqual(expect.any(Object));
    });
});