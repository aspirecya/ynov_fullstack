const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});

exports.geocodeUser = (user, address) => {
    client.geocode({
        params: {
            key: process.env.GOOGLE_MAP_KEY,
            address: address,
            region: 'fr'
        }
    })
        .then((r) => {
            user.geocoding.latitude = r.data.results[0].geometry.location.lat;
            user.geocoding.longitude = r.data.results[0].geometry.location.lng;
            user.save();
        })
        .catch((e) => {
            console.log(e);
        });
}

exports.geocodeProduct = (product, address) => {
    client.geocode({
        params: {
            key: process.env.GOOGLE_MAP_KEY,
            address: req.body.address,
            region: 'fr',
        }
    })
        .then((r) => {
            product.seller.geocoding.latitude = r.data.results[0].geometry.location.lat;
            product.seller.geocoding.longitude = r.data.results[0].geometry.location.lng;
            product.save();
        })
        .catch((e) => {
            console.log(e);
        });

}

exports.geocodeProductFromSeller = (product) => {
    product.geocoding = {
        latitude: product.seller.geocoding.latitude,
        longitude: product.seller.geocoding.longitude
    };
    product.save();
}

exports.geocodeAddress = (address) => {
    client.geocode({
        params: {
            key: process.env.GOOGLE_MAP_KEY,
            address: address,
            region: 'fr'
        }
    })
        .then((r) => {
            return {
                latitude: r.data.results[0].geometry.location.lat,
                longitude: r.data.results[0].geometry.location.lng
            };
        })
        .catch((e) => {
            console.log(e);
        });
}