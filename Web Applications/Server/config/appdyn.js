appdyn = require("appdynamics").profile({
    controllerHostName: 'telehealthvietnam.com.vn',
    controllerPort: 8090, // If SSL, be sure to enable the next line  
    accountName: 'customer1',
    accountAccessKey: '2a065e54-edf7-44af-8f02-dc74ce775188',
    applicationName: 'Meditek Local Server',
    tierName: 'GUI_3004_Service',
    nodeName: 'process' // The controller will automatically append the node name with a unique number
});

module.exports.appdyn=appdyn;
