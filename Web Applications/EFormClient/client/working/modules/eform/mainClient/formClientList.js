var EFormService = require('modules/eform/services');
var Link = ReactRouter.Link;
var Config = require('config');

module.exports = React.createClass({
    propTypes: {
        onRemove: React.PropTypes.func
    },
    appointmentUID: null,
    patientUID: null,
    init: function(appointmentUID, patientUID){
        this.appointmentUID = appointmentUID;
        this.patientUID = patientUID;
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
                                <th className="bg-blue-dark bg-font-blue-dark">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.list.map((l,index)=>{
                                    return (
                                        <tr key={index}>
                                            <td>{l.Name}</td>
                                            <td>
                                                {moment(l.CreatedDate).format('DD/MM/YYYY HH:mm:ss')}
                                            </td>
                                            <td>
                                                <Link to={"/eform/detail/appointment/"+this.appointmentUID+"/patient/"+this.patientUID+"/client/"+l.ID} className="label label-sm label-success">
                                                    View Form
                                                </Link>
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