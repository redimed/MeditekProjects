const Functions = {
    largerEq: function(n1, n2){
        let res = false

        n1 = parseFloat(n1)
        n2 = parseFloat(n2)

        if(isFinite(String(n1)) || isFinite(String(n2))){
            res = (n1>=n2)?true:false
        }

        return res
    },
    parseQueryString: function(location){
            var params = location.split('?');
            var str = params[1];
            var objURL = {};

            str.replace(
                new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
                function( $0, $1, $2, $3 ){
                    objURL[ $1 ] = $3;
                }
            );
            return objURL;
    }
}

export default Functions