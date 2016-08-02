module.exports = {
    'post /api/booking/list': {
        controller: 'Booking/BookingController',
        action: 'GetListBooking'
    },
    'post /api/booking/create': {
        controller: 'Booking/BookingController',
        action: 'RequestBooking'
    },
    'post /api/booking/update': {
        controller: 'Booking/BookingController',
        action: 'UpdateRequestBooking'
    },
    'get /api/booking/detail/:UID': {
        controller: 'Booking/BookingController',
        action: 'GetDetailBooking'
    },
    'get /api/booking/destroy/:UID': {
        controller: 'Booking/BookingController',
        action: 'DestroyBooking'
    },
    'post /api/booking/update/status': {
        controller: 'Booking/BookingController',
        action: 'UpdateStatusBooking'
    },
    'post /api/booking/check-time': {
        controller: 'Booking/BookingController',
        action: 'CheckTimeBooking'
    },
    'post /api/booking/get-doctor-has-appt': {
        controller: 'Booking/BookingController',
        action: 'GetListDoctorHasAppt'
    },
};
