var EFormGroup = require('./eformGroup')
var EFormService = require('modules/eform/services')
module.exports = React.createClass({
	propTypes: {
		onClick: React.PropTypes.func
	},
	getInitialState: function() {
		return {
			list: [],
			dataFilter: {data: {Filter: [{EFormGroup: {Enable: 'Y'}}]}}
		}
	},
	componentDidMount: function() {
		this.loadList(this.state.dataFilter)
	},
	loadList: function(dataFilter){
	var self = this
		App.blockUI()
		EFormService.eformGroupList(dataFilter)
		.then(function(response){
			self.setState({list: response.data})
			App.unblockUI()
		}, function(err){
			swal("Error!", "Load list group EForm failed.", "error")
			App.unblockUI()
		})
	},
	_onClick: function(data) {
		this.props.onClick(data)
	},
	render: function() {
		return (
			<ul className="ver-inline-menu tabbable margin-bottom-10 margin-top-10">
				{
					this.state.list.map(function(item, index){
						return (
								<EFormGroup key={index} data={item} no={index+1} onClick={this._onClick}/>
							)
					}.bind(this))
				}
			</ul>
			)
	}
})