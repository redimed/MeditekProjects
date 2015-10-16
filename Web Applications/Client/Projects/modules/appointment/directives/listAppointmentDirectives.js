var app = angular.module('app.authentication.appointment.directives.listAppoint', []);
app.directive('listAppointment', function(AppointmentService) {
    return {
        restrict: 'E',
        templateUrl: "modules/appointment/directives/templates/listAppointment.html",
        link: function (scope, $modal, $state) {
            scope.currentPage = 1;
		  	scope.numPerPage = 20;
		  	scope.maxSize = 10;
		  	scope.filteredTodos = [];
			var data = {
				patient : null
			};
			scope.infoAppointment = {
				patient: null,
				doctor:null,
				submit_from_date:null,
				submit_to_date:null,
				appointment_from_date:null,
				appointment_to_date:null
			}
			AppointmentService.loadListAppointment(data).then(function(response){
				scope.filteredTodos = response.rows;
				scope.appointments = response.rows;
				scope.$watch("currentPage + numPerPage", function() {
				    var begin = ((scope.currentPage - 1) * scope.numPerPage)
				    , end = begin + scope.numPerPage;
				    scope.appointments = scope.filteredTodos.slice(begin, end);
				});
			});
			scope.filter = function(){
				var submit_from_date = null
				var submit_to_date = null
				var appointment_from_date = null
				var appointment_to_date = null
				if(scope.infoAppointment.submit_from_date !== null){
					submit_from_date = moment(scope.infoAppointment.submit_from_date).format("YYYY-MM-DD HH:mm:ss Z");
				}
				if (scope.infoAppointment.submit_to_date !== null) {
					submit_to_date = moment(scope.infoAppointment.submit_to_date).format("YYYY-MM-DD HH:mm:ss Z");
				}
				if (scope.infoAppointment.appointment_from_date) {
					appointment_from_date = moment(scope.infoAppointment.appointment_from_date).format("YYYY-MM-DD HH:mm:ss Z");
				}
				if (scope.infoAppointment.appointment_to_date !== null) {
					appointment_to_date = moment(scope.infoAppointment.appointment_to_date).format("YYYY-MM-DD HH:mm:ss Z");
				};
				console.log(submit_from_date)
				console.log(submit_to_date)
				var postData = {
				limit : 100,
				Search: [
					{
						Patient:{
				       		FullName:scope.infoAppointment.patient
				       	}
			        },
			       	{
				       	Doctor:{
				       		FullName:scope.infoAppointment.doctor
				       	}
				    }
				],
				 Range: 
					[
					    {
					    	Appointment:
					        {
					             RequestDate: [submit_from_date,submit_to_date],
					             FromTime: [appointment_from_date,appointment_to_date]
					        }
					    }
					 ]
			}
			AppointmentService.loadListAppointment(postData).then(function(response){
				scope.filteredTodos = response.rows;
				scope.appointments = response.rows;
				scope.$watch("currentPage + numPerPage", function() {
				    var begin = ((scope.currentPage - 1) * scope.numPerPage)
				    , end = begin + scope.numPerPage;
				    scope.appointments = scope.filteredTodos.slice(begin, end);
				});

				scope.Correspondence = 1
			});
			}
			scope.toggle = true;
			scope.toggleFilter = function(){
				scope.toggle = scope.toggle === false ? true : false;
			};
			

        }
    };
})