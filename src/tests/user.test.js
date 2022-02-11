const axios = require('axios');

describe('user tests suite', () => {
    let token = "";

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
    });
});