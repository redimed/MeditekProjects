/*
Directive su dung thu vien 
https://github.com/vakata/jstree
http://jstree-directive.herokuapp.com/#/plugins
*/

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

            scope.color = "#000000";

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

            scope.treeArr = [];

            canvas.width = attrs.width || element.width();
            canvas.height = attrs.height || element.height();

            scope.currentImageLoaderFile = null;
            scope.currentImageLoaderFileUrl = null;
            scope.rotateAngle = 0;

            scope.lineWidths = [
                {width: 1, desc: 'Line 1'},
                {width: 2, desc: 'Line 2'},
                {width: 3, desc: 'Line 3'},
                {width: 4, desc: 'Line 4'},
                {width: 5, desc: 'Line 5'},
            ]

            scope.lineWidth = scope.lineWidths[3];

            scope.preErasingState = {
                color:"#000000",
                lineWidth: scope.lineWidths[3]
            };

            $("#colorInput").minicolors({
                defaultValue: "#000000"
            });
            $("#colorInput").minicolors({
                defaultValue: "#000000"
            });

            $("#colorInput").on("change", function(event){
                scope.color= event.target.value;
            })


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
            
            /*scope.trackDoubleTouch;
            scope.trackCurrentNodeTouch;
            scope.selectNodeCBViaDoubleTouch = function (e) {
                var now = new Date().getTime();
                var timesince = now - scope.trackDoubleTouch;
                var idArr = String(e.target.id).split('_');
                if((timesince < 600) && (timesince > 0) && (scope.trackCurrentNodeTouch == idArr[0])) {
                    // double tap   
                    scope.selectNodeCB(e);
                } else {
                    // too much time to be a doubletap
                 }
                scope.trackDoubleTouch = new Date().getTime();
                scope.trackCurrentNodeTouch = idArr[0];
            }*/
            
            scope.treeLoaded = function(e) {
                console.log(">>>>>treeLoaded:", e);
                $(e.currentTarget).jstree('open_all');

            }
            
            
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
                if(!scope.erasing) {
                    scope.preErasingState = {
                        color: scope.color,
                        lineWidth: scope.lineWidth
                    }
                    scope.color = element.find('#myCanvas').css("background-color");
                    scope.lineWidth = {width:50, desc: 'Erase'};
                    scope.erasing = true;
                } else {
                    scope.color = scope.preErasingState.color;
                    scope.lineWidth = scope.preErasingState.lineWidth;
                    scope.erasing = false;
                }
            };
            

            var draw = function(lX, lY, cX, cY)
            {
            	ctx.lineCap = "round";
            	ctx.fillStyle = "solid";
            	ctx.strokeStyle = scope.color;
		        ctx.lineWidth = scope.lineWidth.width;
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

                scope.currentImageLoaderFile = e.target.files[0];
                var objectUrl = URL.createObjectURL(e.target.files[0]);
                scope.currentImageLoaderFileUrl = URL.createObjectURL(e.target.files[0]);
                $('#imageLoaderPreview').attr('src',scope.currentImageLoaderFileUrl);
                var img = new Image;
                var flagRotate = false;

                img.onload = function () {
                    clearCanvas();
                    //----------------------
                    var displayWidth, displayHeight = null;
                    var ratio = null;
                    if(img.height>img.width) {
                        //Hình đứng
                        displayHeight = canvas.height;
                        ratio = img.height/canvas.height;
                        displayWidth = Math.floor(img.width / ratio);
                    } else {
                        //Hình ngang
                        displayWidth = canvas.width;
                        ratio = img.width/canvas.width;
                        displayHeight = Math.floor(img.height/ratio);
                    }
                    ctx.drawImage(img, (canvas.width-displayWidth)/2, (canvas.height-displayHeight)/2, displayWidth, displayHeight);
                    cPush();
                }
                img.src = objectUrl;

            });

            scope.nextRotateAngle = function() {
                if(scope.rotateAngle == (3/2)*Math.PI) {
                    return 0;
                } else {
                    return scope.rotateAngle + Math.PI/2;
                }
            };

            scope.rotateImageLoader = function() {
                console.log("||||||||||||||||||||||||rotateImageLoader:");
                if(scope.currentImageLoaderFileUrl) {
                    var img = new Image;
                    img.onload = function () {
                        clearCanvas();
                        scope.rotateAngle = scope.nextRotateAngle();
                        console.log('rotateAngle', scope.rotateAngle);
                        var sameLayout = scope.rotateAngle/Math.PI%1 == 0;
                        console.log("sameLayout", sameLayout);
                        var displayWidth, displayHeight = null;
                        var canvasWidth = sameLayout?canvas.width:canvas.height;
                        var canvasHeight = sameLayout?canvas.height:canvas.width;

                        var quarterList = [
                            0, //phan tu thu 1
                            (1/2)*Math.PI, //phan tu thu 2
                            Math.PI, //phan tu thu 3
                            (3/2)*Math.PI, //phan tu thu 4
                        ]
                        var quarter = 0; //mac dinh phan tu thu 1

                        var quarterVector = {
                            0: {w: 0,h: 0}, //phan tu thu 1
                            1: {w: 0, h: -canvas.width}, //phan tu thu 2
                            2: {w: -canvas.width, h: -canvas.height}, //phan tu thu 3
                            3: {w: -canvas.height, h: 0} //phan tu thu 4
                        }

                        var ratio = null;
                        if(img.height > img.width) {
                            console.log("Hinh dung")
                            displayHeight = canvasHeight ;
                            ratio = img.height/canvasHeight;
                            displayWidth = Math.floor(img.width / ratio);
                        } else {
                            console.log("Hinh ngang");
                            displayWidth = canvasWidth;
                            ratio = img.width/canvasWidth;
                            displayHeight = Math.floor(img.height/ratio);
                        }

                        for(var i =0; i<quarterList.length; i++) {
                            if(quarterList[i] == scope.rotateAngle) {
                                quarter = i;
                                break;
                            }
                        }
                        console.log("quarter", quarter, quarterList[quarter]);
                        ctx.save();
                        ctx.rotate(scope.rotateAngle);
                        ctx.drawImage(img,quarterVector[quarter].w + (canvasWidth-displayWidth)/2, quarterVector[quarter].h +(canvasHeight-displayHeight)/2 , displayWidth, displayHeight);
                        cPush();
                        ctx.restore();
                    }
                    img.src = scope.currentImageLoaderFileUrl;
                }
            };

            scope.changeLineWidth = function () {

            }

            

            angular.element(canvas).on('mousedown mousemove mouseup mouseout touchstart touchmove touchend', 
              function (event) {
                //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>originalEvent:", event.originalEvent);
                //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>targetTouches:", event.originalEvent.targetTouches);
                //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>evtouchesent:", event.originalEvent.touches);
                //Nếu di chuyển chuột nhưng không ở chế độ vẽ hay chữ thì return
                if (event.type === 'mousemove' && !drawing && !scope.typing) {
                    // Ignore mouse move Events if we're not dragging
                    return;
                }
                event.preventDefault();

                switch (event.type) {
                case 'mousedown':
                case 'touchstart':
                    if(event.offsetX){
			          lastX = event.offsetX;
			          lastY = event.offsetY;
			        }
                    else if (event.originalEvent) {
                        lastX = event.originalEvent.targetTouches[0].pageX - angular.element(canvas).offset().left;
                        lastY = event.originalEvent.targetTouches[0].pageY - angular.element(canvas).offset().top;
                    }
                    else {
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
                        if(event.offsetX){
                            currentX = event.offsetX;
                            currentY = event.offsetY;
                        } else if (event.originalEvent) {
                            currentX = event.originalEvent.targetTouches[0].pageX - angular.element(canvas).offset().left;
                            currentY = event.originalEvent.targetTouches[0].pageY - angular.element(canvas).offset().top;
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
