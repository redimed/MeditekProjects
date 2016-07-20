var Config = require('config');
var InputText = require('common/inputText');
var InputDate = require('common/inputDate');
var Paginator = require('common/paginator');
var Filter    = require('modules/eform/eformPatient/filter');
var EFormService = require('modules/eform/services');
module.exports = React.createClass({
    searchObjectMap : {
        limit:20,
        offset:0,
        maxButtons:5,
        item:null,
        activePage:1,
        search:{},
        patientUID : null,
        userUID    : null,
        order:{},
        count:0,
    },
    getInitialState: function() {
        return {
            sort:{FromTime:"ASC",Code:"ASC",Name:"ASC",CreatedDate:"ASC"},
            list:[],
        }
    },
    _loadListEform: function(data,isInit) {
        App.blockUI({
            arget: 'blockui_body',
            animate: true
        });
        var self = this;
        EFormService.eformGetListByPatient(data)
        .then(function(response) {
            self.setState({ list: response.rows });
            if(isInit == true) {
                self.searchObjectMap.count = response.count;
                if(self.searchObjectMap.count != 0) {
                    if(response.count%self.searchObjectMap.limit != 0){
                        self.searchObjectMap.item = (response.count/self.searchObjectMap.limit) + 1;
                        self.refs.pagination.init(self.searchObjectMap);
                    }
                    else{
                        self.searchObjectMap.item = (response.count/self.searchObjectMap.limit);
                        self.refs.pagination.init(self.searchObjectMap);
                    }
                }
            }
            self.refs.filter.setValue();
            App.unblockUI();
        },function(err) {
            console.log(err);
        });
    },
    _init: function() {
        // var searchObjectMap = Object.clone(this.searchObject);
        // var searchObjectMap = jQuery.extend({},this.searchObject);
        var locationParams = Config.parseQueryString(window.location.href);
        this.searchObjectMap.patientUID = locationParams.patientUID;
        this.searchObjectMap.userUID = locationParams.userUID;
        this._loadListEform(this.searchObjectMap,true);
    },
    _filter: function(data) {
        this.searchObjectMap.search = data;
        this._loadListEform(this.searchObjectMap);
    },
    _viewEForm: function(data) {
        window.location.href = '/#/eform/detail?appointmentUID='+data.Appointments[0].UID+
                                '&patientUID='+this.searchObjectMap.patientUID+
                                '&templateUID='+data.EFormTemplate.UID+
                                '&userUID='+this.searchObjectMap.userUID;
        window.location.reload();
    },
    _downloadFile: function(data) {
        var extFileImage = ['jpeg','png','jpg'];
        var extFilePDF = ['pdf'];
        var UID = data.Note.substr(0, data.Note.lastIndexOf('.'));
        EFormService.getImage({UID: UID})
        .then(function(response) {
            if(response) {
                var options={};
                var FileExt = data.Note.substr(data.Note.lastIndexOf('.') + 1, data.Note.length);
                var promise_checkPDF = new Promise(function(a, b) {
                    var arr = extFilePDF.filter(function(item) {
                        return item === FileExt;
                    });
                    a(arr);
                });

                var promise_checkImage = new Promise(function(a, b) {
                    var arr = extFileImage.filter(function(item) {
                        return item === FileExt;
                    });
                    a(arr);
                });

                function toImage(name, type) {
                    options.type=type;
                    var blob = new Blob([response],options);
                    var objectUrl = URL.createObjectURL(blob);
                    var anchor = document.createElement("a");
                    anchor.download=name||'';
                    anchor.href = objectUrl;
                    anchor.click();
                }

                Promise.all([promise_checkImage, promise_checkPDF])
                .then(function(values) {
                    if(values[0].length != 0) {
                        var type = 'image/' + values[0][0];
                        var name = data.Name + '.' + values[0][0];
                        toImage(name, type);
                    }
                    else if (values[1].length != 0) {
                        var type = 'application/pdf';
                        var name = data.Name + '.' +  values[1][0];
                        toImage(name, type);
                    }
                }, function(err) {
                    console.log("err ", err);
                })

                
            }
            else {
                console.log("err ");
            }
        }, function(err) {
            console.log("err ",err);
        });
    },
    _choseForm: function(data) {
        if(data.EFormTemplateID == 2) {
            this._downloadFile(data);
        }
        else {
            this._viewEForm(data);
        }
    },
    _sort: function(fieldName) {
        this.searchObjectMap.order = {};
        if(this.state.sort[fieldName] == "ASC"){
            this.state.sort[fieldName] = "DESC";
            this.searchObjectMap.order[fieldName] = "DESC";
            this._loadListEform(this.searchObjectMap);
        }
        else{
            this.state.sort[fieldName] = "ASC";
            this.searchObjectMap.order[fieldName] = "ASC";
            this._loadListEform(this.searchObjectMap);
        }
    },
    _setPage: function(activePage) {
        this.searchObjectMap.activePage = activePage;
        this.searchObjectMap.offset = (this.searchObjectMap.activePage - 1) * this.searchObjectMap.limit;
        this._loadListEform(this.searchObjectMap);
    },
    _clearSearch: function(value) {
        var self = this;
        if(value == true) {
            this.refs.filter._clearSearch(function() {
                self.searchObjectMap.search = {};
                self._loadListEform(self.searchObjectMap);
            });
        }
    },
    componentDidMount: function() {
        this._init();
        $(this.paginations).twbsPagination({
            totalPages: 5,
            visiblePages: 2,
            onPageClick: function (event, page) {
                $('#page-content').text('Page ' + page);
            }
        });
    },
    render: function(){
        var self = this;
        return (
            <div className="page-content">
                    <div className="row">
                    <div className="col-lg-12 col-md-12">
                        <div className="portlet light bordered">
                            <div className="portlet-title">
                                <div className="caption font-blue-sharp">
                                    <i className="icon-list font-blue-sharp"></i>
                                    <span className="caption-subject bold uppercase"> E-Forms</span>
                                </div>
                                <div className="actions">
                                    <a className="btn btn-warning" onClick={this._clearSearch.bind(this,true)}>Clear Search</a>
                                </div>
                            </div>
                            <div className="portlet-body">
                                <div className="table-scrollable table-scrollable-borderless table-responsive dt-responsive margin-top-20">
                                    <table className="table table-hover table-light">
                                        <thead>
                                            <tr className="uppercase">
                                                <th>#</th>
                                                <th>
                                                    <label onClick={this._sort.bind(this, 'FromTime')}>
                                                        Appointment Date &nbsp;
                                                        {this.state.sort.FromTime=="ASC"?<i className="fa fa-sort-asc" ref="sort_apt_date_asc"></i>:<i className="fa fa-sort-desc" ref="sort_apt_date_desc"></i>}


                                                    </label>
                                                </th>
                                                <th>
                                                    <label onClick={this._sort.bind(this, 'Code')}>
                                                        Appointment Code &nbsp;
                                                        {this.state.sort.Code=="ASC"?<i className="fa fa-sort-asc" ref="sort_apt_date_asc"></i>:<i className="fa fa-sort-desc" ref="sort_apt_date_desc"></i>}
                                                    </label>
                                                </th>
                                                <th>
                                                    <label onClick={this._sort.bind(this, 'Name')}>
                                                        Name &nbsp;
                                                        {this.state.sort.Name=="ASC"?<i className="fa fa-sort-asc" ref="sort_apt_date_asc"></i>:<i className="fa fa-sort-desc" ref="sort_apt_date_desc"></i>}
                                                    </label>
                                                </th>
                                                <th>
                                                    <label onClick={this._sort.bind(this, 'CreatedDate')}>
                                                        Created date &nbsp;
                                                        {this.state.sort.CreatedDate=="ASC"?<i className="fa fa-sort-asc" ref="sort_apt_date_asc"></i>:<i className="fa fa-sort-desc" ref="sort_apt_date_desc"></i>}
                                                    </label>
                                                </th>
                                                <th width="1"></th>
                                            </tr>
                                            <Filter ref="filter" onSearch={this._filter} />
                                        </thead>
                                        <tbody>
                                        {
                                            this.state.list.map((item, index) =>{
                                                return(
                                                    <tr key={index}>
                                                        <td>{this.searchObjectMap.offset + index + 1}</td>
                                                        <td>{item.Appointments.length == 0 ? null : item.Appointments[0].FromTime!=null?moment(item.Appointments[0].FromTime,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'):null}</td>
                                                        <td>{item.Appointments.length == 0 ? null : item.Appointments[0].Code}</td>
                                                        <td className="primary-link">{item.Name}</td>
                                                        <td>{item.CreatedDate!=null?moment(item.CreatedDate,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'):null}</td>
                                                        <td className="text-center">
                                                            <a className="btn btn-sm btn-primary" onClick={this._choseForm.bind(this,item)}>
                                                                <i className="glyphicon glyphicon-search"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                )
                                                
                                            })
                                        }
                                        </tbody>
                                    </table>
                                    <Paginator ref="pagination" onChange={this._setPage} maxButtons={this.searchObjectMap.maxButtons} item={this.searchObjectMap.item} activePage={this.searchObjectMap.activePage} />
                                    <div><label>Total : { this.searchObjectMap.count } </label></div>
                                </div>
                                <div id="blockui_body"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})
