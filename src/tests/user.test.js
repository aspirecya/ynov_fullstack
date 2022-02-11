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
        const response = await axios({
            url: 'http://localhost:3030/api/v1/auth/login',
            method: 'POST',
            data: {
                "email": "test@test.fr",
                "password": "test"
            }
        });

        token = response.data.token;
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

    it("tests user fetching", async () => {
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

    afterAll(async () => {
        await axios({
            url: `http://localhost:3030/api/v1/user/${_testUserId}`,
            method: 'DELETE',
            headers: {
                'x-access-token': token,
            }
        });
    });
});