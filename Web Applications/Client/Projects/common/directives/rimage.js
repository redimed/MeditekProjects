/**
 * Created by tannguyen on 13/06/2016.
 */
/**
 * Directive dùng để load pre upload image
 * Input:
 * - file: blob
 */
angular.module('app.common.rimage',[])
    .directive('rimage',function(CommonService){
        return {
            restrict:'A',
            scope:{
                file:"=",
                getBlobUrl: '='
            },
            link:function(scope,element,attrs)
            {
                if(scope.file) {
                    var objectUrl= URL.createObjectURL(scope.file);
                    element.attr('src',objectUrl);
                    if(scope.getBlobUrl)
                        scope.getBlobUrl(objectUrl);
                }
            }
        }
    });