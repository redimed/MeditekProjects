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
            EFormService.eformGroupCreate(data)
            .then(function(response){
                self.props.onSave();
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
                                        <label>E-Form Group Name</label>
                                        <CommonInputText placeholder="E-Form Group Name..." ref="inputName"/>
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