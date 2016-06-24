var EFormService = require('modules/eform/services');

module.exports = React.createClass({
    imageSignature: null,
    getDefaultProps: function(){
        return {
            placeholder: '',
            type: 'default',
            name: '',
            className: 'form-control',
            size: '12'
        }
    },
    componentDidMount: function(){
        if(typeof this.refs.group !== 'undefined' && this.props.context !== 'none'){
            $(this.refs.group).contextmenu({
                target: '#'+this.props.context,
                before: function(e, element, target) { 
                    e.preventDefault();
                    return true;
                },
                onItem: function(element, e) {
                    this.props.onRightClickItem(this.props.code, e, this.props.refTemp);
                }.bind(this)
            })
        }
        if(this.props.permission === 'eformDev'){
            $(this.refs.input).prop('disabled', true);
        }
    },
    // public method for encoding an Uint8Array to base64
    encode: function(input) {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        while (i < input.length) {
            chr1 = input[i++];
            chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
            chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                      keyStr.charAt(enc3) + keyStr.charAt(enc4);
        }
        return output;
    },
    setValue: function(value){
        this.imageSignature = value;
        if(this.imageSignature){
            var self = this;
            EFormService.getImage({size: 250, UID: value})
            .then(function(image){
                var bytes = new Uint8Array(image);
                $(self.refs.canvas).attr('src', "data:image/jpg;base64,"+self.encode(bytes));
                self.forceUpdate(function(){
                });
            })
        }
    },
    getValue: function(){
        return (this.imageSignature)?this.imageSignature.UID:'';
    },
    getName: function(){
        return this.props.name;
    },
    getSize: function(){
        return this.props.size;
    },
    getType: function(){
        return this.props.type;
    },
    getCode: function(){
        return this.props.code;
    },
    getPreCal: function(){
        return this.props.preCal;
    },
    getRoles: function(){
        return this.props.roles;
    },
    render: function(){
        var type = this.props.type;
        var html = null;
        var htmlSignature = (this.imageSignature)?<img ref="sign"/>:'No signature';
        var display = (
            <div className="col-xs-12">
                <img ref="canvas" width="100%" id={this.props.refTemp}/>
            </div>
        )
        switch(type){
            case 'eform_input_image_patient':
                html = (
                    <div className={"dragField col-xs-"+this.props.size} ref="group">
                        <div className="form-group" id={this.props.groupId}>
                            {display}
                        </div>
                    </div>
                )
        }
        return html;
    }
})