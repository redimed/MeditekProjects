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
    }
};
