const axios = require('axios');

describe('user tests suite', () => {
    beforeAll(async () => {
        const response = await axios({
            url: 'http://localhost:3030/api/v1/auth/login',
            method: 'POST',
            data: {
                "email": "test@test.fr",
                "password": "test"
            }
        });
        console.log(response);
    });

    // it('tests user fetch', async () => {
    //     const response = await axios({
    //         url: 'http://localhost:3030/api/v1/users',
    //         method: 'GET',
    //
    //     })
    // });
});