/**
 * Created by tannguyen on 06/07/2016.
 */
var listCrossOrigins = {
    webapp_local: 'https://localhost:3004',
    webapp_meditek: 'https://meditek.redimed.com.au:3004',
    webapp_testapp: 'https://testapp.redimed.com.au:3004'
}
module.exports = {
    crossOrigin: listCrossOrigins.webapp_local,
    noEFormAuth: false,
}