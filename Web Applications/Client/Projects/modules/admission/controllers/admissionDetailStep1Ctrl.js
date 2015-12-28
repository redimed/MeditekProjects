var app = angular.module('app.authentication.admission.detail.step1.controller',[
	'app.authentication.admission.detail.step1.modalAdd1.controller',
	'app.authentication.admission.detail.step1.modalDelete1.controller',
	'app.authentication.admission.detail.step1.modalUpdate1.controller',

    'app.authentication.admission.detail.step1.modalAdd2.controller',
    'app.authentication.admission.detail.step1.modalDelete2.controller',
    'app.authentication.admission.detail.step1.modalUpdate2.controller',
]);

app.controller('admissionDetailStep1Ctrl', function($scope, $state, $uibModal){
    angular.element(".progress-bar").attr("style","width:30%");
	$scope.submit = function(){
		$scope.submitted = true;
		if($scope.form.$valid){
			$state.go("authentication.admission.detail.step2");
		}
	};	

	$scope.openModalAdd1 = function(){
    	var modalInstance = $uibModal.open({
    		animation: true,
    		size: 'md',
    		templateUrl: 'modules/admission/views/modalAdd1.html',
    		controller: 'modalAdd1Ctrl',
    		resolve: {
                titleModal: function(){
                    return 'Add data';
                },
    			PREVIOUS_SURGERY_PROCEDURES: function(){
    				return $scope.admissionDetail.step1.PREVIOUS_SURGERY_PROCEDURES;
    			},
    		},
    	});
    	modalInstance.result
	        .then(function(result) {
			    // 
			}, function(result) {
				// 
			});
    };
    $scope.openModaUpdate1 = function(index){
        var data = $scope.admissionDetail.step1.PREVIOUS_SURGERY_PROCEDURES[index];
    	var modalInstance = $uibModal.open({
    		animation: true,
    		size: 'md',
    		templateUrl: 'modules/admission/views/modalAdd1.html',
    		controller: 'modalUpdate1Ctrl',
    		resolve: {
                titleModal: function(){
                    return 'Update data';
                },
    			dataModal : function(){
    				return data;
    			},
                index: function(){
                    return index;
                },
    		},
    	});
    	modalInstance.result
	        .then(function(result) {
                $scope.admissionDetail.step1.PREVIOUS_SURGERY_PROCEDURES[result.index] = result.data;
			}, function(result) {
				// dismiss
			});
    };
    $scope.openModalDelete1 = function(index){
    	var modalInstance = $uibModal.open({
    		animation: true,
    		size: 'sm',
    		templateUrl: 'modules/admission/views/modalDelete1.html',
    		controller: 'modalDelete1Ctrl',
    		resolve: {
                titleModal: function(){
                    return 'Delete data';
                },
    			index: function(){
                    return index;
                },
    		},
    	});
    	modalInstance.result
	        .then(function(result) {
			    $scope.admissionDetail.step1.PREVIOUS_SURGERY_PROCEDURES.splice(result.index, 1);
			}, function(result) {
				// dismiss
			});
    };

    $scope.openModalAdd2 = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: 'modules/admission/views/modalAdd2.html',
            controller: 'modalAdd2Ctrl',
            resolve: {
                titleModal: function(){
                    return 'Add data';
                },
                MEDICATIONS: function(){
                    return $scope.admissionDetail.step1.MEDICATIONS;
                },
            },
        });
        modalInstance.result
            .then(function(result) {
                // 
            }, function(result) {
                // 
            });
    };
    $scope.openModaUpdate2 = function(index){
        var data = $scope.admissionDetail.step1.MEDICATIONS[index];
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: 'modules/admission/views/modalAdd2.html',
            controller: 'modalUpdate2Ctrl',
            resolve: {
                titleModal: function(){
                    return 'Update data';
                },
                dataModal : function(){
                    return data;
                },
                index: function(){
                    return index;
                },
            },
        });
        modalInstance.result
            .then(function(result) {
                $scope.admissionDetail.step1.MEDICATIONS[result.index] = result.data;
            }, function(result) {
                // dismiss
            });
    };
    $scope.openModalDelete2 = function(index){
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'sm',
            templateUrl: 'modules/admission/views/modalDelete2.html',
            controller: 'modalDelete2Ctrl',
            resolve: {
                titleModal: function(){
                    return 'Delete data';
                },
                index: function(){
                    return index;
                },
            },
        });
        modalInstance.result
            .then(function(result) {
                $scope.admissionDetail.step1.MEDICATIONS.splice(result.index, 1);
            }, function(result) {
                // dismiss
            });
    };
    
});