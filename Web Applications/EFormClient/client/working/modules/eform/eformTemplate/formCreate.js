var EFormService = require('modules/eform/services');
var CommonInputText = require('common/inputText');
var Config = require('config');

module.exports = React.createClass({
             userUID: null,
	propTypes: {
	       onSave: React.PropTypes.func,
                    onCloseModal: React.PropTypes.func
	},
             setUserUID: function(userUID){
                    this.userUID = userUID;
             },
	_serverCreateForm: function(data){        
                    var self = this;
                    swal({
                        title: 'Are you sure?',
                        text: 'You will add new eform',
                        type: 'warning',
                        showCancelButton: true,
                        closeOnConfirm: false,
                        allowOutsideClick: true,
                        showLoaderOnConfirm: true
                    }, function(){
                        EFormService.eformTemplateCreate(data)
                        .then(function(response){
                            self.props.onSave();
                        })
                    })
            },
            _onSave: function(){
    	       var name = this.refs.inputName.getValue();
                    this._serverCreateForm({name:name, userUID: this.userUID});
            },
	render: function(){
		return (
		      <div className="row">
                                        <div className="col-md-12">
                                                <form>
                                                    <div className="form-body">
                                                        <div className="form-group">
                                                            <label>Form Name</label>
                                                            <CommonInputText placeholder="Form Name..." ref="inputName"/>
                                                        </div>
                                                        <div className="form-group" style={{float:'right'}}>
                                                            <button type="button" className="btn btn-default" onClick={this.props.onCloseModal}>Close</button>
                                                            &nbsp;
                                                            <button type="button" className="btn btn-primary" onClick={this._onSave}>Save</button>
                                                        </div>
                                                    </div>
                                                </form>
                                        </div>
                                </div>
		)
	}
})