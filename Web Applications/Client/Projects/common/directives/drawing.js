angular.module("app.common.drawing",[])
.directive('drawing', function ($window,Restangular, $timeout, toastr,consultationServices,CommonService,$cookies) {
    return {
        restrict: 'E',
        scope: {
            data:'=',
            action:'=',
        },
        templateUrl: "common/directives/drawing.html",
        link: function (scope, element, attrs) {
            var canvas = element.context.querySelector("canvas");
            var imageLoader = element.context.querySelector("#imageLoader");
            var ctx = canvas.getContext("2d");

            var drawing = false;
            var lastX;
      		var lastY;

            scope.typing=false;
            var textMove=false;
            var typingState;

            scope.colors = [{'color': 'blue-ebonyclay'},
            				{'color': 'green'},
                            {'color': 'blue'},
                            {'color': 'red'}];
            scope.color = 'black';

            scope.sizes=[
                {'width':550,'height':500,desc:'Canvas 550x500'},
                {'width':750,'height':650,desc:'Canvas 750x650'},
                {'width':900,'height':750,desc:'Canvas 900x750'},
                {'width':1000,'height':900,desc:'Canvas 1100x900'},
            ];
            scope.size=scope.sizes[1];

            scope.fontSizes=[
                {size:12,desc:'Font 12px'},
                {size:15,desc:'Font 15px'},
                {size:20,desc:'Font 20px'},
                {size:25,desc:'Font 25px'},
                {size:30,desc:'Font 30px'},
            ]
            scope.fontSize=scope.fontSizes[4];

            scope.lineWidth = attrs.linewidth;
            scope.treeArr = [];

            canvas.width = attrs.width || element.width();
            canvas.height = attrs.height || element.height();
                
            //-------------<tannv.dts---------------

            //canvas size functions begin
            scope.changeSize=changeSize=function()
            {
                canvas.width=scope.size.width;
                canvas.height=scope.size.height;
            }
            changeSize();
            //canvas size functions end


            //canvas undo functions begin
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
                                systemtype: 'WEB',
                                userUID: scope.data.userUID,
                                fileType: scope.data.fileType
                           },
                           type: "POST",
                           data: formdata,
                           processData: false,
                           contentType: false,
                        }).done(function(respond){
                            console.log(respond);
                            if(respond.status=='success')
                            {
                                // console.log('respond',respond);
                                // CommonService.downloadFile(respond.fileUID);
                                toastr.success("Save drawing successfully", "success");
                                scope.action(respond.fileInfo);
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
            //canvas undo functions end

            //typing function begin
            scope.cGetText=cGetText=function()
            {
                scope.typing=true;
                textMove=true;
                cSaveTypingState();
            }

            scope.cSaveTypingState=cSaveTypingState=function()
            {
                if(canvas.toBlob)
                {

                    canvas.toBlob(function(blob){
                        var objectUrl = URL.createObjectURL(blob);
                        typingState=objectUrl;
                    })
                }
            }

            scope.cApplyText=cApplyText=function()
            {
                scope.typing=false;
                textMove=false;
                cPush();
            }

            scope.cClearTyping=function()
            {
                scope.typing=false;
                textMove=false;
                typingState=null;
                // alert(scope.typing);
            }
            scope.drawText=drawText=function(currentX,currentY)
            {
                ctx.fillStyle=scope.color;
                ctx.font = scope.fontSize.size+"px Arial";
                ctx.fillText(scope.cText,currentX,currentY);
            }
            //typing function end

            //-------------tannv.dts>---------------

            consultationServices.GetDrawingTemplates()
            .then(function(data){
                // alert(JSON.stringify(data));
                for(var i=0; i<data.length;i++)
                {
                    var node = data[i];
                    scope.treeArr.push({
                                "id": node.ID,
                                "parent": node.Parent == null ? '#' : node.Parent,
                                "text": node.FileName,
                                "icon": node.IsFolder == 1 ? 'fa fa-folder icon-state-warning' : 'fa fa-file icon-state-success'
                            })
                }
            },function(err){
                console.log(err);
            })
            
            scope.selectNodeCB = function(e){
                scope.cClearTyping();
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

            //Đọc hình ảnh từ file input gán vào canvas
            scope.imageLoaderClick=function()
            {
                scope.cClearTyping();
            }
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
                //Nếu di chuyển chuột nhưng không ở chế độ vẽ hay chữ thì return
                if (event.type === 'mousemove' && !drawing && !scope.typing) {
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
			        if(!scope.typing)
                    {
                        drawing = true;
                    }
                    break;
                case 'mousemove':
                case 'touchmove':
                    if(scope.typing || drawing)
                    {
                        if(event.offsetX!==undefined){
                            currentX = event.offsetX;
                            currentY = event.offsetY;
                        } else {
                            currentX = event.pageX-angular.element(canvas).offset().left;
                            currentY = event.pageY-angular.element(canvas).offset().top;
                        }
                    }

                    if(drawing){
                        draw(lastX, lastY, currentX, currentY);
                        // set current coordinates to last one
                        lastX = currentX;
                        lastY = currentY;
			        }

                    if(scope.typing && textMove)
                    {
                        var img=new Image;
                        img.onload=function()
                        {
                            clearCanvas();
                            ctx.drawImage(img, 0,0);
                            drawText(currentX,currentY);
                        }
                        img.src=typingState;
                    }
                    break;
                case 'mouseup':
                case 'touchend':
                    if(scope.typing)
                    {
                        textMove=!textMove;
                    }
                    else
                    {
                        cPush();
                    }
                case 'mouseout':
                    drawing = false;
                }
            });
            
        }
    };
})
