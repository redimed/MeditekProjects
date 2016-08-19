import IP from './ip'

class Helper{
     static largerEq(n1, n2){
        let res = false

        n1 = parseFloat(n1)
        n2 = parseFloat(n2)

        if(isFinite(String(n1)) || isFinite(String(n2))){
            res = (n1>=n2)?true:false
        }

        return res
    }

    static parseQueryString(location){
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


    static selectorUI(object) {
        switch(o.t) {
            case EFORM_CONST.OBJECT_TYPE.RADIO:
                return 'input[type=radio][name='+o.n+']'
            case EFORM_CONST.OBJECT_TYPE.SIGN: 
            case EFORM_CONST.OBJECT_TYPE.DRAWING:
            case EFORM_CONST.OBJECT_TYPE.DATE:
            default:
                return '#' + o.n
        }
    }

    static linkEForm(page, temp_uid, appt_uid, patient_uid, user_uid){
        var str =  `${IP.Host}/eform/detail?templateUID=${temp_uid}&appointmentUID=${appt_uid}&patientUID=${patient_uid}&userUID=${user_uid}&page=${page}`
        return  str;
    }

    static b64toBlob(b64Data, contentType = '', sliceSize = 512) {

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }
    
    static toStyleBorder(attrBorder, toStyle){
        if(!toStyle) 
            toStyle = {}
        if(attrBorder !== 'none'){
            var split_p_border = attrBorder.split('-')
            split_p_border.map(function(b){
                if(b === 't')
                    toStyle.borderTop = '1px solid black'
                else if(b === 'l')
                    toStyle.borderLeft = '1px solid black'
                else if(b === 'r')
                    toStyle.borderRight = '1px solid black'
                else if(b === 'b')
                    toStyle.borderBottom = '1px solid black'
            })
        }
        return toStyle
    }

}

export default Helper