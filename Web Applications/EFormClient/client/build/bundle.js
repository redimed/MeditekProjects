/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var history = ReactRouter.hashHistory;
	var Router = ReactRouter.Router;

	var routes = __webpack_require__(1);

	ReactDOM.render(React.createElement(Router, {history: history, routes: routes}), document.getElementById('app'))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var App = __webpack_require__(2);

	var routes = {
		path: '/',
		component: App,
		childRoutes: []
	}

	//var LoggedIn = require('modules/loggedIn/routes');
	//routes.childRoutes.push(LoggedIn);
	var EForm = __webpack_require__(3);
	EForm.map(function(route){
		routes.childRoutes.push(route);
	})

	module.exports = routes;

/***/ },
/* 2 */
/***/ function(module, exports) {

	/** @jsx React.DOM */module.exports = React.createClass({displayName: "module.exports",
		render: function(){
			return React.createElement("div", null, this.props.children)
		}
	})

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var Main = __webpack_require__(4);
	var MainDetail = __webpack_require__(13);
	var MainClient = __webpack_require__(28);
	var MainClientDetail = __webpack_require__(32);
	var MainClientDetailView = __webpack_require__(34);

	module.exports = [
		{path: '/eformDev', component: Main},
		{path: '/eformDev/detail/:formId', component: MainDetail},
		{path: '/eform', component: MainClient},
		{path: '/eform/detail/appointment/:appointmentId/patient/:patientId/form/:formId', component: MainClientDetail},
		{path: '/eform/detail/appointment/:appointmentId/patient/:patientId/client/:clientId', component: MainClientDetailView}
	]

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var ComponentPageBar = __webpack_require__(5);
	var ComponentFormList = __webpack_require__(6);
	var ComponentFormCreate = __webpack_require__(9);
	var ComponentFormUpdate = __webpack_require__(11);
	var CommonModal = __webpack_require__(12);
	var EFormService = __webpack_require__(7);

	module.exports = React.createClass({displayName: "module.exports",
		_onComponentPageBarAddNewForm: function(){
			this.refs.modalAddForm.show();
		},
		_onComponentFormCreateSave: function(){
			this.refs.modalAddForm.hide();
			this.refs.formList.refresh();
			swal("Success!", "Your e-form has been created.", "success");
		},
		_onComponentFormListUpdate: function(item){
			this.refs.modalUpdateForm.show();
			this.refs.formUpdate.init(item);
		},
		_onComponentFormListRemove: function(item){
			this._serverFormRemove({id: item.ID});
		},
		_serverFormRemove: function(data){
			var self = this;
	        swal({
	            title: 'Are you sure?',
	            text: 'You will remove this eform',
	            type: 'warning',
	            showCancelButton: true,
	            closeOnConfirm: false,
	            allowOutsideClick: true,
	            showLoaderOnConfirm: true
	        }, function(){
	            EFormService.formRemove(data)
	            .then(function(response){
	        		swal("Success!", "Your e-form has been removed.", "success");
	        		self.refs.formList.refresh();
	            })
	        })
		},
		_onComponentFormUpdateSave: function(){
			this.refs.modalUpdateForm.hide();
			this.refs.formList.refresh();
			swal("Success!", "Your e-form has been updated.", "success");
		},
		render: function(){
			return (
				React.createElement("div", {className: "page-content"}, 
					React.createElement(CommonModal, {ref: "modalAddForm", portal: "modalAddForm"}, 
	                    React.createElement("div", {className: "modal-header"}, 
	                        React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-hidden": "true"}, "×"), 
	                        React.createElement("h4", {className: "modal-title"}, "Modal Add Form")
	                    ), 
	                    React.createElement("div", {className: "modal-body"}, 
	                    	React.createElement(ComponentFormCreate, {ref: "formCreate", 
	                    		onSave: this._onComponentFormCreateSave})
	                    )
	                ), 
	                React.createElement(CommonModal, {ref: "modalUpdateForm", portal: "modalUpdateForm"}, 
	                    React.createElement("div", {className: "modal-header"}, 
	                        React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-hidden": "true"}, "×"), 
	                        React.createElement("h4", {className: "modal-title"}, "Modal Update Form")
	                    ), 
	                    React.createElement("div", {className: "modal-body"}, 
	                    	React.createElement(ComponentFormUpdate, {ref: "formUpdate", 
	                    		onSave: this._onComponentFormUpdateSave})
	                    )
	                ), 
					React.createElement(ComponentPageBar, {
						ref: "componentPageBar", 
						onAddNewForm: this._onComponentPageBarAddNewForm}), 
					React.createElement("h3", {className: "page-title"}, " E-Form", 
	                    React.createElement("small", null, " List all form exists")
	                ), 
	                React.createElement(ComponentFormList, {ref: "formList", 
	                	onClickUpdate: this._onComponentFormListUpdate, 
	                	onClickRemove: this._onComponentFormListRemove})
				)
			)
		}
	})

/***/ },
/* 5 */
/***/ function(module, exports) {

	/** @jsx React.DOM */var history = ReactRouter.hashHistory;

	module.exports = React.createClass({displayName: "module.exports",
	    propTypes: {
	        onAddNewForm: React.PropTypes.func
	    },
	    _goToHome: function(){
	        history.push('/eformDev');
	    },
	    render: function(){
	        return (
	            React.createElement("div", {className: "page-bar"}, 
	                React.createElement("ul", {className: "page-breadcrumb"}, 
	                    React.createElement("li", null, 
	                        React.createElement("a", {onClick: this._goToHome}, "Home"), 
	                        React.createElement("i", {className: "fa fa-circle"})
	                    ), 
	                    React.createElement("li", null, 
	                        React.createElement("span", null, "E-Form Dev")
	                    )
	                ), 
	                React.createElement("div", {className: "page-toolbar"}, 
	                    React.createElement("div", {className: "pull-right"}, 
	                        React.createElement("button", {type: "button", className: "btn green btn-sm", onClick: this.props.onAddNewForm}, 
	                            React.createElement("i", {className: "fa fa-plus"}), " " + " " +
	                            "Add New E-Form"
	                        )
	                    )
	                )
	            )
	        )
	    }
	})

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var EFormService = __webpack_require__(7);
	var Link = ReactRouter.Link;

	module.exports = React.createClass({displayName: "module.exports",
	    propTypes: {
	        onClickUpdate: React.PropTypes.func,
	        onClickRemove: React.PropTypes.func
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
	    _onClickUpdate: function(item){
	        if(typeof this.props.onClickUpdate !== 'undefined')
	            this.props.onClickUpdate(item);
	    },
	    _onClickRemove: function(item){
	        if(typeof this.props.onClickRemove !== 'undefined')
	            this.props.onClickRemove(item);
	    },
		render: function(){
			var preList = null
	        var table = null
	        if(this.state.list.length === 0)
	            preList = React.createElement("p", {className: "font-red-thunderbird"}, "There is no data here")
	        else
	            table = React.createElement("table", {className: "table table-bordered table-striped table-condensed flip-content"}, 
	                        React.createElement("thead", {className: "flip-content"}, 
	                            React.createElement("tr", null, 
	                                React.createElement("th", {className: "bg-blue-dark bg-font-blue-dark"}, "Name"), 
	                                React.createElement("th", {className: "bg-blue-dark bg-font-blue-dark"}, "Action")
	                            )
	                        ), 
	                        React.createElement("tbody", null, 
	                            
	                                this.state.list.map(function(l,index){
	                                    return (
	                                        React.createElement("tr", {key: index}, 
	                                            React.createElement("td", null, l.Name), 
	                                            React.createElement("td", null, 
	                                                React.createElement(Link, {to: "/eformDev/detail/"+l.ID, 
	                                                    className: "label label-sm label-success"}, 
	                                                    "View Form"
	                                                ), 
	                                                " ", 
	                                                React.createElement("span", {className: "label label-sm label-success", 
	                                                    onClick: this._onClickUpdate.bind(this, l), 
	                                                    style: {cursor:'pointer'}}, 
	                                                    "Update Form"
	                                                ), 
	                                                " ", 
	                                                React.createElement("span", {className: "label label-sm label-success", 
	                                                    onClick: this._onClickRemove.bind(this, l), 
	                                                    style: {cursor:'pointer'}}, 
	                                                    "Remove Form"
	                                                )
	                                            )
	                                        )
	                                    )
	                                }.bind(this))
	                            
	                        )
	                    )
			return (
				React.createElement("div", {className: "row"}, 
	                React.createElement("div", {className: "col-md-12"}, 
	                    preList, 
	                    table
	                )
	            )
			)
		}
	})

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var Config = __webpack_require__(8);

	module.exports = {
		createPDFForm: function(data){
			var p = new Promise(function(resolve, reject){
				$.ajax({
					type: 'POST',
					headers: { 
					        'Accept': 'application/json',
					        'Content-Type': 'application/json' 
					},
					responseType:'arraybuffer',
					url: Config.apiPDFUrl+'print',
					data: JSON.stringify(data),
					dataType: 'binary',
					success: resolve,
					error: reject
				})
			});
			return p;
		},
		formCreate: function(data){
			var p = new Promise(function(resolve, reject){
				$.ajax({
					type: 'POST',
					url: Config.apiUrl+'eformtemplate/create',
					data: data,
					success: resolve
				})	
			});
			return p;
		},
		formList: function(){
			var p = new Promise(function(resolve, reject){
				$.ajax({
					type: 'GET',
					url: Config.apiUrl+'eformtemplate/list',
					success: resolve
				})	
			})
			return p;
		},
		formSave: function(data){
			var p = new Promise(function(resolve, reject){
				$.ajax({
					type: 'POST',
					data: data,
					url: Config.apiUrl+'eformtemplate/save',
					success: resolve
				})	
			})
			return p;
		},
		formDetail: function(data){
			var p = new Promise(function(resolve, reject){
				$.ajax({
					type: 'POST',
					data: data,
					url: Config.apiUrl+'eformtemplate/detail',
					success: resolve
				})	
			})
			return p;
		},
		formUpdate: function(data){
			var p = new Promise(function(resolve, reject){
				$.ajax({
					type: 'POST',
					data: data,
					url: Config.apiUrl+'eformtemplate/update',
					success: resolve
				})	
			})
			return p;
		},
		formRemove: function(data){
			var p = new Promise(function(resolve, reject){
				$.ajax({
					type: 'POST',
					data: data,
					url: Config.apiUrl+'eformtemplate/remove',
					success: resolve
				})
			})
			return p;
		},
		preFormDetail: function(data){
			var p = new Promise(function(resolve, reject){
				$.ajax({
					type: 'GET',
					url: Config.apiUrl+'api/appointment-wa-detail/'+data.UID,
					success: resolve
				})	
			})
			return p;
		},
		formClientSave: function(data){
			var p = new Promise(function(resolve, reject){
				$.ajax({
					type: 'POST',
					data: data,
					url: Config.apiUrl+'eform/save',
					success: resolve
				})	
			})
			return p;
		},
		formClientList: function(data){
			var p = new Promise(function(resolve, reject){
				$.ajax({
					type: 'POST',
					url: Config.apiUrl+'eform/list',
					data: data,
					success: resolve
				})	
			})
			return p;
		},
		formClientRemove: function(data){
			var p = new Promise(function(resolve, reject){
				$.ajax({
					type: 'POST',
					data: data,
					url: Config.apiUrl+'eform/remove',
					success: resolve
				})	
			})
			return p;
		},
		formClientDetail: function(data){
			var p = new Promise(function(resolve, reject){
				$.ajax({
					type: 'POST',
					data: data,
					url: Config.apiUrl+'eform/detail',
					success: resolve
				})	
			})
			return p;	
		},
		formClientUpdate: function(data){
			var p = new Promise(function(resolve, reject){
				$.ajax({
					type: 'POST',
					data: data,
					url: Config.apiUrl+'eform/update',
					success: resolve
				})	
			})
			return p;	
		}
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	/** @jsx React.DOM */module.exports = {
		apiUrl: 'https://localhost:3015/',
		apiServerUrl: 'https://192.168.1.235:3005/',
		apiPDFUrl: 'https://192.168.1.100:3019/',
		getParamsIframe: function(appointmentId, patientId){
			return '/eform?appoinmentUID='+appointmentId+'&patientUID='+patientId;
		},
		getDateTimeZone: function(date){
			if(date === '')
				return '';
			var res = date.charAt(2);
			if(res === '/'){
				var split = date.split('/');
				var z = moment().format('Z');
				return split[2]+'-'+split[1]+'-'+split[0]+' 00:00:00 '+z;
			}
		},
		setDate: function(date){
			if(date === '')
				return '';
			var dateTZ = moment(date).format('DD/MM/YYYY');
			return dateTZ;
		}
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var EFormService = __webpack_require__(7);
	var CommonInputText = __webpack_require__(10);

	module.exports = React.createClass({displayName: "module.exports",
		propTypes: {
			onSave: React.PropTypes.func
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
	            EFormService.formCreate(data)
	            .then(function(response){
	                self.props.onSave();
	            })
	        })
	    },
	    _onSave: function(){
	    	var name = this.refs.inputName.getValue();
	        this._serverCreateForm({name:name});
	    },
		render: function(){
			return (
				React.createElement("div", {className: "row"}, 
	                React.createElement("div", {className: "col-md-12"}, 
	                    React.createElement("form", null, 
	                        React.createElement("div", {className: "form-body"}, 
	                            React.createElement("div", {className: "form-group"}, 
	                                React.createElement("label", null, "Form Name"), 
	                                React.createElement(CommonInputText, {placeholder: "Form Name...", ref: "inputName"})
	                            ), 
	                            React.createElement("div", {className: "form-group", style: {float:'right'}}, 
	                                React.createElement("button", {type: "button", "data-dismiss": "modal", className: "btn btn-default"}, "Close"), 
	                                " ", 
	                                React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this._onSave}, "Save")
	                            )
	                        )
	                    )
	                )
	            )
			)
		}
	})

/***/ },
/* 10 */
/***/ function(module, exports) {

	/** @jsx React.DOM */module.exports = React.createClass({displayName: "module.exports",
	    propTypes: {
	        label: React.PropTypes.string,
	        name: React.PropTypes.string,
	        size: React.PropTypes.any,
	        groupId: React.PropTypes.string,
	        placeholder: React.PropTypes.string,
	        code: React.PropTypes.number,
	        type: React.PropTypes.string,
	        context: React.PropTypes.string,
	        onRightClickItem: React.PropTypes.func
	    },
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
	    },
	    setValue: function(value){
	        $(this.refs.input).val(value)
	    },
	    getValue: function(){
	        return $(this.refs.input).val()
	    },
	    getName: function(){
	        return this.props.name;
	    },
	    getLabel: function(){
	        return this.props.label;
	    },
	    getSize: function(){
	        return this.props.size;
	    },
	    getType: function(){
	        return this.props.type;
	    },
		render: function(){
	        var type = this.props.type;
	        var html = null;
	        switch(type){
	            case 'default':
	                html = (
	                    React.createElement("input", {type: "text", className: this.props.className, ref: "input", placeholder: this.props.placeholder})
	                )
	                break;
	            case 'itlh':
	                html = (
	                    React.createElement("div", {className: "dragula col-md-"+this.props.size, ref: "group"}, 
	                        React.createElement("div", {className: "form-group", id: this.props.groupId}, 
	                            React.createElement("label", {className: "control-label col-md-3"}, this.props.label), 
	                            React.createElement("div", {className: "col-md-9"}, 
	                                React.createElement("input", {type: "text", className: this.props.className, ref: "input", placeholder: this.props.placeholder})
	                            )
	                        )
	                    )
	                )
	                break;
	            case 'it':
	                html = (
	                    React.createElement("input", {type: "text", className: "form-control", ref: "input"})
	                )
	                break;
	            case 'itnl':
	                html = (
	                    React.createElement("div", {className: "dragula col-xs-"+this.props.size, ref: "group"}, 
	                        React.createElement("div", {className: "form-group", id: this.props.groupId}, 
	                            React.createElement("div", {className: "col-xs-12"}, 
	                                React.createElement("input", {type: "text", className: this.props.className, ref: "input", placeholder: this.props.placeholder})
	                            )
	                        )
	                    )
	                )
	        }
	        return html;
		}
	})

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var EFormService = __webpack_require__(7);
	var CommonInputText = __webpack_require__(10);

	module.exports = React.createClass({displayName: "module.exports",
	    item: null,
		propTypes: {
			onSave: React.PropTypes.func
		},
	    init: function(item){
	        this.item = item;
	        this.refs.inputName.setValue(this.item.Name);
	    },
		_serverUpdateForm: function(data){
	        var self = this;
	        swal({
	            title: 'Are you sure?',
	            text: 'You will update eform',
	            type: 'warning',
	            showCancelButton: true,
	            closeOnConfirm: false,
	            allowOutsideClick: true,
	            showLoaderOnConfirm: true
	        }, function(){
	            EFormService.formUpdate(data)
	            .then(function(response){
	                self.props.onSave();
	            })
	        })
	    },
	    _onSave: function(){
	    	var name = this.refs.inputName.getValue();
	        this._serverUpdateForm({name:name, id: this.item.ID});
	    },
		render: function(){
			return (
				React.createElement("div", {className: "row"}, 
	                React.createElement("div", {className: "col-md-12"}, 
	                    React.createElement("form", null, 
	                        React.createElement("div", {className: "form-body"}, 
	                            React.createElement("div", {className: "form-group"}, 
	                                React.createElement("label", null, "Form Name"), 
	                                React.createElement(CommonInputText, {placeholder: "Form Name...", ref: "inputName"})
	                            ), 
	                            React.createElement("div", {className: "form-group", style: {float:'right'}}, 
	                                React.createElement("button", {type: "button", "data-dismiss": "modal", className: "btn btn-default"}, "Close"), 
	                                " ", 
	                                React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this._onSave}, "Save")
	                            )
	                        )
	                    )
	                )
	            )
			)
		}
	})

/***/ },
/* 12 */
/***/ function(module, exports) {

	/** @jsx React.DOM */module.exports = React.createClass({displayName: "module.exports",
		propTypes: {
			portal: React.PropTypes.string.isRequired
		},
		show: function(){
			this.componentWillUnmount();
			this.mountPortal();
			var self = this;
			$('#'+this.props.portal).modal('show')
			$('#'+this.props.portal).on('hide.bs.modal', function(e){
				self.unmountPortal();
				self.mountPortal();
			});
		},
		hide: function(){
			$('#'+this.props.portal).modal('hide')
		},
		mountPortal: function(){
			if($('#'+this.props.portal).length === 0){
				var target = document.createElement('div');
				target.setAttribute('class','modal fade');
				target.setAttribute('data-width','760');
				target.setAttribute('id',this.props.portal);
				document.body.appendChild(target);
				this.renderPortal(target);
			}
		},
		unmountPortal: function(){
			$('#'+this.props.portal).parent().remove();
			$('#'+this.props.portal).remove();
			$('body').find('.modal-backdrop').remove();
		},
		componentDidMount: function(){
			this.mountPortal();
		},
		componentWillUnmount: function(){
			$('#'+this.props.portal).remove();
		},
		renderPortal: function(target){
			var component = React.createElement('div', null, this.props.children);
			ReactDOM.render(component, target);
		},
		render: function(){
			return null
		}
	})

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var ComponentPageBar = __webpack_require__(14);
	var ComponentSection = __webpack_require__(15);
	var EFormService = __webpack_require__(7);

	module.exports = React.createClass({displayName: "module.exports",
		getInitialState: function(){
			return {
	            name: 'New EForm',
	            sections: Immutable.List()
	        }
		},
		_loadPreview: function(){
	        EFormService.formDetail({id: this.props.params.formId})
	        .then(function(response){
	            var EFormTemplate = response.data;
	            var content = JSON.parse(response.data.EFormTemplateData.TemplateData);
	            this.setState(function(prevState){
	                return {
	                    name: EFormTemplate.Name,
	                    sections: Immutable.fromJS(content)
	                }
	            })    
	        }.bind(this))
	    },
	    componentDidMount: function(){
	        this._loadPreview();
	    },
		_onComponentPageBarAddNewSection: function(){
			this.setState(function(prevState){
	            return {
	                sections: prevState.sections.push(Immutable.Map({name: 'New Section', fields: Immutable.List()}))
	            }
	        })
			swal("Success!", "Your section has been created.", "success");
		},
		_onComponentSectionUpdate: function(code, name){
			this.setState(function(prevState){
	            return {
	                sections: prevState.sections.updateIn([code,'name'], function(val){return name;})
	            }
	        })
	        swal("Updated!", "Your section "+name+" has been updated.", "success")
		},
		_onComponentSectionRemove: function(code){
			this.setState(function(prevState){
	            return {
	                sections: prevState.sections.delete(code)
	            }
	        })
	        swal("Deleted!", "Your section has been deleted.", "success")
		},
		_onComponentSectionDrag: function(fromObj, toObj){
			var fromImmutable = this.state.sections.get(fromObj.codeSection);
	        var toImmutable = this.state.sections.get(toObj.codeSection);
	        this.setState(function(prevState){
	            return {
	                sections: prevState.sections.updateIn([fromObj.codeSection], function(val)  {return toImmutable;})
	            }
	        })
	        this.setState(function(prevState){
	            return {
	                sections: prevState.sections.updateIn([toObj.codeSection], function(val)  {return fromImmutable;})
	            }
	        })
	        swal("Success!", "Drag change section successfully.", "success");
		},
		_onComponentSectionSelectField: function(codeSection, codeField){
	        var fields = this.state.sections.get(codeSection).get('fields');
	        var ref = "field_"+codeSection+'_'+fields.size;
			if(codeField === 'label' || codeField === 'labelh'){
	            this.setState(function(prevState){
	                return {
	                    sections: prevState.sections.updateIn([codeSection,'fields'], function(val)  {return val.push(
	                        Immutable.Map(
	                            {code: codeField, label: 'Separate Label', size: '12', ref: ref}
	                        )
	                    );})
	                }
	            })
	        }else if(codeField === 'table'){
	            this.setState(function(prevState){
	                return {
	                    sections: prevState.sections.updateIn([codeSection,'fields'], function(val)  {return val.push(
	                        Immutable.fromJS({
	                            code: codeField,
	                            ref: ref,
	                            content: {
	                                cols: [{label: 'Label Table', type: 'it'}],
	                                rows: 1
	                            }
	                        })
	                    );})
	                }
	            })
	        }else if(codeField === 'break'){
	            this.setState(function(prevState){
	                return {
	                    sections: prevState.sections.updateIn([codeSection,'fields'], function(val)  {return val.push(
	                        Immutable.Map(
	                            {code: codeField, label: 'Separate Label', size: '12', ref: ref}
	                        )
	                    );})
	                }
	            })
	        }else{
	            this.setState(function(prevState){
	                return {
	                    sections: prevState.sections.updateIn([codeSection,'fields'], function(val)  {return val.push(
	                        Immutable.Map(
	                            {code: codeField, name: '', label: 'Label', size: '12', ref: ref, relationships: Immutable.List()}
	                        )
	                    );})
	                }
	            })
	        }
	        swal("Success!", "Add field successfully.", "success")
		},
		_onComponentSectionDragField: function(fromObj, toObj){
			var fromImmutable = this.state.sections.get(fromObj.codeSection).get('fields').get(fromObj.codeField);
	        var toImmutable = this.state.sections.get(toObj.codeSection).get('fields').get(toObj.codeField);

	        this.setState(function(prevState){
	            return {
	                sections: prevState.sections.updateIn([fromObj.codeSection,'fields',fromObj.codeField], function(val)  {return toImmutable;})
	            }
	        })
	        this.setState(function(prevState){
	            return {
	                sections: prevState.sections.updateIn([toObj.codeSection,'fields',toObj.codeField], function(val)  {return fromImmutable;})
	            }
	        })
	        swal("Success!", "Drag change field successfully.", "success");
		},
		_onComponentSectionRemoveField: function(codeSection, codeField){
			this.setState(function(prevState){
	            return {
	                sections: prevState.sections.deleteIn([codeSection,'fields',codeField])
	            }
	        })
	        swal("Deleted!", "Delete field successfully.", "success");
		},
		_onComponentSectionSaveFieldDetail: function(codeSection, dataField){
			if(dataField.type === 'label' && dataField.type === 'labelh')
	            this.setState(function(prevState){
	                return {
	                    sections: prevState.sections.updateIn([codeSection,'fields',dataField.code], function(val)  
	                            {return val.set('label',dataField.label)
	                            .set('size',dataField.size);}
	                    )
	                }
	            })
	        else{
	            if(dataField.type === 'rlh'){
	                this.setState(function(prevState){
	                    return {
	                        sections: prevState.sections.updateIn([codeSection,'fields',dataField.code], function(val)  
	                                {return val.set('name',dataField.name)
	                                .set('label',dataField.label)
	                                .set('size',dataField.size)
	                                .set('value',dataField.value);}
	                        )
	                    }
	                })
	            }else{
	                this.setState(function(prevState){
	                    return {
	                        sections: prevState.sections.updateIn([codeSection,'fields',dataField.code], function(val)  
	                                {return val.set('name',dataField.name)
	                                .set('label',dataField.label)
	                                .set('size',dataField.size);}
	                        )
	                    }
	                })
	            }
	        }
	        swal("Success!", "Edit field successfully.", "success");
		},
		_onComponentSectionCreateTableRow: function(codeSection, codeField){
			this.setState(function(prevState){
	            return {
	                sections: prevState.sections.updateIn([codeSection,'fields',codeField,'content','rows'], function(val)  {return val+1;})
	            }
	        })
	        swal("Success!", "Add row table successfully.", "success")
		},
		_onComponentSectionCreateTableColumn: function(codeSection, codeField){
			this.setState(function(prevState){
	            return {
	                sections: prevState.sections.updateIn([codeSection,'fields',codeField,'content','cols'], function(val)  {return val.push(
	                    Immutable.Map(
	                        {label: 'Label Table', type: 'it'}
	                    )
	                );})
	            }
	        })
	        swal("Success!", "Add column table successfully.", "success");
		},
		_onComponentSectionRemoveTableRow: function(codeSection, codeField){
			var row = this.state.sections.get(codeSection).get('fields').get(codeField).get('content').get('rows');
	        if(row > 1){
	            this.setState(function(prevState){
	                return {
	                    sections: prevState.sections.updateIn([codeSection,'fields',codeField,'content','rows'], function(val)  {return val-1;})
	                }
	            })
	            swal("Success!", "Delete row table successfully.", "success")
	        }else
	            swal("Warning!", "Must contain 1 row.", "warning")
		},
		_onComponentSectionRemoveTableColumn: function(codeSection, codeField, codeColumn){
			var columns = this.state.sections.get(codeSection).get('fields').get(codeField).get('content').get('cols')
	        if(columns.size > 1){
	            this.setState(function(prevState){
	                return {
	                    sections: prevState.sections.deleteIn([codeSection,'fields',codeField,'content','cols',codeColumn])
	                }
	            })
	            swal("Success!", "Delete column table successfully.", "success")
	        }else
	            swal("Warning!", "Must contain 1 column.", "warning")
		},
		_onComponentSectionUpdateTableColumn: function(codeSection, codeField, data){
			 this.setState(function(prevState){
	            return {
	                sections: prevState.sections.updateIn([codeSection,'fields',codeField,'content','cols',data.code], function(val)  
	                    {return val.set('label', data.label)
	                        .set('type', data.type);}
	                )
	            }
	        })
	        swal("Success!", "Update column table successfully.", "success")
		},
		_onComponentPageBarSaveForm: function(){
			var formId = this.props.params.formId;
	        var content = this.state.sections.toJS();
	        EFormService.formSave({id: formId, content: JSON.stringify(content)})
	        .then(function(response){
	            swal("Success!", "Your form has been saved.", "success");
	        }.bind(this))
		},
		render: function(){
			return (
				React.createElement("div", {className: "page-content"}, 
					React.createElement(ComponentPageBar, {ref: "pageBar", 
						onAddNewSection: this._onComponentPageBarAddNewSection, 
						onSaveForm: this._onComponentPageBarSaveForm}), 
					React.createElement("h3", {className: "page-title"}, this.state.name), 
	                
	                	this.state.sections.map(function(section, index){
	                		return React.createElement(ComponentSection, {key: index, 
	                			ref: "section", 
	                			key: index, 
	                			code: index, 
	                			fields: section.get('fields'), 
	                			name: section.get('name'), 
	                			onUpdateSection: this._onComponentSectionUpdate, 
	                			onRemoveSection: this._onComponentSectionRemove, 
	                			onDragSection: this._onComponentSectionDrag, 
	                			onSelectField: this._onComponentSectionSelectField, 
	                			onDragField: this._onComponentSectionDragField, 
	                			onRemoveField: this._onComponentSectionRemoveField, 
	                			onSaveFieldDetail: this._onComponentSectionSaveFieldDetail, 
	                			onCreateTableRow: this._onComponentSectionCreateTableRow, 
	                			onRemoveTableRow: this._onComponentSectionRemoveTableRow, 
	                			onCreateTableColumn: this._onComponentSectionCreateTableColumn, 
	                			onRemoveTableColumn: this._onComponentSectionRemoveTableColumn, 
	                			onUpdateTableColumn: this._onComponentSectionUpdateTableColumn})
	                	}, this)
	                
				)
			)
		}
	})

/***/ },
/* 14 */
/***/ function(module, exports) {

	/** @jsx React.DOM */var history = ReactRouter.hashHistory;

	module.exports = React.createClass({displayName: "module.exports",
		propTypes: {
			onAddNewSection: React.PropTypes.func,
			onSaveForm: React.PropTypes.func
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
			swal({
				title: 'Are you sure?',
				text: 'You will save this form !!!',
				type: 'warning',
				showCancelButton: true,
				closeOnConfirm: false,
				allowOutsideClick: false,
				showLoaderOnConfirm: true
			}, function(){
				this.props.onSaveForm();
			}.bind(this))
		},
	            _goToHome: function(){
	                history.push('/eformDev');
	            },
		render: function(){
			return (
				React.createElement("div", {className: "page-bar"}, 
					React.createElement("ul", {className: "page-breadcrumb"}, 
	                    React.createElement("li", null, 
	                        React.createElement("a", {onClick: this._goToHome}, "Home"), 
	                        React.createElement("i", {className: "fa fa-circle"})
	                    ), 
	                    React.createElement("li", null, 
	                        React.createElement("span", null, "E-Form Dev")
	                    )
	                ), 
	                React.createElement("div", {className: "page-toolbar"}, 
	                    React.createElement("div", {className: "pull-right"}, 
	                    	React.createElement("button", {type: "button", className: "btn green btn-sm", onClick: this._onAddNewSection}, 
	                    		React.createElement("i", {className: "fa fa-plus"}), " " + " " +
	                    		"Add New Section"
							), 
							" ", 
							React.createElement("button", {type: "button", className: "btn green btn-sm", onClick: this._onSaveForm}, 
	                    		React.createElement("i", {className: "fa fa-save"}), " " + " " +
	                    		"Save Form"
							)
	                    )
	                )
				)
			)
		}
	})

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var CommonModal = __webpack_require__(12);
	var CommonInputText = __webpack_require__(10);
	var CommonInputDate = __webpack_require__(16);
	var CommonTextArea = __webpack_require__(17);
	var CommonCheckbox = __webpack_require__(18);
	var CommonRadio = __webpack_require__(19);
	var CommonLabel = __webpack_require__(20);
	var CommonTable = __webpack_require__(21);
	var ComponentFormUpdateSection = __webpack_require__(24);
	var ComponentListField = __webpack_require__(25);
	var ComponentFieldDetail = __webpack_require__(26);

	module.exports = React.createClass({displayName: "module.exports",
		drakeSection: null,
		drakeField: null,
		propTypes: {
			code: React.PropTypes.number,
	        type: React.PropTypes.string,
			onUpdateSection: React.PropTypes.func,
			onRemoveSection: React.PropTypes.func,
			onDragSection: React.PropTypes.func,
			onSelectField: React.PropTypes.func,
			onDragField: React.PropTypes.func,
			onRemoveField: React.PropTypes.func,
			onSaveFieldDetail: React.PropTypes.func,
			onCreateTableRow: React.PropTypes.func,
			onRemoveTableRow: React.PropTypes.func,
			onCreateTableColumn: React.PropTypes.func,
			onRemoveTableColumn: React.PropTypes.func,
			onUpdateTableColumn: React.PropTypes.func
		},
	    getDefaultProps: function(){
	        return {
	            code: 0,
	            type: 'dev'
	        }
	    },
		componentDidMount: function(){
	        if(this.props.type === 'dev'){
	            this._dragAndDropSections();
	            this._dragAndDropFields();
	        }
	    },
	    componentDidUpdate: function(prevProps,prevState){
	        if(this.props.type === 'dev'){
	            this.drakeSection.destroy();
	            this.drakeField.destroy();
	            this._dragAndDropSections();
	            this._dragAndDropFields();
	        }
	    },
	    _dragAndDropFields: function(){
	    	var self = this;
	    	this.drakeField = dragula([].slice.apply(document.querySelectorAll('.dragula')),{
	            copy: true,
	            revertOnSpill: true
	        });
	    	this.drakeField.on('drop', function(el,target,source,sibling){
	    		if (el.parentNode == target) {
	                target.removeChild(el)
	            }
	            swal({
	                title: 'Are you sure?',
	                text: 'You will change this field',
	                type: 'warning',
	                showCancelButton: true,
	                closeOnConfirm: false,
	                closeOnCancel: false
	            }, function(isConfirm){
	                if(isConfirm){
	                    var fromEl = el.id
	                    var targetArray = $(target).find('.form-group')
	                    $.each(targetArray, function(index, value){
	                        var tempId = $(value).attr('id')
	                        if(tempId !== fromEl){
	                            var fromArr = fromEl.split('_')
	                            var toArr = tempId.split('_')
	                            var fromObj = {codeSection: fromArr[1], codeField: fromArr[2]}
	                            var toObj = {codeSection: toArr[1], codeField: toArr[2]}
	                            self.props.onDragField(fromObj, toObj)
	                        }
	                    })
	                }else{
	                    swal("No change", "Form will refresh.", "success")
	                }
	            })
	        })
	    },
	    _dragAndDropSections:function(){
	    	var self = this;
	    	this.drakeSection = dragula([].slice.apply(document.querySelectorAll('.dragulaSection')),{
	            copy: true,
	            revertOnSpill: true,
	            moves: function(el, container, handle){
	                return handle.className.indexOf('dragulaSectionHandler') > -1;
	            }
	        });
	    	this.drakeSection.on('drop', function(el,target,source,sibling){
	    		if (el.parentNode == target) {
	                target.removeChild(el)
	            }
	            swal({
	                title: 'Are you sure?',
	                text: 'You will change this section',
	                type: 'warning',
	                showCancelButton: true,
	                closeOnConfirm: false,
	                closeOnCancel: false
	            }, function(isConfirm){
	                if(isConfirm){
	                    var fromEl = el.id
	                    var targetArray = $(target).find('.portlet')
	                    $.each(targetArray, function(index, value){
	                        var tempId = $(value).attr('id')
	                        if(tempId !== fromEl){
	                            var fromArr = fromEl.split('_')
	                            var toArr = tempId.split('_')
	                            var fromObj = {codeSection: fromArr[1]}
	                            var toObj = {codeSection: toArr[1]}
	                            self.props.onDragSection(fromObj, toObj)
	                        }
	                    })
	                }else{
	                    swal("No change", "Form will refresh.", "success")
	                }
	            })
	        })
	    },
		_onCreateFieldSection: function(){
			this.refs.modalCreateFieldSection.show();
		},
		_onUpdateSection: function(){
			this.refs.modalUpdateSection.show();
		},
		_onRemoveSection: function(){
			var self = this;
			swal({
	            title: 'Are you sure?',
	            text: 'You will delete section '+this.props.name,
	            type: 'warning',
	            showCancelButton: true,
	            closeOnConfirm: false,
	            allowOutsideClick: true
	        }, function(){
	            self.props.onRemoveSection(self.props.code);
	        })
		},
		_onSaveUpdateSection: function(){
			var name = this.refs.formUpdateSection.getName();
			var self = this;
	        swal({
	            title: 'Are you sure?',
	            text: 'You will edit section '+this.props.name,
	            type: 'warning',
	            showCancelButton: true,
	            closeOnConfirm: false,
	            allowOutsideClick: true
	        }, function(){
	            self.refs.modalUpdateSection.hide()
	            self.props.onUpdateSection(self.props.code, name)
	        })
		},
		_onComponentListFieldSelect: function(item){
			this.refs.modalCreateFieldSection.hide();
	        this.props.onSelectField(this.props.code,item.get('code'));
		},
		_onRightClickItem: function(code, e, ref){
			var id = $(e.target).attr('id')
	        if(typeof id === 'undefined')
	            id = $(e.target).parent().attr('id')
	        var type = this.refs[ref].getType();
	        var label = this.refs[ref].getLabel();
	        var size = this.refs[ref].getSize();
	        var dataFieldDetail = null;
	        if(type !== 'label' && type !== 'labelh'){
	            var name = this.refs[ref].getName();
	            if(type === 'rlh'){
	                var value = this.refs[ref].getValue();
	                dataFieldDetail = {
	                    name: name, label: label, size: size, code: code, type: type, ref: ref, value: value
	                }
	            }else
	                dataFieldDetail = {
	                    name: name, label: label, size: size, code: code, type: type, ref: ref
	                }
	        }else{
	            dataFieldDetail = {
	                label: label, size: size, code: code, type: type, ref: ref
	            }
	        }
	        switch(id){
	            case 'editField':
	                this.refs.modalFieldDetail.show();
	                this.refs.fieldDetail.init(dataFieldDetail);
	                break;
	            case 'deleteField':
	            	var self = this;
	                swal({
	                    title: 'Are you sure?',
	                    text: 'You will delete this field ?',
	                    type: 'warning',
	                    showCancelButton: true,
	                    closeOnConfirm: false,
	                    allowOutsideClick: true
	                }, function(){
	                    self.props.onRemoveField(self.props.code, code);
	                })
	                break;
	        }
		},
		_onComponentFieldDetailSave: function(data){
			var self = this;
			swal({
	            title: 'Are you sure?',
	            text: 'You will edit this field',
	            type: 'warning',
	            showCancelButton: true,
	            closeOnConfirm: false,
	            allowOutsideClick: true
	        }, function(){
	            if(data.type === 'rlh'){
	                self.refs[data.ref].setValue(data.value);
	            }
	            self.props.onSaveFieldDetail(self.props.code,data);
	            self.refs.modalFieldDetail.hide()
	        })
		},
		_onRightClickTableItem: function(code, e){
			var id = $(e.target).attr('id');
	        if(typeof id === 'undefined')
	            id = $(e.target).parent().attr('id');
	       	var ref = "field"+code;
	       	var self = this;
	        switch(id){
	            case 'deleteTable':
	                swal({
	                    title: 'Are you sure?',
	                    text: 'You will delete this table.',
	                    type: 'warning',
	                    showCancelButton: true,
	                    closeOnConfirm: false,
	                    allowOutsideClick: true
	                }, function(){
	                    self.props.onRemoveField(self.props.code, code);
	                })
	                break;
	            case 'addRow':
	                swal({
	                    title: 'Are you sure?',
	                    text: 'You will add a row into this table.',
	                    type: 'warning',
	                    showCancelButton: true,
	                    closeOnConfirm: false,
	                    allowOutsideClick: true
	                }, function(){
	                    self.props.onCreateTableRow(self.props.code, code);
	                })
	                break;
	            case 'deleteRow':
	                swal({
	                    title: 'Are you sure?',
	                    text: 'You will delete a row in this table.',
	                    type: 'warning',
	                    showCancelButton: true,
	                    closeOnConfirm: false,
	                    allowOutsideClick: true
	                }, function(){
	                    self.props.onRemoveTableRow(self.props.code, code);
	                })
	                break;
	            case 'addCol':
	                swal({
	                    title: 'Are you sure?',
	                    text: 'You will add a column into this table.',
	                    type: 'warning',
	                    showCancelButton: true,
	                    closeOnConfirm: false,
	                    allowOutsideClick: true
	                }, function(){
	                    self.props.onCreateTableColumn(self.props.code, code);
	                })
	                break;
	        }
		},
		_onDeleteColumn: function(codeField, codeColumn){
			this.props.onRemoveTableColumn(this.props.code, codeField, codeColumn);
		},
		_onUpdateColumn: function(codeField, data){
			this.props.onUpdateTableColumn(this.props.code, codeField, data);
		},
	    getAllFieldValueWithValidation: function(){
	        var fields = this.props.fields.toJS();
	        var results = [];
	        for(var i = 0; i < fields.length; i++){
	            var field = fields[i];
	            var fieldRef = field.ref;
	            if(typeof this.refs[fieldRef] !== 'undefined'){
	                var type = this.refs[fieldRef].getType();
	                if(type !== 'table' && type !== 'label' && type !== 'labelh' && type !== 'rlh' && type !== 'idnl'){
	                    var value = this.refs[fieldRef].getValue();
	                    var name = this.refs[fieldRef].getName();
	                    results.push({value: value, name: name, ref: fieldRef, type: type});
	                }else if(type === 'table'){
	                    var tableFields = this.refs[fieldRef].getAllValue();
	                    tableFields.map(function(tableField, index){
	                        results.push(tableField);
	                    })
	                }else if(type === 'rlh'){
	                    var isChecked = this.refs[fieldRef].isChecked();
	                    var value = this.refs[fieldRef].getValue();
	                    var name = this.refs[fieldRef].getName();
	                    results.push({value: value, name: name, ref: fieldRef, type: type, checked: isChecked});
	                }else if(type === 'idnl'){
	                    var value = this.refs[fieldRef].getText();
	                    var name = this.refs[fieldRef].getName();
	                    results.push({value: value, name: name, ref: fieldRef, type: type});
	                }
	            }
	        }
	        return results;
	    },
	    setValue: function(fieldRef, value){
	        if(typeof this.refs[fieldRef] !== 'undefined')
	            this.refs[fieldRef].setValue(value);
	    },
	    setValueForRadio:function(fieldRef){
	        if(typeof this.refs[fieldRef] !== 'undefined')
	            this.refs[fieldRef].setChecked();  
	    },
	    setValueForTable: function(fieldRef, fieldRefChild, value){
	        if(typeof this.refs[fieldRef] !== 'undefined')
	            this.refs[fieldRef].setValue(fieldRefChild, value);
	    },
		render: function(){
	        var displayType = (this.props.type === 'dev')?'inline-block':'none';
	        var displayContextMenu = (this.props.type === 'dev')?'contextMenu':'none';
	        var displayContextTableMenu = (this.props.type === 'dev')?'contextTableMenu':'none';
			return (
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {id: "contextMenu"}, 
	                    React.createElement("ul", {className: "dropdown-menu", role: "menu"}, 
	                        React.createElement("li", null, React.createElement("a", {id: "editField"}, React.createElement("i", {className: "icon-pencil"}), " Edit Field")), 
	                        React.createElement("li", null, React.createElement("a", {id: "deleteField"}, React.createElement("i", {className: "icon-trash"}), " Delete Field"))
	                    )
	                ), 
	                React.createElement("div", {id: "contextTableMenu"}, 
	                    React.createElement("ul", {className: "dropdown-menu", role: "menu"}, 
	                        React.createElement("li", null, React.createElement("a", {id: "addCol"}, React.createElement("i", {className: "icon-note"}), " Add Column")), 
	                        React.createElement("li", null, React.createElement("a", {id: "addRow"}, React.createElement("i", {className: "icon-note"}), " Add Row")), 
	                        React.createElement("li", null, React.createElement("a", {id: "deleteRow"}, React.createElement("i", {className: "icon-trash"}), " Delete Row")), 
	                        React.createElement("li", null, React.createElement("a", {id: "deleteTable"}, React.createElement("i", {className: "icon-trash"}), " Delete Table"))
	                    )
	                ), 
					React.createElement(CommonModal, {ref: "modalUpdateSection", portal: "modalUpdateSection"}, 
	                    React.createElement("div", {className: "modal-header"}, 
	                        React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-hidden": "true"}, "×"), 
	                        React.createElement("h4", {className: "modal-title"}, "Update Section")
	                    ), 
	                    React.createElement("div", {className: "modal-body"}, 
	                        React.createElement(ComponentFormUpdateSection, {ref: "formUpdateSection", name: this.props.name})
	                    ), 
	                    React.createElement("div", {className: "modal-footer"}, 
	                        React.createElement("button", {type: "button", "data-dismiss": "modal", className: "btn btn-default"}, "Close"), 
	                        React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this._onSaveUpdateSection}, "Save")
	                    )
	                ), 
	                React.createElement(CommonModal, {ref: "modalCreateFieldSection", portal: "modalCreateFieldSection"}, 
	                    React.createElement("div", {className: "modal-header"}, 
	                        React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-hidden": "true"}, "×"), 
	                        React.createElement("h4", {className: "modal-title"}, "List Field")
	                    ), 
	                    React.createElement("div", {className: "modal-body"}, 
	                        React.createElement(ComponentListField, {ref: "listField", onSelectItem: this._onComponentListFieldSelect})
	                    )
	                ), 
	                React.createElement(CommonModal, {ref: "modalFieldDetail", portal: "modalFieldDetail"}, 
	                    React.createElement("div", {className: "modal-header"}, 
	                        React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-hidden": "true"}, "×"), 
	                        React.createElement("h4", {className: "modal-title"}, "Modal Field Detail")
	                    ), 
	                    React.createElement("div", {className: "modal-body"}, 
	                        React.createElement(ComponentFieldDetail, {ref: "fieldDetail", onSave: this._onComponentFieldDetailSave})
	                    )
	                ), 
					React.createElement("div", {className: "col-md-12 dragulaSection"}, 
						React.createElement("div", {className: "portlet box green", id: "dragulaSection_"+this.props.code}, 
							React.createElement("div", {className: "portlet-title"}, 
								React.createElement("div", {className: "caption"}, 
	                                this.props.name, 
	                                " ", 
	                                React.createElement("span", {className: "label label-sm label-primary dragulaSectionHandler", 
	                                    style: {display: displayType}}, 
	                                    "Drag here"
	                                )
	                            ), 
	                            React.createElement("div", {className: "tools", style: {display: displayType}}, 
	                                React.createElement("a", {className: "collapse"})
	                            ), 
	                            React.createElement("div", {className: "actions", style: {display: displayType}}, 
	                                React.createElement("div", {className: "btn-group"}, 
	                                    React.createElement("a", {className: "btn btn-default btn-sm", "data-toggle": "dropdown"}, 
	                                        "Action ", 
	                                        React.createElement("i", {className: "fa fa-angle-down"})
	                                    ), 
	                                    React.createElement("ul", {className: "dropdown-menu pull-right"}, 
	                                        React.createElement("li", null, 
	                                            React.createElement("a", {onClick: this._onCreateFieldSection}, 
	                                                React.createElement("i", {className: "fa fa-plus"}), " Create Field"
	                                            )
	                                        ), 
	                                        React.createElement("li", {className: "divider"}), 
	                                        React.createElement("li", null, 
	                                            React.createElement("a", {onClick: this._onUpdateSection}, 
	                                                React.createElement("i", {className: "fa fa-pencil"}), " Update Section"
	                                            )
	                                        ), 
	                                        React.createElement("li", null, 
	                                            React.createElement("a", {onClick: this._onRemoveSection}, 
	                                                React.createElement("i", {className: "fa fa-trash-o"}), " Remove Section"
	                                            )
	                                        )
	                                    )
	                                )
	                            )
							), 
							React.createElement("div", {className: "portlet-body form flip-scroll"}, 
	                            React.createElement("form", {className: "form-horizontal"}, 
	                                React.createElement("div", {className: "form-body"}, 
	                                	React.createElement("div", {className: "row"}, 
		                                	
		                                		this.props.fields.map(function(field,index){
		                                			var tempField = field.get('code')
	                                                if(tempField === 'itlh' || tempField === 'itnl')
	                                                    return React.createElement(CommonInputText, {key: index, type: tempField, 
	                                                        groupId: 'fieldgroup_'+this.props.code+'_'+index, 
	                                                        name: field.get('name'), 
	                                                        label: field.get('label'), 
	                                                        size: field.get('size'), 
	                                                        context: displayContextMenu, 
	                                                        ref: field.get('ref'), 
	                                                        refTemp: field.get('ref'), 
	                                                        code: index, 
	                                                        onRightClickItem: this._onRightClickItem})
	                                                else if(tempField === 'idlh' || tempField === 'idnl')
	                                                    return React.createElement(CommonInputDate, {key: index, type: tempField, 
	                                                        groupId: 'fieldgroup_'+this.props.code+'_'+index, 
	                                                        name: field.get('name'), 
	                                                        label: field.get('label'), 
	                                                        size: field.get('size'), 
	                                                        context: displayContextMenu, 
	                                                        ref: field.get('ref'), 
	                                                        refTemp: field.get('ref'), 
	                                                        code: index, 
	                                                        onRightClickItem: this._onRightClickItem})
	                                                else if(tempField === 'tlh' || tempField === 'tnl')
	                                                    return React.createElement(CommonTextArea, {key: index, type: tempField, 
	                                                        groupId: 'fieldgroup_'+this.props.code+'_'+index, 
	                                                        name: field.get('name'), 
	                                                        label: field.get('label'), 
	                                                        size: field.get('size'), 
	                                                        context: displayContextMenu, 
	                                                        ref: field.get('ref'), 
	                                                        refTemp: field.get('ref'), 
	                                                        code: index, 
	                                                        onRightClickItem: this._onRightClickItem})
	                                                else if(tempField === 'clh')
	                                                    return React.createElement(CommonCheckbox, {key: index, type: tempField, 
	                                                        name: field.get('name'), 
	                                                        groupId: 'fieldgroup_'+this.props.code+'_'+index, 
	                                                        label: field.get('label'), 
	                                                        size: field.get('size'), 
	                                                        context: displayContextMenu, 
	                                                        ref: field.get('ref'), 
	                                                        refTemp: field.get('ref'), 
	                                                        code: index, 
	                                                        onRightClickItem: this._onRightClickItem})
	                                                else if(tempField === 'rlh')
	                                                    return React.createElement(CommonRadio, {key: index, type: tempField, 
	                                                        name: field.get('name'), 
	                                                        groupId: 'fieldgroup_'+this.props.code+'_'+index, 
	                                                        label: field.get('label'), 
	                                                        size: field.get('size'), 
	                                                        context: displayContextMenu, 
	                                                        ref: field.get('ref'), 
	                                                        refTemp: field.get('ref'), 
	                                                        code: index, 
	                                                        value: field.get('value'), 
	                                                        onRightClickItem: this._onRightClickItem})
	                                                else if(tempField === 'label' || tempField === 'labelh')
	                                                    return React.createElement(CommonLabel, {key: index, type: tempField, 
	                                                        label: field.get('label'), 
	                                                        groupId: 'fieldgroup_'+this.props.code+'_'+index, 
	                                                        size: field.get('size'), 
	                                                        context: displayContextMenu, 
	                                                        ref: field.get('ref'), 
	                                                        refTemp: field.get('ref'), 
	                                                        code: index, 
	                                                        onRightClickItem: this._onRightClickItem})
	                                                else if(tempField === 'table')
	                                                    return React.createElement(CommonTable, {key: index, type: tempField, 
	                                                        content: field.get('content'), 
	                                                        groupId: 'fieldgroup_'+this.props.code+'_'+index, 
	                                                        context: displayContextTableMenu, 
	                                                        ref: field.get('ref'), 
	                                                        refTemp: field.get('ref'), 
	                                                        code: index, 
	                                                        onDeleteColumn: this._onDeleteColumn, 
	                                                        onUpdateColumn: this._onUpdateColumn, 
	                                                        onRightClickItem: this._onRightClickTableItem})
	                                                else if(tempField === 'break')
	                                                    return React.createElement("div", {key: index, style: {clear: 'both'}})
		                                		}, this)	
		                                	
	                                	)
	                                )
	                            )
	                        )
						)
					)
				)
			)
		}
	})

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var Config = __webpack_require__(8);

	module.exports = React.createClass({displayName: "module.exports",
	    propTypes: {
	        label: React.PropTypes.string,
	        name: React.PropTypes.string,
	        size: React.PropTypes.any,
	        groupId: React.PropTypes.string,
	        placeholder: React.PropTypes.string,
	        code: React.PropTypes.number,
	        type: React.PropTypes.string,
	        context: React.PropTypes.string,
	        onRightClickItem: React.PropTypes.func
	    },
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
	        $(this.refs.input).datepicker({
	            autoclose: true,
	            format: 'dd/mm/yyyy',
	            orientation: "auto top"
	        });
	        if(typeof this.refs.group !== 'undefined' && this.props.context !== 'none'){
	            $(this.refs.group).contextmenu({
	                target: '#'+this.props.context,
	                before: function(e, element, target) {                    
	                    e.preventDefault();
	                    return true;
	                },
	                onItem: function(element, e) {
	                    this.props.onRightClickItem(this.props.code, e, this.props.refTemp)
	                }.bind(this)
	            })
	        }
	    },
	    setValue: function(value){
	        value = Config.setDate(value);
	        $(this.refs.input).datepicker("update", value);
	    },
	    getValue: function(){
	        var value = $(this.refs.input).val();
	        return Config.getDateTimeZone(value);
	    },
	    getText: function(){
	        var value = $(this.refs.input).val();
	        return value;
	    },
	    getName: function(){
	        return this.props.name;
	    },
	    getLabel: function(){
	        return this.props.label;
	    },
	    getSize: function(){
	        return this.props.size;
	    },
	    getType: function(){
	        return this.props.type;
	    },
		render: function(){
	        var type = this.props.type;
	        var html = null;
	        switch(type){
	            case 'default':
	                html = (
	                    React.createElement("input", {type: "text", className: this.props.className, name: this.props.name, ref: "input", placeholder: this.props.placeholder})
	                )
	                break;
	            case 'idlh':
	                html = (
	                    React.createElement("div", {className: "dragula col-md-"+this.props.size, ref: "group"}, 
	                        React.createElement("div", {className: "form-group", id: this.props.groupId}, 
	                            React.createElement("label", {className: "control-label col-md-3"}, this.props.label), 
	                            React.createElement("div", {className: "col-md-9"}, 
	                                React.createElement("input", {type: "text", className: this.props.className, name: this.props.name, ref: "input", placeholder: this.props.placeholder})
	                            )
	                        )
	                    )
	                )
	                break;
	            case 'idnl':
	                html = (
	                    React.createElement("div", {className: "dragula col-xs-"+this.props.size, ref: "group"}, 
	                        React.createElement("div", {className: "form-group", id: this.props.groupId}, 
	                            React.createElement("div", {className: "col-xs-12"}, 
	                                React.createElement("input", {type: "text", className: this.props.className, name: this.props.name, ref: "input", placeholder: this.props.placeholder})
	                            )
	                        )
	                    )
	                )
	                break;
	        }
	        return html;
		}
	})

/***/ },
/* 17 */
/***/ function(module, exports) {

	/** @jsx React.DOM */module.exports = React.createClass({displayName: "module.exports",
	    propTypes: {
	        label: React.PropTypes.string,
	        name: React.PropTypes.string,
	        size: React.PropTypes.any,
	        groupId: React.PropTypes.string,
	        placeholder: React.PropTypes.string,
	        code: React.PropTypes.number,
	        type: React.PropTypes.string,
	        context: React.PropTypes.string,
	        onRightClickItem: React.PropTypes.func
	    },
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
	                    this.props.onRightClickItem(this.props.code, e, this.props.refTemp)
	                }.bind(this)
	            })
	        }
	    },
	    setValue: function(value){
	        $(this.refs.input).val(value)
	    },
	    getValue: function(){
	        return $(this.refs.input).val()
	    },
	    getName: function(){
	        return this.props.name;
	    },
	    getLabel: function(){
	        return this.props.label;
	    },
	    getSize: function(){
	        return this.props.size;
	    },
	    getType: function(){
	        return this.props.type;
	    },
		render: function(){
	        var type = this.props.type
	        var html = null
	        switch(type){
	            case 'default':
	                html = (
	                    React.createElement("textarea", {className: this.props.className, name: this.props.name, id: this.props.id, ref: "input", placeholder: this.props.placeholder})
	                )
	                break;
	            case 'tlh':
	                html = (
	                    React.createElement("div", {className: "dragula col-md-"+this.props.size, ref: "group"}, 
	                        React.createElement("div", {className: "form-group", id: this.props.groupId}, 
	                            React.createElement("label", {className: "control-label col-md-3"}, this.props.label), 
	                            React.createElement("div", {className: "col-md-9"}, 
	                                React.createElement("textarea", {className: this.props.className, name: this.props.name, id: this.props.id, ref: "input", placeholder: this.props.placeholder})
	                            )
	                        )
	                    )
	                )
	                break;
	            case 'tnl':
	                html = (
	                    React.createElement("div", {className: "dragula col-xs-"+this.props.size, ref: "group"}, 
	                        React.createElement("div", {className: "form-group", id: this.props.groupId}, 
	                            React.createElement("div", {className: "col-xs-12"}, 
	                                React.createElement("textarea", {className: this.props.className, name: this.props.name, id: this.props.id, ref: "input", placeholder: this.props.placeholder})
	                            )
	                        )
	                    )
	                )
	                break;
	        }
	        return html;
		}
	})

/***/ },
/* 18 */
/***/ function(module, exports) {

	/** @jsx React.DOM */module.exports = React.createClass({displayName: "module.exports",
	    value: 'no',
	    propTypes: {
	        label: React.PropTypes.string,
	        name: React.PropTypes.string,
	        size: React.PropTypes.any,
	        groupId: React.PropTypes.string,
	        placeholder: React.PropTypes.string,
	        code: React.PropTypes.number,
	        type: React.PropTypes.string,
	        context: React.PropTypes.string,
	        onRightClickItem: React.PropTypes.func
	    },
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
	        var self = this;
	        $(this.refs.input).iCheck({
	            labelHover: false,
	            cursor: true,
	            checkboxClass: 'icheckbox_square-green'
	        })
	        $(this.refs.input).on('ifChecked', function(event){
	            self.value = 'yes';
	        })
	        $(this.refs.input).on('ifUnchecked', function(event){
	            self.value = 'no';
	        })
	        if(typeof this.refs.group !== 'undefined' && this.props.context !== 'none'){
	            $(this.refs.group).contextmenu({
	                target: '#'+this.props.context,
	                before: function(e, element, target) {                    
	                    e.preventDefault();
	                    return true;
	                },
	                onItem: function(element, e) {
	                    this.props.onRightClickItem(this.props.code, e, this.props.refTemp)
	                }.bind(this)
	            })
	        }
	    },
	    setValue: function(value){
	        this.value = value;
	        if(this.value === 'yes')
	            $(this.refs.input).iCheck('check');
	        else
	            $(this.refs.input).iCheck('uncheck');
	    },
	    getValue: function(){
	        return this.value;
	    },
	    getName: function(){
	        return this.props.name;
	    },
	    getLabel: function(){
	        return this.props.label;
	    },
	    getSize: function(){
	        return this.props.size;
	    },
	    getType: function(){
	        return this.props.type;
	    },
	    render: function(){
	        var type = this.props.type
	        var html = null
	        switch(type){
	            case 'default':
	                html = (
	                    React.createElement("input", {type: "checkbox", className: "icheck", name: this.props.name, id: this.props.id, ref: "input"})
	                )
	                break;
	            case 'clh':
	                html = (
	                    React.createElement("div", {className: "dragula col-xs-"+this.props.size, ref: "group"}, 
	                        React.createElement("div", {className: "form-group", id: this.props.groupId}, 
	                            React.createElement("div", {className: "col-xs-12"}, 
	                                React.createElement("div", {className: "icheck-inline"}, 
	                                    React.createElement("label", null, 
	                                        React.createElement("input", {type: "checkbox", className: "icheck", name: this.props.name, ref: "input"}), 
	                                        " ", 
	                                        this.props.label
	                                    )
	                                )
	                            )
	                        )
	                    )
	                )
	                break;
	            case 'c':
	                html = (
	                    React.createElement("input", {type: "checkbox", className: "icheck", ref: "input"})
	                )
	                break;
	        }
	        return html
	    }
	})

/***/ },
/* 19 */
/***/ function(module, exports) {

	/** @jsx React.DOM */module.exports = React.createClass({displayName: "module.exports",
	    value: '',
	    propTypes: {
	        label: React.PropTypes.string,
	        name: React.PropTypes.string,
	        size: React.PropTypes.any,
	        groupId: React.PropTypes.string,
	        placeholder: React.PropTypes.string,
	        code: React.PropTypes.number,
	        type: React.PropTypes.string,
	        context: React.PropTypes.string,
	        onRightClickItem: React.PropTypes.func
	    },
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
	        var self = this;
	        this.value = this.props.value;
	        $(this.refs.input).iCheck({
	            labelHover: false,
	            cursor: true,
	            radioClass: 'iradio_square-green'
	        })
	        if(typeof this.refs.group !== 'undefined' && this.props.context !== 'none'){
	            $(this.refs.group).contextmenu({
	                target: '#'+this.props.context,
	                before: function(e, element, target) {                    
	                    e.preventDefault();
	                    return true;
	                },
	                onItem: function(element, e) {
	                    this.props.onRightClickItem(this.props.code, e, this.props.refTemp)
	                }.bind(this)
	            })
	        }
	    },
	    setChecked: function(){
	        $(this.refs.input).iCheck('check');
	    },
	    setValue: function(value){
	        this.value = value;
	        $(this.refs.input).val(value);
	    },
	    isChecked: function(){
	        return $(this.refs.input).prop('checked');
	    },
	    getValue: function(){
	        return this.value;
	    },
	    getName: function(){
	        return this.props.name;
	    },
	    getLabel: function(){
	        return this.props.label;
	    },
	    getSize: function(){
	        return this.props.size;
	    },
	    getType: function(){
	        return this.props.type;
	    },
	    render: function(){
	        var type = this.props.type;
	        var html = null;
	        switch(type){
	            case 'default':
	                html = (
	                    React.createElement("input", {type: "radio", className: "icheck", name: this.props.name, id: this.props.id, ref: "input"})
	                )
	                break;
	            case 'rlh':
	                html = (
	                    React.createElement("div", {className: "dragula col-xs-"+this.props.size, ref: "group"}, 
	                        React.createElement("div", {className: "form-group", id: this.props.groupId}, 
	                            React.createElement("div", {className: "col-xs-12"}, 
	                                React.createElement("div", {className: "icheck-inline"}, 
	                                    React.createElement("label", null, 
	                                        React.createElement("input", {type: "radio", className: "icheck", name: this.props.name, ref: "input"}), 
	                                        " ", 
	                                        this.props.label
	                                    )
	                                )
	                            )
	                        )
	                    )
	                )
	                break;
	            case 'r':
	                html = (
	                    React.createElement("input", {type: "radio", className: "icheck", ref: "input"})
	                )
	                break;
	        }
	        return html
	    }
	})

/***/ },
/* 20 */
/***/ function(module, exports) {

	/** @jsx React.DOM */module.exports = React.createClass({displayName: "module.exports",
	    propTypes: {
	        label: React.PropTypes.string,
	        size: React.PropTypes.any,
	        code: React.PropTypes.number,
	        groupId: React.PropTypes.string,
	        type: React.PropTypes.string,
	        context: React.PropTypes.string,
	        onRightClickItem: React.PropTypes.func
	    },
	    getDefaultProps: function(){
	        return {
	            type: 'default',
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
	                    this.props.onRightClickItem(this.props.code, e, this.props.refTemp)
	                }.bind(this)
	            })
	        }
	    },
	    getLabel: function(){
	        return this.props.label
	    },
	    getSize: function(){
	        return this.props.size
	    },
	    getType: function(){
	        return this.props.type
	    },
		render: function(){
	        var type = this.props.type;
	        var html = null;
	        switch(type){
	            case 'default':
	                html = (
	                    React.createElement("label", null, "Label nay")
	                )
	                break;
	            case 'labelh':
	                html = (
	                    React.createElement("div", {className: "dragula col-md-"+this.props.size, ref: "group"}, 
	                        React.createElement("div", {className: "form-group", id: this.props.groupId}, 
	                            React.createElement("div", {className: "col-md-12"}, 
	                                React.createElement("span", {className: "form-control-static", 
	                                    dangerouslySetInnerHTML: {__html: this.props.label}})
	                            )
	                        )
	                    )
	                )
	                break;
	            case 'label':
	                html = (
	                    React.createElement("div", {className: "dragula col-xs-"+this.props.size, ref: "group"}, 
	                        React.createElement("div", {className: "form-group", id: this.props.groupId}, 
	                            React.createElement("div", {className: "col-xs-12"}, 
	                                React.createElement("span", {className: "form-control-static"}, 
	                                    this.props.label
	                                )
	                            )
	                        )
	                    )
	                )
	        }
	        return html;
		}
	})

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var CommonModal = __webpack_require__(12);
	var CommonInputText = __webpack_require__(10);
	var CommonCheckbox = __webpack_require__(18);
	var ComponentFormEditTableColumn = __webpack_require__(22);

	module.exports = React.createClass({displayName: "module.exports",
	    propTypes: {
	        content: React.PropTypes.object,
	        context: React.PropTypes.string,
	        code: React.PropTypes.any,
	        type: React.PropTypes.string,
	        groupId: React.PropTypes.string,
	        onDeleteColumn: React.PropTypes.func,
	        onUpdateColumn: React.PropTypes.func
	    },
	    getType: function(){
	        return this.props.type;
	    },
	    componentDidMount: function(){
	        if(this.props.context !== 'none'){
	            $(this.refs.table).contextmenu({
	                target: '#'+this.props.context,
	                before: function(e, element, target) {
	                    e.preventDefault();
	                    return true;
	                },
	                onItem: function(element, e) {
	                    this.props.onRightClickItem(this.props.code, e, this.props.refTemp)
	                }.bind(this)
	            })
	            this.contextMenuColumn();
	        }
	    },
	    componentDidUpdate: function(prevProps, prevState){
	        this.contextMenuColumn();
	    },
	    contextMenuColumn: function(){
	        $('.context-col').contextmenu({
	            target: '#contextColumnMenu',
	            before: function(e, element, target) {                    
	                e.preventDefault();
	                return true;
	            },
	            onItem: function(element, e) {
	                var menu = $(e.target).attr('id')
	                if(typeof menu === 'undefined')
	                    menu = $(e.target).parent().attr('id')
	                var code = $(element[0]).attr('id')
	                switch(menu){
	                    case 'deleteCol':
	                        this.execDeleteCol(code)
	                        break
	                    case 'editCol':
	                        var col = this.props.content.get('cols').get(code);
	                        this.refs.modalEditTableColumn.show();
	                        this.refs.formEditTableColumn.init(col,code);
	                        break
	                }
	            }.bind(this)
	        })
	    },
	    execDeleteCol: function(code){
	        swal({
	            title: 'Are you sure?',
	            text: 'You will delete this column.',
	            type: 'warning',
	            showCancelButton: true,
	            closeOnConfirm: false,
	            allowOutsideClick: true
	        }, function(){
	            this.props.onDeleteColumn(this.props.code, code);
	        }.bind(this))
	    },
	    _onSaveColumn: function(data){
	        swal({
	            title: 'Are you sure?',
	            text: 'You will update this column of table.',
	            type: 'warning',
	            showCancelButton: true,
	            closeOnConfirm: false,
	            allowOutsideClick: true
	        }, function(){
	            this.refs.modalEditTableColumn.hide()
	            this.props.onUpdateColumn(this.props.code, data);
	        }.bind(this))
	    },
	    getAllValue: function(){
	        var content = this.props.content.toJS();
	        var rows = content.rows;
	        var cols = content.cols;
	        var self = this;
	        var results = [];
	        var self = this;
	        for(var i = 0; i < rows; i++){
	            cols.map(function(col, indexCol){
	                var refChild = "field_"+i+"_"+indexCol;
	                var value = self.refs[refChild].getValue();
	                var type = self.refs[refChild].getType();
	                results.push({refChild: refChild, value: value, type: type, ref: self.props.refTemp});
	            })
	        }
	        return results;
	    },
	    setValue: function(fieldRef, value){
	        if(typeof this.refs[fieldRef] !== 'undefined')
	            this.refs[fieldRef].setValue(value);
	    },
		render: function(){
	        var content = this.props.content
	        var rows = Immutable.List()
	        for(var i = 0; i < content.get('rows'); i++){
	            rows = rows.push(Immutable.Map({col: content.get('cols')}))
	        }
	        return (
	            React.createElement("div", {className: "col-md-12 dragula"}, 
	                React.createElement("div", {id: "contextColumnMenu"}, 
	                    React.createElement("ul", {className: "dropdown-menu", role: "menu"}, 
	                        React.createElement("li", null, React.createElement("a", {id: "editCol"}, React.createElement("i", {className: "icon-pencil"}), " Edit Column")), 
	                        React.createElement("li", null, React.createElement("a", {id: "deleteCol"}, React.createElement("i", {className: "icon-trash"}), " Delete Column"))
	                    )
	                ), 
	                React.createElement(CommonModal, {ref: "modalEditTableColumn", portal: "modalEditTableColumn"}, 
	                    React.createElement("div", {className: "modal-header"}, 
	                        React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-hidden": "true"}, "×"), 
	                        React.createElement("h4", {className: "modal-title"}, "Edit Column Table")
	                    ), 
	                    React.createElement("div", {className: "modal-body"}, 
	                        React.createElement(ComponentFormEditTableColumn, {ref: "formEditTableColumn", onSave: this._onSaveColumn})
	                    )
	                ), 
	                React.createElement("div", {className: "form-group", id: this.props.groupId}, 
	                    React.createElement("div", {className: "col-md-12"}, 
	                        React.createElement("table", {className: "table table-bordered table-striped table-condensed flip-content"}, 
	                            React.createElement("thead", {className: "flip-content"}, 
	                                React.createElement("tr", null, 
	                                
	                                    content.get('cols').map(function(row,index){
	                                        return React.createElement("th", {id: index, className: "bg-blue-dark bg-font-blue-dark context-col", key: index}, row.get('label'))
	                                    })
	                                
	                                )
	                            ), 
	                            React.createElement("tbody", {ref: "table"}, 
	                                
	                                    rows.map(function(row, indexRow){
	                                        return (
	                                            React.createElement("tr", {key: indexRow}, 
	                                                
	                                                    row.get('col').map(function(c, indexCol){
	                                                        var type = c.get('type')
	                                                        if(type === 'it')
	                                                            return (
	                                                                React.createElement("td", {key: indexCol}, 
	                                                                    React.createElement(CommonInputText, {key: indexCol, type: type, 
	                                                                        ref: "field_"+indexRow+'_'+indexCol, 
	                                                                        code: indexCol})
	                                                                )
	                                                            )
	                                                        else if(type === 'c')
	                                                            return (
	                                                                React.createElement("td", {key: indexCol, style: {verticalAlign: 'middle'}}, 
	                                                                    React.createElement("center", null, 
	                                                                        React.createElement("span", {style: {verticalAlign: 'middle', display: 'inline-block', textAlign: 'center'}}, 
	                                                                            React.createElement(CommonCheckbox, {key: indexCol, type: type, 
	                                                                                ref: "field_"+indexRow+'_'+indexCol, 
	                                                                                code: indexCol})
	                                                                        )
	                                                                    )
	                                                                )
	                                                            )
	                                                    },this)
	                                                
	                                            )
	                                        )
	                                    },this)
	                                
	                            )
	                        )
	                    )
	                )
	            )
	        )
		}
	})

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var CommonDropdown = __webpack_require__(23);
	var CommonInputText = __webpack_require__(10);

	module.exports = React.createClass({displayName: "module.exports",
	    types: [
	        {code: 'it', name: 'Input Text'},
	        {code: 'c', name: 'Checkbox'}
	    ],
	    code: '',
	    propTypes: {
	        onSave: React.PropTypes.func.isRequired
	    },
	    init: function(col, code){
	        this.refs.formLabel.setValue(col.get('label'))
	        this.refs.formType.setValue(col.get('type'))
	        this.code = code
	    },
	    _onSave: function(){
	        var label = this.refs.formLabel.getValue()
	        var type = this.refs.formType.getValue()
	        var data = {
	            label: label, type: type, code: this.code
	        }
	        this.props.onSave(data)
	    },
		render: function(){
			return (
	            React.createElement("div", {className: "row"}, 
	                React.createElement("div", {className: "col-md-12"}, 
	                    React.createElement("form", null, 
	                        React.createElement("div", {className: "form-body"}, 
	                            React.createElement("div", {className: "form-group"}, 
	                                React.createElement("label", null, "Label Column"), 
	                                React.createElement(CommonInputText, {placeholder: "Type label", ref: "formLabel"})
	                            ), 
	                            React.createElement("div", {className: "form-group"}, 
	                                React.createElement("label", null, "Type Column"), 
	                                React.createElement(CommonDropdown, {ref: "formType", code: "code", name: "name", list: this.types})
	                            ), 
	                            React.createElement("div", {className: "form-group", style: {float:'right'}}, 
	                                React.createElement("button", {type: "button", "data-dismiss": "modal", className: "btn btn-default"}, "Close"), 
	                                " ", 
	                                React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this._onSave}, "Save")
	                            )
	                        )
	                    )
	                )
	            )
			)
		}
	})

/***/ },
/* 23 */
/***/ function(module, exports) {

	/** @jsx React.DOM */module.exports = React.createClass({displayName: "module.exports",
	    propTypes: {
	        list: React.PropTypes.array.isRequired,
	        code: React.PropTypes.string.isRequired,
	        name: React.PropTypes.string.isRequired
	    },
	    componentDidMount: function(){
	        $(this.refs.select).select2({
	            width: null,
	            placeholder: 'Select...'
	        })
	    },
	    setValue: function(value){
	        $(this.refs.select).select2('val',value)
	    },
	    getValue: function(){
	        return $(this.refs.select).val()
	    },
		render: function(){
	        return (
	            React.createElement("select", {ref: "select", className: "form-control"}, 
	                React.createElement("option", {value: ""}), 
	                
	                    this.props.list.map(function(l, index){
	                        return React.createElement("option", {key: index, value: l[this.props.code]}, l[this.props.name])
	                    }, this)
	                
	            )
	        )
		}
	})

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var CommonInputText = __webpack_require__(10);

	module.exports = React.createClass({displayName: "module.exports",
	    propTypes: {
	        name: React.PropTypes.string
	    },
	    componentDidMount: function(){
	        this.refs.inputName.setValue(this.props.name)
	    },
	    getName: function(){
	        return this.refs.inputName.getValue()
	    },
		render: function(){
			return (
	            React.createElement("div", {className: "row"}, 
	                React.createElement("div", {className: "col-md-12"}, 
	                    React.createElement("form", null, 
	                        React.createElement("div", {className: "form-body"}, 
	                            React.createElement("div", {className: "form-group"}, 
	                                React.createElement("label", null, "Section Name"), 
	                                React.createElement(CommonInputText, {placeholder: "Type Section Name", ref: "inputName"})
	                            )
	                        )
	                    )
	                )
	            )
			)
		}
	})

/***/ },
/* 25 */
/***/ function(module, exports) {

	/** @jsx React.DOM */module.exports = React.createClass({displayName: "module.exports",
	    propTypes: {
	        onSelectItem: React.PropTypes.func
	    },
	    getInitialState: function(){
	        return {
	            list: Immutable.fromJS([
	                {code: 'label', name: 'Label'},
	                {code: 'labelh', name: 'Label HTML'},
	                {code: 'itnl', name: 'Input Text'},
	                {code: 'idnl', name: 'Input Date'},
	                {code: 'tnl', name: 'Textarea'},
	                {code: 'clh', name: 'Checkbox with Label Horizontal'},
	                {code: 'table', name: 'Table'},
	                {code: 'rlh', name: 'Radio with Label Horizontal'},
	                {code: 'break', name: 'Break row'}
	            ])
	        }
	    },
	    _onSelectItem: function(item){
	        var self = this;
	        swal({
	            title: 'Are you sure?',
	            text: 'You will select field: '+item.get('name'),
	            type: 'warning',
	            showCancelButton: true,
	            closeOnConfirm: false,
	            allowOutsideClick: true
	        }, function(){
	            self.props.onSelectItem(item)
	        })
	    },
		render: function(){
			return (
	            React.createElement("div", {className: "row"}, 
	                React.createElement("div", {className: "col-md-12"}, 
	                    React.createElement("ul", {className: "list-group"}, 
	                        
	                            this.state.list.map(function(item, index){
	                                return (
	                                    React.createElement("li", {className: "list-group-item bg-blue bg-font-blue", key: index, style: {cursor:'pointer'}, 
	                                        onClick: this._onSelectItem.bind(this,item)}, 
	                                        item.get('name')
	                                    )
	                                )
	                            }, this)
	                        
	                    )
	                )
	            )
			)
		}
	})

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var CommonInputText = __webpack_require__(10);
	var Markdown = __webpack_require__(27);

	module.exports = React.createClass({displayName: "module.exports",
	    code: 0,
	    ref: '',
	    type: '',
	    propTypes: {
	        onSave: React.PropTypes.func
	    },
	    init: function(object){
	        this.type = object.type;
	        this.ref = object.ref;
	        if(this.type === 'label' || this.type === 'clh' || this.type === 'rlh'){
	            this.refs.formLabel.setValue(object.label);
	            if(this.type === 'rlh'){
	                this.refs.formName.setValue(object.name);
	                this.refs.formValue.setValue(object.value);
	            }else if(this.type === 'clh'){
	                this.refs.formName.setValue(object.name);
	            }
	            this.forceUpdate();
	        }else if(this.type === 'labelh'){
	            this.refs.formEditorLabel.setValue(object.label);
	            this.forceUpdate();
	        }else{
	            this.refs.formName.setValue(object.name);
	        }
	        this.refs.formSize.setValue(object.size)
	        this.code = object.code;
	    },
	    _onSave: function(){
	        var size = this.refs.formSize.getValue();
	        var data = null;
	        if(this.type !== 'label' && this.type !== 'labelh' && this.type !== 'rlh' && this.type !== 'clh'){
	            var name = this.refs.formName.getValue();
	            data = {
	                label: '', name: name, code: this.code, size: size, type: this.type
	            }
	        }else{
	            if(this.type === 'label')
	                var label = this.refs.formLabel.getValue();
	            else if(this.type === 'labelh')
	                var label = this.refs.formEditorLabel.getValue();
	            data = {
	                label: label, code: this.code, size: size, type: this.type, name: '', value: '', ref: ''
	            }
	            if(this.type === 'rlh' || this.type === 'clh'){
	                data.name = this.refs.formName.getValue();
	                data.label = this.refs.formLabel.getValue();
	            }
	            if(this.type === 'rlh'){
	                data.value = this.refs.formValue.getValue();
	                data.ref = this.ref;
	            }
	        }
	        this.props.onSave(data);
	    },
		render: function(){
	        var display_labelh = '';
	        var display_label = '';
	        var display_name = '';
	        var display_value = 'none';
	        if(this.type === 'labelh'){
	            display_labelh = 'block';
	            display_label = 'none';
	            display_name = 'none';
	        }else if(this.type === 'label' || this.type === 'clh' || this.type === 'rlh'){
	            display_labelh = 'none';
	            display_label = 'block';
	            display_name = 'none';
	        }else{
	            display_labelh = 'none';
	            display_label = 'none';
	            display_name = 'block';
	        }

	        if(this.type === 'clh' || this.type === 'rlh'){
	            display_name = 'block';   
	        }
	        if(this.type === 'rlh'){
	            display_value = 'block';
	        }
	        return (
	            React.createElement("div", {className: "row"}, 
	                React.createElement("div", {className: "col-md-12"}, 
	                    React.createElement("form", null, 
	                        React.createElement("div", {className: "form-body"}, 
	                            React.createElement("div", {className: "form-group", style: {display: display_labelh}}, 
	                                React.createElement("label", null, "Label"), 
	                                React.createElement(Markdown, {ref: "formEditorLabel"})
	                            ), 
	                            React.createElement("div", {className: "form-group", style: {display: display_label}}, 
	                                React.createElement("label", null, "Label"), 
	                                React.createElement(CommonInputText, {placeholder: "Type label", ref: "formLabel"})
	                            ), 
	                            React.createElement("div", {className: "form-group", style: {display: display_name}}, 
	                                React.createElement("label", null, "Name"), 
	                                React.createElement(CommonInputText, {placeholder: "Type name", ref: "formName"})
	                            ), 
	                            React.createElement("div", {className: "form-group", style: {display: display_value}}, 
	                                React.createElement("label", null, "Value"), 
	                                React.createElement(CommonInputText, {placeholder: "Type value", ref: "formValue"})
	                            ), 
	                            React.createElement("div", {className: "form-group"}, 
	                                React.createElement("label", null, "Size"), 
	                                React.createElement(CommonInputText, {placeholder: "Type size", ref: "formSize"})
	                            ), 
	                            React.createElement("div", {className: "form-group", style: {float:'right'}}, 
	                                React.createElement("button", {type: "button", "data-dismiss": "modal", className: "btn btn-default"}, "Close"), 
	                                " ", 
	                                React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this._onSave}, "Save")
	                            )
	                        )
	                    )
	                )
	            )
	        )
		}
	})

/***/ },
/* 27 */
/***/ function(module, exports) {

	/** @jsx React.DOM */module.exports = React.createClass({displayName: "module.exports",
	    componentDidMount: function(){
	        $(this.refs.markdown).summernote({
	            height: 300,
	            focus: true
	        })
	    },
	    setValue: function(value){
	        $(this.refs.markdown).code(value);
	        //$(this.refs.markdown).data('markdown').setContent(value);
	    },
	    getValue: function(){
	        return $(this.refs.markdown).code();
	        //return $(this.refs.markdown).data('markdown').getContent();
	        //return $(this.refs.markdown).summernote('code');
	    },
		render: function(){
	        return (
	            React.createElement("div", {ref: "markdown"})
	        )
		}
	})

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var CommonModal = __webpack_require__(12);
	var ComponentPageBar = __webpack_require__(29);
	var ComponentFormList = __webpack_require__(30);
	var ComponentFormClientList = __webpack_require__(31);
	var history = ReactRouter.hashHistory;
	var EFormService = __webpack_require__(7);
	var Config = __webpack_require__(8);

	module.exports = React.createClass({displayName: "module.exports",
	    appointmentUID: null,
	    patientUID: null,
	    parseQueryString: function(location){
	        var params = location.split('?');
	        var str = params[1];
	        var objURL = {};

	        str.replace(
	            new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
	            function( $0, $1, $2, $3 ){
	                objURL[ $1 ] = $3;
	            }
	        );
	        return objURL;
	    },
	    componentDidMount: function() {
	        var locationParams = this.parseQueryString(window.location.href);
	        this.appointmentUID = locationParams.appoinmentUID;
	        this.patientUID = locationParams.patientUID;
	        this.refs.formClientList.init(this.appointmentUID, this.patientUID);
	    },
	    _onComponentPageBarSelectForm: function() {
	        this.refs.modalSelectForm.show();
	    },
	    _onComponentFormListSelect: function(item) {
	        var self = this;
	        swal({
	            title: 'Are you sure?',
	            text: 'You will select this form',
	            type: 'warning',
	            showCancelButton: true,
	            closeOnConfirm: false,
	            closeOnCancel: true
	        }, function() {
	            self.refs.modalSelectForm.hide();
	            swal("Success!", "Your can write form like you want!!!", "success");
	            history.push('/eform/detail/appointment/' +self.appointmentUID+ '/patient/'+self.patientUID+'/form/'+item.ID);
	        })
	    },
	    _onComponentFormClientListRemove: function(item) {
	        var self = this;
	        swal({
	            title: 'Are you sure?',
	            text: 'You will delete this form',
	            type: 'warning',
	            showCancelButton: true,
	            closeOnConfirm: false,
	            closeOnCancel: true
	        }, function() {
	            EFormService.formClientRemove({ id: item.ID })
	                .then(function() {
	                    swal("Success!", "Your delete this form!!!", "success");
	                    self.refs.formClientList.refresh();
	                })
	        })
	    },
	            _onComponentPageBarPrintForm: function(){
	                    alert('sasaas');
	            },
		render: function(){
			return (
				React.createElement("div", {className: "page-content"}, 
					React.createElement(CommonModal, {ref: "modalSelectForm", portal: "modalSelectForm"}, 
	                    React.createElement("div", {className: "modal-header"}, 
	                        React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-hidden": "true"}, "×"), 
	                        React.createElement("h4", {className: "modal-title"}, "Select a form")
	                    ), 
	                    React.createElement("div", {className: "modal-body"}, 
	                        React.createElement(ComponentFormList, {ref: "formList", onSelect: this._onComponentFormListSelect})
	                    ), 
	                    React.createElement("div", {className: "modal-footer"}, 
	                        React.createElement("button", {type: "button", "data-dismiss": "modal", className: "btn btn-default"}, "Close")
	                    )
	                ), 
					React.createElement(ComponentPageBar, {ref: "pageBar", 
	                                                                onPrintForm: this._onComponentPageBarPrintForm, 
						onSelectForm: this._onComponentPageBarSelectForm}), 
					React.createElement("h3", {className: "page-title"}, " E-Form", 
	                    React.createElement("small", null, " List all form exists in appointment")
	                ), 
	                React.createElement(ComponentFormClientList, {ref: "formClientList", 
	                    onRemove: this._onComponentFormClientListRemove})
				)
			)
		}
	})

/***/ },
/* 29 */
/***/ function(module, exports) {

	/** @jsx React.DOM */module.exports = React.createClass({displayName: "module.exports",
	    propTypes: {
	        onSelectForm: React.PropTypes.func
	    },
	    render: function(){
	        return (
	            React.createElement("div", {className: "page-bar"}, 
	                React.createElement("ul", {className: "page-breadcrumb"}, 
	                    React.createElement("li", null, 
	                        React.createElement("a", null, "Home"), 
	                        React.createElement("i", {className: "fa fa-circle"})
	                    ), 
	                    React.createElement("li", null, 
	                        React.createElement("span", null, "E-Form")
	                    )
	                ), 
	                React.createElement("div", {className: "page-toolbar"}, 
	                    React.createElement("div", {className: "pull-right"}, 
	                        React.createElement("button", {type: "button", className: "btn green btn-sm", onClick: this.props.onSelectForm}, 
	                            React.createElement("i", {className: "fa fa-plus"}), " " + " " +
	                            "Select New Form"
	                        )
	                    )
	                )
	            )
	        )
	    }
	})

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var EFormService = __webpack_require__(7);
	var Link = ReactRouter.Link;

	module.exports = React.createClass({displayName: "module.exports",
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
	            preList = React.createElement("p", {className: "font-red-thunderbird"}, "There is no data here")
	        else
	            table = React.createElement("table", {className: "table table-bordered table-striped table-condensed flip-content"}, 
	                        React.createElement("thead", {className: "flip-content"}, 
	                            React.createElement("tr", null, 
	                                React.createElement("th", {className: "bg-blue-dark bg-font-blue-dark"}, "Name"), 
	                                React.createElement("th", {className: "bg-blue-dark bg-font-blue-dark"}, "Action")
	                            )
	                        ), 
	                        React.createElement("tbody", null, 
	                            
	                                this.state.list.map(function(l,index){
	                                    return (
	                                        React.createElement("tr", {key: index}, 
	                                            React.createElement("td", null, l.Name), 
	                                            React.createElement("td", null, 
	                                                React.createElement("span", {className: "label label-sm label-success", 
	                                                    onClick: this._onSelect.bind(this, l), 
	                                                    style: {cursor:'pointer'}}, 
	                                                    "Select Form"
	                                                )
	                                            )
	                                        )
	                                    )
	                                }.bind(this))
	                            
	                        )
	                    )
			return (
				React.createElement("div", {className: "row"}, 
	                React.createElement("div", {className: "col-md-12"}, 
	                    preList, 
	                    table
	                )
	            )
			)
		}
	})

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var EFormService = __webpack_require__(7);
	var Link = ReactRouter.Link;
	var Config = __webpack_require__(8);

	module.exports = React.createClass({displayName: "module.exports",
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
	            preList = React.createElement("p", {className: "font-red-thunderbird"}, "There is no data here")
	        else
	            table = React.createElement("table", {className: "table table-bordered table-striped table-condensed flip-content"}, 
	                        React.createElement("thead", {className: "flip-content"}, 
	                            React.createElement("tr", null, 
	                                React.createElement("th", {className: "bg-blue-dark bg-font-blue-dark"}, "Name"), 
	                                React.createElement("th", {className: "bg-blue-dark bg-font-blue-dark"}, "Action")
	                            )
	                        ), 
	                        React.createElement("tbody", null, 
	                            
	                                this.state.list.map(function(l,index){
	                                    return (
	                                        React.createElement("tr", {key: index}, 
	                                            React.createElement("td", null, l.Name), 
	                                            React.createElement("td", null, 
	                                                React.createElement(Link, {to: "/eform/detail/appointment/"+this.appointmentUID+"/patient/"+this.patientUID+"/client/"+l.ID, className: "label label-sm label-success"}, 
	                                                    "View Form"
	                                                ), 
	                                                " ", 
	                                                React.createElement("a", {className: "label label-sm label-success", onClick: this._onRemoveForm.bind(this, l)}, 
	                                                    "Delete Form"
	                                                )
	                                            )
	                                        )
	                                    )
	                                }.bind(this))
	                            
	                        )
	                    )
			return (
				React.createElement("div", {className: "row"}, 
	                React.createElement("div", {className: "col-md-12"}, 
	                    preList, 
	                    table
	                )
	            )
			)
		}
	})

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var ComponentPageBar = __webpack_require__(33);
	var ComponentSection = __webpack_require__(15);
	var EFormService = __webpack_require__(7);
	var history = ReactRouter.hashHistory;
	var Config = __webpack_require__(8);

	module.exports = React.createClass({displayName: "module.exports",
	            templateId: null,
		getInitialState: function(){
			return {
	            name: '',
				sections: Immutable.List()
			}
		},
		_loadPreview: function(){
	        var self = this;
	        var formDetail = new Promise(function(resolve, reject){
	            EFormService.formDetail({id: self.props.params.formId})
	            .then(function(response){
	                var EFormTemplate = response.data;
	                self.templateId = EFormTemplate.ID;
	                var content = JSON.parse(response.data.EFormTemplateData.TemplateData);
	                self.setState(function(prevState){
	                    return {
	                        name: EFormTemplate.Name,
	                        sections: Immutable.fromJS(content)
	                    }
	                })
	                resolve(response);
	            })
	        })
	        formDetail.then(function(preResponse){
	            self._serverPreFromDetail();
	        })
	    },
	    componentDidMount: function(){
	        this._loadPreview();
	        this.refs.pageBar.init(this.props.params);
	    },
	    _serverPreFromDetail: function(){
	        var self = this;
	        EFormService.preFormDetail({UID: self.props.params.appointmentId})
	        .then(function(response){
	            var data = null;
	            if(typeof response.data.Patients !== 'undefined'){
	                data = response.data.Patients[0];
	            }

	            if(data !== null){
	                var sections = self.state.sections.toJS();
	                for(var i = 0; i < sections.length; i++){
	                    var section = sections[i];
	                    var fields = section.fields;
	                    var sectionRef = "section"+i;
	                    fields.map(function(field, indexField){
	                        var type = field.code;
	                        if(type !== 'table' && type !== 'label' && type !== 'labelh'){
	                            var name = field.name;
	                            var fieldRef = field.ref;
	                            for(var keyData in data){
	                                if(keyData === name){
	                                    if(type === 'rlh'){
	                                        if(field.value === data[keyData])
	                                            self.refs[sectionRef].setValueForRadio(fieldRef);
	                                    }else
	                                        self.refs[sectionRef].setValue(fieldRef, data[keyData]);
	                                    break;
	                                }
	                            }
	                        }
	                    })
	                }
	            }
	        })
	    },
		_onComponentPageBarSaveForm: function(){
			var formId = this.props.params.formId;
	        var sections = this.state.sections.toJS();
	        var self = this;
	        var fields = [];
	        for(var i = 0; i < sections.length; i++){
	            var section = sections[i];
	            var sectionRef = "section"+i;
	            var tempFields = this.refs[sectionRef].getAllFieldValueWithValidation();
	            tempFields.map(function(field, index){
	                fields.push(field);
	            })
	        }
	        var content = JSON.stringify(fields);
	        var appointmentId = this.props.params.appointmentId;
	        var patientId = this.props.params.patientId;
	        EFormService.formClientSave({id: formId, content: content, name: this.state.name, patientId: patientId})
	        .then(function(){
	            swal("Success!", "Your form has been saved.", "success");
	            history.push(Config.getParamsIframe(appointmentId, patientId));
	        })
		},
	            _onComponentPageBarPrintForm: function(){
	                var fields = [];
	                var sections = this.state.sections.toJS();
	                for(var i = 0; i < sections.length; i++){
	                    var section = sections[i];
	                    var sectionRef = "section"+i;
	                    var tempFields = this.refs[sectionRef].getAllFieldValueWithValidation();
	                    tempFields.map(function(field, index){
	                        fields.push(field);
	                    })
	                }

	                var data = {
	                    printMethod : "itext",
	                    templateUID: this.templateId,
	                    data: fields
	                }

	                EFormService.createPDFForm(data)
	                .then(function(response){
	                        var blob = new Blob([response],{
	                                type: 'application/pdf'
	                            });
	                            swal("Success!", "Your form has been download to PDF.", "success");
	                            saveAs(blob,'pdfForm');
	                        
	                }, function(error){
	                        if(error.status === 200){
	                            var blob = new Blob([error.responseText],{
	                                type: 'application/pdf'
	                            });
	                            swal("Success!", "Your form has been download to PDF.", "success");
	                            saveAs(blob,'pdfForm');
	                        }
	                })
	            },
		render: function(){
			return (
				React.createElement("div", {className: "page-content"}, 
					React.createElement(ComponentPageBar, {ref: "pageBar", 
						onSaveForm: this._onComponentPageBarSaveForm, 
	                                                                onPrintForm: this._onComponentPageBarPrintForm}), 
					React.createElement("h3", {className: "page-title"}, this.state.name), 
	                
	                	this.state.sections.map(function(section, index){
	                		return React.createElement(ComponentSection, {key: index, 
	                			ref: "section"+index, 
	                			key: index, 
	                			code: index, 
	                            type: "client", 
	                			fields: section.get('fields'), 
	                			name: section.get('name')})
	                	}, this)
	                
				)
			)
		}
	})

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var history = ReactRouter.hashHistory;
	var Config = __webpack_require__(8);

	module.exports = React.createClass({displayName: "module.exports",
		propTypes: {
			onSaveForm: React.PropTypes.func,
	                        onPrintForm: React.PropTypes.func
		},
	            appointmentId: '',
	            patientId: '',
	            init: function(params){
	                this.appointmentId = params.appointmentId;
	                this.patientId = params.patientId;
	            },
	            _onPrintForm: function(){
	                var self = this;
	                    console.log(this.props);
	                    swal({
	                        title: 'Are you sure?',
	                        text: 'You will save this form !!!',
	                        type: 'warning',
	                        showCancelButton: true,
	                        closeOnConfirm: false,
	                        allowOutsideClick: false,
	                        showLoaderOnConfirm: true
	                    }, function(){
	                        self.props.onPrintForm();
	                    }.bind(this))
	            },
		_onSaveForm: function(){
			swal({
				title: 'Are you sure?',
				text: 'You will save this form !!!',
				type: 'warning',
				showCancelButton: true,
				closeOnConfirm: false,
				allowOutsideClick: false,
				showLoaderOnConfirm: true
			}, function(){
				this.props.onSaveForm();
			}.bind(this))
		},
	            _goToHome: function(){
	                history.push(Config.getParamsIframe(this.appointmentId, this.patientId));
	            },
		render: function(){
			return (
				React.createElement("div", {className: "page-bar"}, 
				     React.createElement("ul", {className: "page-breadcrumb"}, 
	                                                    React.createElement("li", null, 
	                                                            React.createElement("a", {onClick: this._goToHome}, "Home"), 
	                                                    React.createElement("i", {className: "fa fa-circle"})
	                    ), 
	                    React.createElement("li", null, 
	                        React.createElement("span", null, "E-Form")
	                    )
	                ), 
	                React.createElement("div", {className: "page-toolbar"}, 
	                    React.createElement("div", {className: "pull-right"}, 
							React.createElement("button", {type: "button", className: "btn green btn-sm", onClick: this._onSaveForm}, 
	                    		React.createElement("i", {className: "fa fa-save"}), " " + " " +
	                    		"Save Form"
							), 
	                                        " ", 
	                                        React.createElement("button", {type: "button", className: "btn green btn-sm", onClick: this._onPrintForm}, 
	                                        React.createElement("i", {className: "fa fa-print"}), " " + " " +
	                                        "Print PDF Form"
	                                    )
	                    )
	                )
				)
			)
		}
	})

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */var ComponentPageBar = __webpack_require__(33);
	var ComponentSection = __webpack_require__(15);
	var EFormService = __webpack_require__(7);
	var history = ReactRouter.hashHistory;
	var Config = __webpack_require__(8);

	module.exports = React.createClass({displayName: "module.exports",
	            templateId: null,
		getInitialState: function(){
			return {
	            name: '',
				sections: Immutable.List()
			}
		},
		_loadPreview: function(){
	        var self = this;
	        var formDetailClient = new Promise(function(resolve, reject){
	            EFormService.formClientDetail({id: self.props.params.clientId})
	            .then(function(response){
	                var formDetailClientData = response.data;
	                resolve(formDetailClientData);
	            })
	        })
	        var formDetail = new Promise(function(resolve, reject){
	            formDetailClient.then(function(formDetailClientData){
	                EFormService.formDetail({id: formDetailClientData.EFormTemplateID})
	                .then(function(response){
	                    var EFormTemplate = response.data;
	                    self.templateId = EFormTemplate.ID;
	                    var content = JSON.parse(response.data.EFormTemplateData.TemplateData);
	                    self.setState(function(prevState){
	                        return {
	                            name: EFormTemplate.Name,
	                            sections: Immutable.fromJS(content)
	                        }
	                    })
	                    resolve(formDetailClientData);
	                })
	            })
	        })
	        formDetail.then(function(preResponse){
	            self._serverPreFromDetail(preResponse);
	        })
	    },
	    _serverPreFromDetail: function(preData){
	        var self = this;
	        EFormService.preFormDetail({UID: this.props.params.appointmentId})
	        .then(function(response){
	            var data = response.data;
	            var sections = self.state.sections.toJS();
	            for(var i = 0; i < sections.length; i++){
	                var section = sections[i];
	                var fields = section.fields;
	                var sectionRef = "section"+i;
	                fields.map(function(field, indexField){
	                    var type = field.code;
	                    if(type !== 'table' && type !== 'label' && type !== 'labelh'){
	                        var name = field.name;
	                        var fieldRef = field.ref;
	                        for(var keyData in data){
	                            if(keyData === name){
	                                if(type === 'rlh'){
	                                    if(field.value === data[keyData])
	                                        self.refs[sectionRef].setValueForRadio(fieldRef);
	                                }else
	                                    self.refs[sectionRef].setValue(fieldRef, data[keyData]);
	                                break;
	                            }
	                        }
	                    }
	                })
	            }
	            var contentClient = JSON.parse(preData.EFormData.FormData);
	            contentClient.map(function(field, indexField){
	                var fieldRef = field.ref;
	                var fieldData = field.value;
	                var fieldType = field.type;
	                for(var i = 0; i < sections.length; i++){
	                    var section = sections[i];
	                    var fields = section.fields;
	                    var sectionRef = "section"+i;
	                    if(typeof field.refChild === 'undefined'){
	                        if(fieldType === 'rlh'){
	                            if(field.checked)
	                                self.refs[sectionRef].setValueForRadio(fieldRef);
	                        }else{
	                            self.refs[sectionRef].setValue(fieldRef, fieldData);
	                        }
	                    }else{
	                        var fieldRefChild = field.refChild;
	                        self.refs[sectionRef].setValueForTable(fieldRef, fieldRefChild, fieldData);
	                    }
	                }
	            })
	        })
	    },
	    _onComponentPageBarPrintForm: function(){
	        var fields = [];
	        var sections = this.state.sections.toJS();
	        for(var i = 0; i < sections.length; i++){
	            var section = sections[i];
	            var sectionRef = "section"+i;
	            var tempFields = this.refs[sectionRef].getAllFieldValueWithValidation();
	            tempFields.map(function(field, index){
	                fields.push(field);
	            })
	        }

	        var data = {
	            printMethod : "itext",
	            templateUID: this.templateId,
	            data: fields
	        }

	        EFormService.createPDFForm(data)
	        .then(function(response){
	                var blob = new Blob([response],{
	                        type: 'application/pdf'
	                    });
	                    swal("Success!", "Your form has been download to PDF.", "success");
	                    saveAs(blob,'pdfForm');
	                
	        }, function(error){
	                if(error.status === 200){
	                    var blob = new Blob([error.responseText],{
	                        type: 'application/pdf'
	                    });
	                    swal("Success!", "Your form has been download to PDF.", "success");
	                    saveAs(blob,'pdfForm');
	                }
	        })
	    },
	    componentDidMount: function(){
	        this._loadPreview();
	        this.refs.pageBar.init(this.props.params);
	    },
		_onComponentPageBarSaveForm: function(){
			var formId = this.props.params.formId;
	        var sections = this.state.sections.toJS();
	        var self = this;
	        var fields = [];
	        for(var i = 0; i < sections.length; i++){
	            var section = sections[i];
	            var sectionRef = "section"+i;
	            var tempFields = this.refs[sectionRef].getAllFieldValueWithValidation();
	            tempFields.map(function(field, index){
	                fields.push(field);
	            })
	        }
	        var content = JSON.stringify(fields);
	        var appointmentId = this.props.params.appointmentId;
	        EFormService.formClientUpdate({id: this.props.params.clientId, content: content})
	        .then(function(){
	            swal("Success!", "Your form has been saved.", "success");
	            history.push(Config.getParamsIframe(appointmentId, self.props.params.patientId));
	        })
		},
		render: function(){
			return (
				React.createElement("div", {className: "page-content"}, 
					React.createElement(ComponentPageBar, {ref: "pageBar", 
						onSaveForm: this._onComponentPageBarSaveForm, 
	                                                                onPrintForm: this._onComponentPageBarPrintForm}), 
					React.createElement("h3", {className: "page-title"}, this.state.name), 
	                
	                	this.state.sections.map(function(section, index){
	                		return React.createElement(ComponentSection, {key: index, 
	                			ref: "section"+index, 
	                			key: index, 
	                			code: index, 
	                            type: "client", 
	                			fields: section.get('fields'), 
	                			name: section.get('name')})
	                	}, this)
	                
				)
			)
		}
	})

/***/ }
/******/ ]);