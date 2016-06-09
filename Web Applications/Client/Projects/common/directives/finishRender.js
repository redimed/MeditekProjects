angular.module('app.common.finishRender',[])
.directive('finishRender', function() {
        return function(scope, element, attrs) {
            if (scope.$last)
            {
                $('.page-sidebar-menu li').click(function(){
		            // alert("AAA");
                    // $('.page-sidebar-menu li').removeClass('start');
                    // $(this).addClass('start');
                    $('.page-sidebar-menu li').removeClass('active open');
                    $(this).addClass('active open');
		        });
            }
        };
    });
