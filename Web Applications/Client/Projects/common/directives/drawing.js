angular.module("app.common.drawing",[])
.directive('drawing', function ($window,Restangular, $timeout, toastr,consultationServices,CommonService,$cookies) {
    return {
        restrict: 'E',
        scope: {
            data:'=',
            action:'=',
        	// patient: '=',
        	// calendar: '=',
        	// actionCenterDrawing:'=',
        	// consultid: '='
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

            scope.sizes=[
                {'width':550,'height':500,desc:'550x500'},
                {'width':650,'height':600,desc:'650x600'},
                {'width':750,'height':650,desc:'750x650'},
            ]
            scope.size=scope.sizes[1];

            scope.lineWidth = attrs.linewidth;
            scope.treeArr = [];

            canvas.width = attrs.width || element.width();
            canvas.height = attrs.height || element.height();
                
            //-------------<tannv.dts---------------
            scope.changeSize=changeSize=function()
            {
                canvas.width=scope.size.width;
                canvas.height=scope.size.height;
            }
            changeSize();

            var cPushArray=new Array();
            var cStep=-1;

            function makeFileName()
            {
                var fileName="Drawing_"
                            .concat(moment().format("YYYY-MM-DD_HHmmss.SSS"))
                            .concat('.jpg');
                return fileName;
            }

            scope.capture = function () {
                //canvas thành base64
                // var imgData = canvas.toDataURL('image/png');
                
                //canvas thành blob
                if(canvas.toBlob)
                {
                    canvas.toBlob(function(blob){
                        saveAs(blob,makeFileName());
                    })
                }
            };

            scope.uploadDrawing=uploadDrawing=function()
            {
                if(canvas.toBlob)
                {
                    canvas.toBlob(function(blob){
                        var formdata = new FormData();
                        formdata.append('userUID',scope.data.userUID);
                        formdata.append('fileType',scope.data.fileType);
                        var fileName=makeFileName();
                        formdata.append("uploadFile",blob, fileName);
                        // formdata.append("myNewFileName", blob);
                        $.ajax({
                           url: o.const.uploadFileUrl,
                           xhrFields: {
                              withCredentials: true
                           },
                           headers:{
                                Authorization: ('Bearer ' + $cookies.get("token")),
                                systemtype: 'WEB'
                           },
                           type: "POST",
                           data: formdata,
                           processData: false,
                           contentType: false,
                        }).done(function(respond){
                            console.log(respond);
                            if(respond.status=='success')
                            {
                                // CommonService.downloadFile(respond.fileUID);
                                toastr.success("Save drawing successfully", "success");
                                scope.action(respond.fileUID);
                            }
                        });
                    })
                }
            }


            function cPush()
            {
                cStep++;
                if(cStep<cPushArray.length)
                {
                    cPushArray.length=cStep;
                }

                //demo download canvas
                /*canvas.toBlob(function(blob){
                    var objectUrl = URL.createObjectURL(blob);
                    var anchor = document.createElement("a");
                    // anchor.download='';//se lay ten mat dinh
                    anchor.download='aaa.jpg';
                    anchor.href = objectUrl;
                    anchor.click();
                    alert(objectUrl);
                })*/
                //demo download canvas with FileSaver
                /*canvas.toBlob(function(blob){
                    saveAs(blob,'heheehe.jpg');
                })*/
                
                //Lưu canvas history bằng Base64
                // cPushArray.push(element.context.querySelector("canvas").toDataURL());
                
                //Lưu canvas history bằng Blob url
                if(canvas.toBlob)
                {
                    canvas.toBlob(function(blob){
                        var objectUrl = URL.createObjectURL(blob);
                        cPushArray.push(objectUrl);
                    })
                }
            }
            cPush();// Save trạng thái ban đầu

            scope.cUndo=cUndo=function()
            {
                if(cStep>0)
                {
                    cStep--;
                    var img=new Image;
                    img.onload=function()
                    {
                        clearCanvas();
                        ctx.drawImage(img, 0,0);
                    }
                    img.src=cPushArray[cStep];
                }
            }

            scope.cRedo=cRedo=function()
            {
                if(cStep<cPushArray.length-1)
                {
                    cStep++;
                    var img=new Image();
                    img.onload=function()
                    {
                        clearCanvas();
                        ctx.drawImage(img, 0,0);
                    }
                    img.src=cPushArray[cStep];
                }
            }

            //-------------tannv.dts>---------------

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
                            clearCanvas();
                            ctx.drawImage(img, (canvas.width - img.width) / 2, (canvas.height - img.height) / 2);
                            cPush();
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
            
            //Lưu giữ transform cũ và clear canvas
            //Nếu không lưu giữ transform cũ thì config transform cũ sẽ bị xóa
            var clearCanvas = function () {
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);//không scale, không làm lệch
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
            };
            scope.clear = function () {
                clearCanvas();
                cPush();
            };
            
            scope.erase = function () {
                scope.color = element.find('#myCanvas').css("background-color");
                scope.lineWidth = 50;
                scope.erasing = true;
            };
            
            /*scope.capture = function () {
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
            };*/

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

            //Hàm load hình ảnh từ file input nhưng chưa sử dụng
            /*var loadImage = function(image){
                var reader = new FileReader();
                reader.onload = function(event){
                    var img = new Image();
                    img.onload = function(){
                        ctx.drawImage(img,0,0);
                    }
                    img.src = event.target.result;
                }
                reader.readAsDataURL(image);
            }*/

            //Đọc hình ảnh từ file input gán vào canvas
            /*angular.element(imageLoader).on('change',function(e){
            	var reader = new FileReader();
			    reader.onload = function(event){
			        var img = new Image();
			        img.onload = function(){
			            ctx.drawImage(img, (canvas.width - img.width) / 2, (canvas.height - img.height) / 2);
			        }
			        img.src = event.target.result;
			    }
			    reader.readAsDataURL(e.target.files[0]); 
            });*/
            angular.element(imageLoader).on('change',function(e){
                var objectUrl = URL.createObjectURL(e.target.files[0]);
                var img = new Image;
                img.onload = function() {
                    clearCanvas();
                    ctx.drawImage(img, (canvas.width - img.width) / 2, (canvas.height - img.height) / 2);
                    cPush();
                }
                img.src = objectUrl;
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
                    cPush();
                case 'mouseout':
                    drawing = false;
                    
                }
            });
            
        }
    };
})
