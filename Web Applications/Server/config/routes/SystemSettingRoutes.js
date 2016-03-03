module.exports = {
    'get /api/system/setting/detail/:name': {
        controller: 'SystemSetting/SystemSettingController',
        action: 'GetValueSetting'
    }
};
