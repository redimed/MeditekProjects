var history = ReactRouter.hashHistory;

module.exports = React.createClass({
	propTypes: {
		onAddNewSection: React.PropTypes.func,
		onSaveForm: React.PropTypes.func
	},
            userUID: null,
            name: '',
            setUserUID: function(userUID){
                this.userUID = userUID;
            },
            setName: function(name){
                this.name = name;
            },
	_onAddNewSection: function(){
		var self = this;
		swal({
			title: 'Are you sure?',
			text: 'You will create new Section for this E-Form',
			type: 'warning',
			showCancelButton: true,
			closeOnConfirm: false,
			allowOutsideClick: true
		}, function(){
			self.props.onAddNewSection();
		})
	},
	_onSaveForm: function(){
                         this.props.onSaveForm();
		/*swal({
			title: 'Are you sure?',
			text: 'You will save this form !!!',
			type: 'warning',
			showCancelButton: true,
			closeOnConfirm: false,
			allowOutsideClick: false,
			showLoaderOnConfirm: true
		}, function(){
		}.bind(this))*/
	},
            _goToHome: function(){
                history.push('/eformTemplate?userUID='+this.userUID);
            },
	render: function(){
		return (
			<div className="page-bar">
				<ul className="page-breadcrumb">
                                                        <li>
                                                            <a onClick={this._goToHome}>EForm Template List</a>
                                                            <i className="fa fa-circle"></i>
                                                        </li>
                                                        <li>
                                                            <span>{this.name}</span>
                                                        </li>
                                                    </ul>
                                                    <div className="page-toolbar">
                                                        <div className="pull-right">
                    	                                   <button type="button" className="btn green btn-sm" onClick={this._onAddNewSection}>
                    		                          <i className="fa fa-plus"></i>&nbsp;
                    		                          Add New Section
				         </button>
				        &nbsp;
				        <button type="button" className="btn green btn-sm" onClick={this._onSaveForm}>
                    		                          <i className="fa fa-save"></i>&nbsp;
                    		                          Save Form
				        </button>
                                                        </div>
                                                    </div>
			</div>
		)
	}
})