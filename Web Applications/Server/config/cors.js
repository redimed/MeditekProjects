/**
 * Cross-Origin Resource Sharing (CORS) Settings
 * (sails.config.cors)
 *
 * CORS is like a more modern version of JSONP-- it allows your server/API
 * to successfully respond to requests from client-side JavaScript code
 * running on some other domain (e.g. google.com)
 * Unlike JSONP, it works with POST, PUT, and DELETE requests
 *
 * For more information on CORS, check out:
 * http://en.wikipedia.org/wiki/Cross-origin_resource_sharing
 *
 * Note that any of these settings (besides 'allRoutes') can be changed on a per-route basis
 * by adding a "cors" object to the route configuration:
 *
 * '/get foo': {
 *   controller: 'foo',
 *   action: 'bar',
 *   cors: {
 *     origin: 'http://foobar.com,https://owlhoot.com'
 *   }
 *  }
 *
 *  For more information on this configuration file, see:
 *  http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.cors.html
 *
 */
var corsConfig = {
    /***************************************************************************
     *                                                                          *
     * Allow CORS on all routes by default? If not, you must enable CORS on a   *
     * per-route basis by either adding a "cors" configuration object to the    *
     * route config, or setting "cors:true" in the route config to use the      *
     * default settings below.                                                  *
     *                                                                          *
     ***************************************************************************/

    allRoutes: true,

    /***************************************************************************
     *                                                                          *
     * Which domains which are allowed CORS access? This can be a               *
     * comma-delimited list of hosts (beginning with http:// or https://) or    *
     * "*" to allow all domains CORS access.                                    *
     *                                                                          *
     ***************************************************************************/

    //For local testing
    origin: 'http://localhost:3001, http://localhost:3004, http://localhost:3006, http://localhost:3007, http://localhost:3009, ' +
        'https://localhost:3001, https://localhost:3004, https://localhost:3006, https://localhost:3007, https://localhost:3009, ' +
        'http://192.168.1.200:3001, http://192.168.1.200:3004, http://192.168.1.200:3006, http://192.168.1.200:3007, http://192.168.1.200:3009, ' +
        'http://192.168.1.216:3001, http://192.168.1.216:3004, http://192.168.1.216:3006, http://192.168.1.216:3007, http://192.168.1.216:3009, ' +
        'https://192.168.1.107:3001, https://192.168.1.107:3004, https://192.168.1.107:3006, https://192.168.1.107:3007, https://192.168.1.107:3009, ' +
        'https://192.168.1.215:3001, https://192.168.1.215:3004, https://192.168.1.215:3006, https://192.168.1.215:3007, https://192.168.1.215:3009',
    //For TestApp deployment
    //origin: 'http://testapp.redimed.com.au:3001, http://testapp.redimed.com.au:3004, http://testapp.redimed.com.au:3007, http://testapp.redimed.com.au:3009',

    /***************************************************************************
     *                                                                          *
     * Allow cookies to be shared for CORS requests?                            *
     *                                                                          *
     ***************************************************************************/

    credentials: true,

    /***************************************************************************
     *                                                                          *
     * Which methods should be allowed for CORS requests? This is only used in  *
     * response to preflight requests (see article linked above for more info)  *
     *                                                                          *
     ***************************************************************************/

    methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',

    /***************************************************************************
     *                                                                          *
     * Which headers should be allowed for CORS requests? This is only used in  *
     * response to preflight requests.                                          *
     *                                                                          *
     ***************************************************************************/

    headers: 'content-type, authorization, systemtype, deviceid, appid, useruid, filetype',

    // exposeHeaders:'filename,filetype', //TODO

    /**
     * Security level 1 (high) will respond with a 403 status code to any request 
     * from a disallowed origin prefixed with the http or https protocol. 
     * Security level 2 (very high) will do the same, 
     * but extended to all protocols (so things like Postman and curl won't work).
     */
    securityLevel: 1,
}

if (process.argv.indexOf("--allowcors") >= 0) {
    console.log("||||||||||||||||||||||| CORS: Allow all domain");
    corsConfig.origin = "*";
} 

module.exports.cors = corsConfig;