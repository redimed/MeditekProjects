var EFormService = require('modules/eform/services');
var Link = ReactRouter.Link;

module.exports = React.createClass({
    propTypes: {
        onSelect: React.PropTypes.func
    },
	getInitialState: function(){
		return {
			list: []
		}
	},
	componentDidMount: function(){
		this._serverListForm();
	},
	refresh: function(){
		this._serverListForm();
	},
	_serverListForm: function(){
		var self = this;
        App.blockUI()
        EFormService.formList()
        .then(function(response){
            self.setState({list: response.data});
            App.unblockUI();
        })
	},
    _onSelect: function(item){
        if(typeof this.props.onSelect !== 'undefined')
            this.props.onSelect(item);
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
                                                <span className="label label-sm label-success" 
                                                    onClick={this._onSelect.bind(this, l)}
                                                    style={{cursor:'pointer'}}>
                                                    Select Form
                                                </span>
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