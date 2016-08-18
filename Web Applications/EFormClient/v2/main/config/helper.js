import IP from './ip'

class Helper{

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