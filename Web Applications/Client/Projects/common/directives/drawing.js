angular.module("app.common.drawing",[])
.directive('drawing', function ($window,Restangular, $timeout, toastr,consultationServices) {
    return {
        restrict: 'E',
        scope: {
        	patient: '=',
        	calendar: '=',
        	actionCenterDrawing:'=',
        	consultid: '='
        },
        templateUrl: "common/directives/drawing.html",
        link: function (scope, element, attrs) {
            var canvas = element.context.querySelector("canvas");
            var imageLoader = element.context.querySelector("#imageLoader");
            var ctx = canvas.getContext("2d");
            var drawing = false;
            var lastX;
      		var lastY;

            scope.colors = [{'color': 'blue-ebonyclay'},
            				{'color': 'green'},
                            {'color': 'blue'},
                            {'color': 'red'}];

            scope.color = 'black';
            scope.lineWidth = attrs.linewidth;
            scope.treeArr = [];

            canvas.width = attrs.width || element.width();
            canvas.height = attrs.height || element.height();
            
            consultationServices.GetDrawingTemplates()
            .then(function(data){
                // alert(JSON.stringify(data));
                for(var i=0; i<data.length;i++)
                {
                    var node = data[i];
                    scope.treeArr.push({
                                "id": node.id,
                                "parent": node.parent == null ? '#' : node.parent,
                                "text": node.fileName,
                                "icon": node.isFolder == 1 ? 'fa fa-folder icon-state-warning' : 'fa fa-file icon-state-success'
                            })
                }
            },function(err){
                console.log(err);
            })
            /*Restangular.one('api/consultation/draw/templates').get().then(function(rs){
            	if(rs.status == 'success')
            	{
            		for(var i=0; i<rs.data.length;i++)
            		{
            			var node = rs.data[i];
            			scope.treeArr.push({
		            				"id": node.id,
		            				"parent": node.parent == null ? '#' : node.parent,
		            				"text": node.fileName,
		            				"icon": node.isFolder == 1 ? 'fa fa-folder icon-state-warning' : 'fa fa-file icon-state-success'
		            			})
            		}
            	}
            })*/
            
            var clearCanvas = function () {
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);//không scale, không làm lệch
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
            };

            var loadImage = function(image){
            	var reader = new FileReader();
                reader.onload = function(event){
                    var img = new Image();
                    img.onload = function(){
                        ctx.drawImage(img,0,0);
                    }
                    img.src = event.target.result;
                }
                reader.readAsDataURL(image);
            }

            /*scope.selectNodeCB = function(e){
            	var idArr = String(e.target.id).split('_');
            	var id = idArr[0];
            	if(id != null && typeof id !== 'undefined' && id != '')
            	{
            		Restangular.one('api/consultation/drawing/getbase64/'+id).get().then(function(rs){
                        var img = new Image;
                        img.onload = function() {
                            ctx.drawImage(img, (canvas.width - img.width) / 2, (canvas.height - img.height) / 2);
                        }
                        img.src = rs.database64;
	            	})
            	}
            }*/

            scope.selectNodeCB = function(e){
                var idArr = String(e.target.id).split('_');
                var id = idArr[0];
                if(id != null && typeof id !== 'undefined' && id != '')
                {
                    consultationServices.GetDrawingFileUrl(id)
                    .then(function(data){
                        var objectUrl = URL.createObjectURL(data.blob);
                        var img = new Image;
                        img.onload = function() {
                            ctx.drawImage(img, (canvas.width - img.width) / 2, (canvas.height - img.height) / 2);
                        }
                        img.src = objectUrl;
                    },function(err){
                        console.log(err);
                    })
                }
            }



      
            scope.changeColor = function (c) {
            	if(c == 'blue-ebonyclay')
	                scope.color = 'black';
	            else
	            	scope.color = c;

                scope.lineWidth = attrs.linewidth;
                scope.erasing = false;
            };
            
            scope.clear = function () {
                clearCanvas();
            };
            
            scope.erase = function () {
                scope.color = element.find('#myCanvas').css("background-color");
                scope.lineWidth = 50;
                scope.erasing = true;
            };
            
            scope.capture = function () {
                var imgData = canvas.toDataURL('image/png');
                
                Restangular.all('api/consultation/draw/saveImage').post({patient_id: scope.patient, cal_id: scope.calendar, imgData: imgData, consult_id: scope.consultid}).then(function(rs){
                	if(rs.status == 'success')
                	{
                		toastr.success("Image Saved!");
                		 //phanquocchien save img success
	                    if(scope.actionCenterDrawing && scope.actionCenterDrawing.runWhenFinish)
						{
							scope.actionCenterDrawing.runWhenFinish();
						}
						//end
                	}
                	else
                		toastr.error("Error!");
                })
            };

            var draw = function(lX, lY, cX, cY)
            {
            	ctx.lineCap = "round";
            	ctx.fillStyle = "solid";
            	ctx.strokeStyle = scope.color;
		        ctx.lineWidth = scope.lineWidth;
		        ctx.moveTo(lX,lY);
		        ctx.lineTo(cX,cY);
		        ctx.stroke();
            }

            angular.element(imageLoader).on('change',function(e){
            	var reader = new FileReader();
			    reader.onload = function(event){
			        var img = new Image();
			        img.onload = function(){
			            ctx.drawImage(img, (canvas.width - img.width) / 2, (canvas.height - img.height) / 2);
			        }
			        img.src = event.target.result;
			    }
			    reader.readAsDataURL(e.target.files[0]); 
            });

            angular.element(canvas).on('mousedown mousemove mouseup mouseout touchstart touchmove touchend', 
              function (event) {
                if (event.type === 'mousemove' && !drawing) {
                    // Ignore mouse move Events if we're not dragging
                    return;
                }
                event.preventDefault();

                switch (event.type) {
                case 'mousedown':
                case 'touchstart':
                    if(event.offsetX!==undefined){
			          lastX = event.offsetX;
			          lastY = event.offsetY;
			        } else {
			        	lastX = event.pageX-angular.element(canvas).offset().left;
			        	lastY = event.pageY-angular.element(canvas).offset().top;

			        }
			        
			        ctx.beginPath();
			        
			        drawing = true;

                    break;
                case 'mousemove':
                case 'touchmove':

                    if(drawing){
			          // get current mouse position
			          if(event.offsetX!==undefined){
			            currentX = event.offsetX;
			            currentY = event.offsetY;
			          } else {
			          	currentX = event.pageX-angular.element(canvas).offset().left;
			        	currentY = event.pageY-angular.element(canvas).offset().top;

			          }

			          draw(lastX, lastY, currentX, currentY);
			          
			          // set current coordinates to last one
			          lastX = currentX;
			          lastY = currentY;
			        }

                    break;
                case 'mouseup':
                case 'touchend':
                case 'mouseout':
                    drawing = false;
                }
            });
            
        }
    };
})
