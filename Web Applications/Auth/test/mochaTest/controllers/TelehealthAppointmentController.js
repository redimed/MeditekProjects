var request = require('supertest');
var assert = require('assert');
describe('appointment-telehealth-request', function() {
    var agent = request.agent('http://localhost:3005')
    var token;
    var newUser = [{
        UserName: 'admin_test1',
        Password: '1234567',
        systemtype: 'WEB',
        value: '200'
    }];
    newUser.forEach(function(data) {
        describe('RequestTelehealthAppointment', function() {
            var token = null;
            before(function(done) {
                agent.post('/api/login')
                    .send({
                        UserName: data.UserName,
                        Password: data.Password
                    })
                    .set('systemtype', data.systemtype)
                    .end(function(err, res) {
                        token = res.body.token;
                        assert.equal(res.status, data.value);
                        done();
                    });
            });
            it('RequestTelehealthAppointment', function(done) {
                agent.get('/api/appointment-telehealth-detail/78d76227-fc15-4228-a83d-adac8ff0f773')
                    .set('Authorization', 'Bearer ' + token)
                    .set('systemtype', 'WEB')
                    .end(function(err, res) {
                        assert.equal(res.body.count, '200');
                        done();
                    });
            });
        });
    });
});

describe('GetListTelehealthAppointment', function() {
    var agent = request.agent('http://localhost:3005')
    var token;
    var newUser = [{
        UserName: 'admin_test1',
        Password: '1234567',
        systemtype: 'WEB',
        value:'200'
    }];
    newUser.forEach(function(data) {
        describe('GetListTelehealthAppointment()', function() {
            var token = null;
            before(function(done) {
                agent.post('/api/login')
                    .send({
                        UserName: data.UserName,
                        Password: data.Password
                    })
                    .set('systemtype', data.systemtype)
                    .end(function(err, res) {
                        token = res.body.token;
                        assert.equal(res.status, data.value);
                        done();
                    });
            });
            var dataRequestList = [{
                Limit: 20,
                Offset: 0,
                currentPage: 1,
                maxSize: 5,
                Filter: [{
                    Appointment: {
                        Enable: 'Y'
                    },

                }],
                Order: [{
                    Appointment: {
                        CreatedDate: 'DESC',
                        FromTime: null
                    }
                }],
                Search: [{
                    PatientAppointment: {
                        FullName: "111111"
                    }
                }, {
                    Doctor: {
                        FullName: "Dr Hanh"
                    }
                }],
                Range: [{
                    Appointment: {
                        CreatedDate: [null, null],
                        FromTime: [null, null]
                    }
                }],
                value:0
            }]
            dataRequestList.forEach(function(data) {
                it('GetListTelehealthAppointment', function(done) {
                    agent.post('/api/appointment-telehealth-list')
                        .send({
                            data: {
                                Limit: data.Limit,
                                Offset: data.Offset,
                                currentPage: data.currentPage,
                                maxSize: data,
                                Filter: [{
                                    Appointment: {
                                        Enable: data.Filter[0].Appointment.Enable
                                    },

                                }],
                                Order: [{
                                    Appointment: {
                                        CreatedDate: data.Order[0].Appointment.CreatedDate,
                                        FromTime: data.Order[0].Appointment.FromTime
                                    }
                                }],
                                Search: [{
                                    PatientAppointment: {
                                        FullName: data.Search[0].PatientAppointment.FullName
                                    }
                                }, {
                                    Doctor: {
                                        FullName: data.Search[1].Doctor.FullName
                                    }
                                }],
                                Range: [{
                                    Appointment: {
                                        CreatedDate: [data.Range[0].Appointment.CreatedDate[0], data.Range[0].Appointment.CreatedDate[1]],
                                        FromTime: [data.Range[0].Appointment.FromTime[0], data.Range[0].Appointment.FromTime[1]]
                                    }
                                }]
                            }
                        })
                        .set('Authorization', 'Bearer ' + token)
                        .set('systemtype', 'WEB')
                        .end(function(err, res) {
                            assert.equal(res.body.count,data.value);
                            done();
                        });
                });
            })
        });
    });
});
