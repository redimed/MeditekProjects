var EFormTemplate = require('./eformTemplate')
var EFormService = require('modules/eform/services')
module.exports = React.createClass({
	propTypes: {
		onClick: React.PropTypes.func
	},
    getInitialState: function() {
        return {
            list: [],
            dataFilter: {data: {Filter: [{EFormTemplate: {Active: 'Y'}},
            {"Appointment":{"UID":"24342342-761e-43b4-ab52-7e20097947c8"}}]}}
        }
    },
    componentDidMount: function() {
        this.loadList(this.state.dataFilter)
    },
    loadList: function(dataFilter) {
        var self = this
        App.blockUI()
        EFormService.eformTemplateListFilter(dataFilter)
            .then(function(response) {
                self.setState({ list: response.data.rows })
                App.unblockUI()
            }, function(err) {
                swal("Error!", "Load list EFormTemplate failed.", "error")
                App.unblockUI()
            })
    },
    _onClick: function(data){
    	this.props.onClick(data)
    },
    onClickPatientAdmission: function() {
        console.log('go to page Patient Admission')
    },
    render: function() {
        return ( 
        	<div className = "row margin-bottom-10" >
            <EFormTemplate className="green-jungle" onClick={this._onClick} data={{Name: "Patient Admission"}}/>
            	{
            		this.state.list.map(function(item, index){
                        var className=item.EForms.length!==0?'green-jungle':'blue'
            			return (
            					<EFormTemplate className={className} key={index} data={item} onClick={this._onClick}/>
            				)
            		}.bind(this))
            	}
            </div>
        )
    }
})
