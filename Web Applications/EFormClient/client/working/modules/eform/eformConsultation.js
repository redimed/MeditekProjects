
var PageBar = require('modules/eform/eformConsultation/pageBar')
var InputSearch = require('modules/eform/eformConsultation/inputSearch')
var EFormGroupList = require('modules/eform/eformConsultation/eformGroupList')
var EFormTemplateList = require('modules/eform/eformConsultation/eformTemplateList')
var EFormHistoryList = require('modules/eform/eformConsultation/eformHistoryList')
module.exports = React.createClass({
	EFormGroupUID: null,
	componentWillMount: function() {
		$('body').addClass('page-header-fixed page-sidebar-closed-hide-logo page-container-bg-solid page-content-white')
		App.blockUI()
	},
	componentDidMount: function() {
		App.unblockUI()
	},
	componentWillUnmount: function() {
		$('body').removeClass('page-header-fixed page-sidebar-closed-hide-logo page-container-bg-solid page-content-white')
		this.EFormGroupUID = null
	},
	clickEFormGroup: function(data) {
		this.EFormGroupUID = data.UID
		var objectLoad = {
			data: {
				Filter: [{
					EFormTemplate: {
						Active: 'Y'
					}
				},{
					EFormGroup: {
						UID: this.EFormGroupUID
					}
				}]
			}
		}
		this.refs['eformTemplateList'].loadList(objectLoad)
	},
	clickEFormTemplate: function(data) {
		
	},
	onEnterSearchEFormGroup: function(e) {
		if(e.keyCode===13) {
			var objSearch = {data: {
				Filter: [{EFormGroup: {
					Enable: 'Y'
				}}],
				Search: [{
					EFormGroup: {
						Name: e.target.value
					}
				}]
			}}
			this.refs['eformGroupList'].loadList(objSearch)
		}
	},
	onEnterSearchEFormTemplate: function(e) {
		if(e.keyCode===13) {
			var objSearch = {data: {
				Filter: [{EFormTemplate: {
					Active: 'Y'
				}},{
					EFormGroup: {
						UID: this.EFormGroupUID
					}
				},
				{
					Appointment:{
						UID:"24342342-761e-43b4-ab52-7e20097947c8"
					}
				}],
				Search: [{
					EFormTemplate: {
						Name: e.target.value
					}
				}]
			}}
			this.refs['eformTemplateList'].loadList(objSearch)
		}
	},
	render: function() {
		return (
			<div  className="page-container">
				<div  className="page-content">
					<PageBar />
					<h3 className="page-title">Consultation Detail</h3>
					<div className="row">
					    <div className="col-lg-12 col-md-12">
					        <div className="portlet portlet-fit box blue">
					            <div className="portlet-title">
					                <div className="caption">
					                    <span className="caption-subject bold uppercase">
					                        <i className="icon-list"></i> Title
					                    </span>
					                </div>
					                <div className="tools">
					                    <a href="javascript:;" className="collapse"> </a>
					                </div>
					            </div>
					            <div className="portlet-body">
					                <div className="row ">
					                    <div className="col-lg-3 col-md-12">
					                        <form>
					                            <div className="form-group">
					                                <div className="input-icon right">
					                                    <InputSearch type="text" className="form-control" placeholder="search..." onKeyDown={this.onEnterSearchEFormGroup}/>
					                                    <i className="glyphicon glyphicon-search"></i>
					                                </div>
					                            </div>
					                        </form>
					                        <EFormGroupList ref="eformGroupList" onClick={this.clickEFormGroup}/>
					                    </div>
					                    <div className="col-lg-9 col-md-12">
			                                <div className="row margin-bottom-10">
			                                    <div className="col-lg-12 col-md-12">
			                                        <form>
			                                            <div className="form-group">
			                                                <div className="input-icon right">
			                                                    <InputSearch type="text" className="form-control" placeholder="search..." onKeyDown={this.onEnterSearchEFormTemplate}/>
			                                                    <i className="glyphicon glyphicon-search"></i>
			                                                </div>
			                                            </div>
			                                        </form>
			                                    </div>
			                                </div>
			                                <EFormTemplateList ref="eformTemplateList" onClick={this.clickEFormTemplate}/>
					                    </div>
					                </div>
					            </div>
					        </div>
					    </div>
					    <div className="col-lg-3 col-md-12" style={{display: "none"}}>
					        <div className="portlet portlet-fit box blue">
					            <div className="portlet-title">
					                <div className="caption">
					                    <span className="caption-subject bold uppercase">
					                        <i className="icon-speedometer"></i> History
					                    </span>
					                </div>
					                <div className="tools">
					                    <a href="javascript:;" className="collapse"> </a>
					                </div>
					            </div>
					            <div className="portlet-body">
					                <EFormHistoryList />
					            </div>
					        </div>
					    </div>
					</div>
				</div>
			</div>
)
	}
})