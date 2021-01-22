const withImages = require('next-images');
const dotenv = require('dotenv');
const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = withImages({
    env: {
        FB_API_KEY: 'AIzaSyDlAARr1JyTYSYuXgCN7NgMFv47INWmsvY',
        FB_AUTH_DOMAIN: 'schefs.firebaseapp.com',
        FB_DATABASE_URL: 'https://schefs.firebaseio.com',
        FB_PROJECT_ID: 'schefs',
        FB_STORAGE_BUCKET: 'schefs.appspot.com',
        FB_MESSAGING_SENDER_ID: '1078198186854',
        FB_APP_ID: '1:1078198186854:web:4928cdbed5f459a68fcea7',
        FB_MEASUREMENT_ID: 'G-SFQEPY2PRN',

        BASE_URL: 'http://localhost:5000/',
    },

    webpack: (config) => {
        config.plugins = config.plugins || [];

        config.node = {
            fs: 'empty',
        };

        config.plugins = [
            ...config.plugins,
            new Dotenv({
                path: path.join(__dirname, '.env'),
                systemvars: true,
            }),
        ];

        return config;
    },
})
