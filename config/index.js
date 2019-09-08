let config = {
    mode: 'local',
    port: 3000,

    mongo: {
        host: '127.0.0.1',
        port: 27017,
        dbname: 'storyquiz_db',
    },

    info: {
        site_url: 'http://127.0.0.1:3000/',
        site_name: "example.io",
        domain: "127.0.0.1",
    },
    expTime: 30 * 24 * 60 * 60,

    node_mail: {
        mail_account: "", //Gmail
        password: ""
    },

    img_size: {
        w: 1080,
        h: 1920
    },

    grid_sizes: {
        size28: {w: 4, h: 7},
        size45: {w: 5, h: 9},
        size66: {w: 6, h: 11},
    },

    stripeOptions: {
        apiKey: '', 
        stripePubKey: '', 
        defaultPlan: 'Monthly',
        plans: ['Monthly', 'Annually'],
        planData: {
            'monthly': {
                name: 'Monthly',
                price: 3
            },
            'annually': {
                name: 'Annually',
                price: 2
            }
        }
    },


};

module.exports = config;
