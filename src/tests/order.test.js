const axios = require("axios");
const jwt = require('jsonwebtoken');
const jwtConfig = require("../configs/jwt.config");
const {ORDER_SUCCESS} = require("../configs/constants.config");

describe('user tests suite', () => {
    let userInfo;
    let productId;
    let orderId;

    let orderInfo;
    let productInfo = {
        title: "test product",
        description: "jest testing product",
        color: "#ffffff",
        size: "XL",
        price: 100,
        image: [],
    };

    beforeAll(async () => {
        // admin account login
        const loginResponse = await axios({
            url: 'http://localhost:3030/api/v1/auth/login',
            method: 'POST',
            data: {
                "email": "test@test.fr",
                "password": "test"
            }
        });
        userInfo = {
            id: jwt.verify(loginResponse.data.token, jwtConfig.secret).id,
            token: loginResponse.data.token
        };

        // create fake product
        const fakeProduct = await axios({
            url: "http://localhost:3030/api/v1/products",
            method: "POST",
            headers: {
                "x-access-token": userInfo.token,
            },
            data: productInfo
        });
        productId = fakeProduct.data.product._id;
        orderInfo = {
            buyer: userInfo.id,
            product: productId,
        };
    });

    it('tests order fetching', async () => {
        const response = await axios({
            url: 'http://localhost:3030/api/v1/orders',
            method: 'GET',
            headers: {
                'x-access-token': userInfo.token,
            }
        })

        expect(response.status).toBe(200);
        expect(response.data.success).toBeTruthy();
        expect(response.data.orders).toEqual(expect.any(Array));
    });

    it('tests order creation', async () => {
        const response = await axios({
            url: 'http://localhost:3030/api/v1/orders',
            method: 'POST',
            headers: {
                'x-access-token': userInfo.token,
            },
            data: orderInfo
        });
        orderId = response.data.order._id;

        expect(response.status).toBe(200);
        expect(response.data.success).toBeTruthy();
        expect(response.data.message).toBe("The buyer has been confirmed.");
        expect(response.data.order).toEqual(expect.any(Object));
    });

    it('tests order fetching by id', async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/order/${orderId}`,
            method: 'GET',
            headers: {
                'x-access-token': userInfo.token,
            },
        });

        expect(response.status).toBe(200);
        expect(response.data.success).toBeTruthy();
        expect(response.data.message).toBe("Order has been fetched.");
        expect(response.data.order).toEqual(expect.any(Object));
    });

    it('tests order fetching by seller/buyer id', async () => {
        const response = await axios({
            url: 'http://localhost:3030/api/v1/orders/seller/',
            method: 'GET',
            headers: {
                'x-access-token': userInfo.token,
            },
        });

        expect(response.status).toBe(200);
        expect(response.data.success).toBeTruthy();
        expect(response.data.orders).toEqual(expect.any(Array));
        expect(response.data.orders.length).toBeGreaterThanOrEqual(1);
    });

    it('tests order fetching by product id', async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/order/product/${productId}`,
            method: 'GET',
            headers: {
                'x-access-token': userInfo.token,
            },
        });

        expect(response.status).toBe(200);
        expect(response.data.success).toBeTruthy();
        expect(response.data.order).toEqual(expect.any(Array));
        expect(response.data.order.length).toBeGreaterThanOrEqual(1);
    });

    it('tests order updating', async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/order/${productId}`,
            method: 'PATCH',
            headers: {
                'x-access-token': userInfo.token,
            },
            data: {
                status: ORDER_SUCCESS
            }
        });
        
        expect(response.status).toBe(200);
        expect(response.data.success).toBeTruthy();
        expect(response.data.order).toEqual(expect.any(Object));
        // expect(response.data.order.status).toBe(ORDER_SUCCESS);
    });

    it('tests order deletion', async () => {
        const response = await axios({
            url: `http://localhost:3030/api/v1/order/${orderId}`,
            method: "DELETE",
            headers: {
                "x-access-token": userInfo.token,
            },
        });

        expect(response.status).toBe(200);
        expect(response.data.success).toBeTruthy();
        expect(response.data.order).toEqual(expect.any(Object));
        expect(response.data.message).toBe("Order has been deleted.");
    });

    afterAll(async () => {
        await axios({
            url: `http://localhost:3030/api/v1/product/${productId}`,
            method: "DELETE",
            headers: {
                "x-access-token": userInfo.token,
            },
        });
    });
});