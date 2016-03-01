var EFormService = require('modules/eform/services');
var history = ReactRouter.hashHistory;
var Config = require('config');

module.exports = React.createClass({
    propTypes: {
        onRemove: React.PropTypes.func
    },
    appointmentUID: null,
    patientUID: null,
    userUID: null,
    init: function(appointmentUID, patientUID, userUID){
        this.appointmentUID = appointmentUID;
        this.patientUID = patientUID;
        this.userUID = userUID;
        this._serverListForm();
    },
	getInitialState: function(){
		return {
			list: []
		}
	},
	componentDidMount: function(){
	},
	refresh: function(){
		this._serverListForm();
	},
	_serverListForm: function(){
		var self = this;
        App.blockUI();
        EFormService.formClientList({patientId: this.patientUID})
        .then(function(response){
            self.setState({list: response.data});
            App.unblockUI();
        })
	},
    _onRemoveForm: function(item){
        if(typeof this.props.onRemove !== 'undefined')
            this.props.onRemove(item);
    },
    _goToDetail: function(l){
        history.push("/eform/detail/appointment/"+this.appointmentUID+"/patient/"+this.patientUID+"/user/"+this.userUID+"/client/"+l.ID);
    },
	render: function(){
		var preList = null
        var table = null
        if(this.state.list.length === 0)
            preList = <p className="font-red-thunderbird">There is no data here</p>
        else
            table = <table className="table table-bordered table-striped table-condensed flip-content">
                        <thead className="flip-content">
                            <tr>
                                <th className="bg-blue-dark bg-font-blue-dark">Name</th>
                                <th className="bg-blue-dark bg-font-blue-dark">Created Date</th>
                                <th className="bg-blue-dark bg-font-blue-dark">Created By</th>
                                <th className="bg-blue-dark bg-font-blue-dark">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.list.map((l,index)=>{
                                    var userCreated = (l.UserAccount)?l.UserAccount.UserName:'';
                                    return (
                                        <tr key={index}>
                                            <td><a onClick={this._goToDetail.bind(this, l)}>{l.Name}</a></td>
                                            <td>
                                                {moment(l.CreatedDate).format('DD/MM/YYYY HH:mm:ss')}
                                            </td>
                                            <td>
                                                {userCreated}
                                            </td>
                                            <td>
                                                <a onClick={this._goToDetail.bind(this, l)} className="label label-sm label-success">
                                                    View Form
                                                </a>
                                                &nbsp;
                                                <a className="label label-sm label-success" onClick={this._onRemoveForm.bind(this, l)}>
                                                    Delete Form
                                                </a>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
		return (
			<div className="row">
                <div className="col-md-12">
                    {preList}
                    {table}
                </div>
            </div>
		)
	}
})