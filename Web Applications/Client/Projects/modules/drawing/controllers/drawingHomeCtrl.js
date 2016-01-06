var app = angular.module('app.blank.drawing.home.controller', []);

app.controller('drawingHomeCtrl', function($scope) {
    // ComponentsColorPickers.init();

    var image_path = './theme/assets/global/images/';
    $scope.color="#000000";
    $scope.lineWidth = 1;
    var src;
    var x = 0;
    var y = 0;
    // data tree source
    $scope.tree_data = [
        {
            "text": "Explore",
            "icon" : "fa fa-folder icon-state-warning",
            "state": { "opened": true },
            "children": [
                {
                    "text": "Head part",
                    "icon" : "fa fa-folder icon-state-warning",
                    "state": { "opened": true },
                    "children": [
                        {"type": "file", "text": "1.jpg", "icon" : "fa fa-file-image-o icon-state-info", "path": "./theme/assets/global/images/"},
                        {"type": "file", "text": "2.jpg", "icon" : "fa fa-file-image-o icon-state-info", "path": "./theme/assets/global/images/"},
                        {
                            "type": "default", 
                            "text": "detail",
                            "children": [{
                                "text": "detail1.jpg",
                                "type": "file",
                                "icon": "fa fa-file-image-o icon-state-info",
                            }],
                        },
                    ]
                }, 
                {
                    "text": "Arm part",
                    "icon": "fa fa-folder icon-state-warning",
                    "state": { "opened": true },
                    "children": [
                        {"type": "file", "text": "1.jpg", "icon" : "fa fa-file icon-state-warning"},
                        {"type": "file", "text": "2.jpg", "icon" : "fa fa-file icon-state-success"},
                        {"type": "file", "text": "3.jpg", "icon" : "fa fa-file icon-state-default"},
                        {"type": "file", "text": "4.jpg", "icon" : "fa fa-file icon-state-danger"},
                        {"type": "file", "text": "5.jpg", "icon" : "fa fa-file icon-state-info"}
                    ]
                },
                {
                    "text": "Body part",
                    "icon": "fa fa-warning icon-state-default",
                    "state": {"disabled": true},
                },
                {
                    "text": "Foot part",
                    "icon": "fa fa-warning icon-state-default",
                    "state": {"disabled": true},
                }
            ]
        },
    ];

    // tree folder
    angular.element("#my-tree_3").jstree({
        "core" : {
            "themes" : {
                "responsive": false
            }, 
            // so that create works
            "check_callback" : true,
            'data': $scope.tree_data,
        },
        "types" : {
            "default" : {
                "icon" : "fa fa-folder icon-state-warning icon-lg"
            },
            "file" : {
                "icon" : "fa fa-file icon-state-warning icon-lg"
            }
        },
        "state" : { "key" : "demo2" },
        "plugins" : [ "contextmenu", "dnd", "state", "types" ]
    });

    // get name of node tree
    angular.element('#my-tree_3').on('select_node.jstree', function(e, data){
        console.log('data source json', data.node.original);
        if(data.node.children == '' &&  data.node.type == 'file'){
            src = image_path+data.node.text;
            $scope.loadImage(src, x, y);
        }
    });
  
    
    
    $scope.loadImage = function(src, x, y){
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        canvas.width = $(".text-center").width();
        canvas.height = $(".text-center").height();     
        var imageObj = new Image();
        imageObj.src = src;
        imageObj.onload = function(){
            context.drawImage(imageObj, x, y, canvas.width, canvas.height);
        };
    };

    $scope.clear = function(){
        $scope.loadImage(src, x, y);
    };
    
    // convert color from hex to rgba
    $scope.convertHex = function(hex, opacity){
        hex = hex.replace('#','');
        r = parseInt(hex.substring(0,2), 16);
        g = parseInt(hex.substring(2,4), 16);
        b = parseInt(hex.substring(4,6), 16);
        result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
        return result;
    };
    $scope.save = function(){
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
    };
});
