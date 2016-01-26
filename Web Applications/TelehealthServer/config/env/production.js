module.exports = {
    port: 80,
    ssl: {
        key: require('fs').readFileSync(__dirname + '/ssl/star_redimed_com_au.key'),
        cert: require('fs').readFileSync(__dirname + '/ssl/star_redimed_com_au.pem')
    },
};
