var Config = require('config');
var DropDown2 = require('common/dropDown2');
var InputText = require('common/inputText');
var InputDate = require('common/inputDate');
var Paginator = require('common/paginator');
var Filter    = require('modules/eform/eformPatient/filter');
var EFormService = require('modules/eform/services');
module.exports = React.createClass({
    searchObjectMap : {
        limit:1,
        offset:0,
        maxButtons:5,
        item:null,
        activePage:1,
        search:{},
        patientUID : null,
        userUID    : null,
        order:{},
    },
    getInitialState: function() {
        return {
            data: [{value:1,name:"a"},{value:2,name:"b"}],
            sort:{FromTime:"ASC",Code:"ASC",Name:"ASC",CreatedDate:"ASC"},
            list:[],
        }
    },
    _loadListEform: function(data) {
        var self = this;
        EFormService.eformGetListByPatient(data)
        .then(function(response) {
            self.setState({ list: response.rows });
            if(response.count%self.searchObjectMap.limit != 0){
                self.searchObjectMap.item = (response.count%self.searchObjectMap.limit) + 1;
                self.refs.pagination.init(self.searchObjectMap);
            }
            else{
                self.searchObjectMap.item = (response.count/self.searchObjectMap.limit);
                self.refs.pagination.init(self.searchObjectMap);
            }
            self.refs.filter.setValue();
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
        this._loadListEform(this.searchObjectMap);
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
                                <div className="tools"></div>
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
                                                        <td>{index+1}</td>
                                                        <td>{item.Appointments[0].FromTime!=null?moment(item.Appointments[0].FromTime,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'):null}</td>
                                                        <td>{item.Appointments[0].Code}</td>
                                                        <td className="primary-link">{item.Name}</td>
                                                        <td>{item.CreatedDate!=null?moment(item.CreatedDate,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'):null}</td>
                                                        <td className="text-center">
                                                            <a className="btn btn-sm btn-primary" onClick={this._viewEForm.bind(this,item)}>
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})
