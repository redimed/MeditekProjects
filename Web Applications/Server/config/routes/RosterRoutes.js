module.exports = {
    'post /api/roster/create': {
        controller: 'Roster/RosterController',
        action: 'RequestRoster'
    },
    'post /api/roster/update': {
        controller: 'Roster/RosterController',
        action: 'UpdateRequestRoster'
    },
    'get /api/roster/detail/:UID': {
        controller: 'Roster/RosterController',
        action: 'GetDetailRoster'
    },
    'post /api/roster/destroy': {
        controller: 'Roster/RosterController',
        action: 'DestroyRoster'
    },
    'post /api/roster/list': {
        controller: 'Roster/RosterController',
        action: 'GetListRoster'
    },
    'get /api/service/list': {
        controller: 'Roster/RosterController',
        action: 'GetListService'
    }
};
