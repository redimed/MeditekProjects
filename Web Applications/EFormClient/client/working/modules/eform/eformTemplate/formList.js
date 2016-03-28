var EFormService = require('modules/eform/services');
var history = ReactRouter.hashHistory;
var Modal = require('common/modal');
var Dropdown = require('common/dropdown');

var printTypes = [
    {code: 'itext', name: 'IText Report'},
    {code: 'jasper', name: 'Jasper Report'}
];
module.exports = React.createClass({
    propTypes: {
        onClickUpdate: React.PropTypes.func,
        onClickRemove: React.PropTypes.func,
        onPrintForm: React.PropTypes.func
    },
    item: null,
    userUID: null,
    setUserUID: function(userUID) {
        this.userUID = userUID;
    },
    getInitialState: function() {
        return {
            list: []
        }
    },
    componentDidMount: function() {
        this._serverListForm();
    },
    refresh: function() {
        this._serverListForm();
    },
    _serverListForm: function() {
        var self = this;
        App.blockUI()
        EFormService.eformTemplateList()
            .then(function(response) {
                self.setState({ list: response.data });
                App.unblockUI();
            })
    },
    _onClickUpdate: function(item) {
        if (typeof this.props.onClickUpdate !== 'undefined')
            this.props.onClickUpdate(item);
    },
    _onClickRemove: function(item) {
        if (typeof this.props.onClickRemove !== 'undefined')
            this.props.onClickRemove(item);
    },
    _goToDetail: function(l) {
        history.push("/eformTemplate/detail/" + l.UID + '/' + this.userUID);
    },
    _onOpenPrint: function(l){
        this.item = l;
        this.refs.dropdownPrint.setValue(l.PrintType);
        this.refs.modalPrintTypes.show();
    },
    _onPrintForm: function(){
        var dropdown = this.refs.dropdownPrint.getValue();
        this.refs.modalPrintTypes.hide();
        this.props.onPrintForm(this.item, dropdown);
    },
    render: function(){
        var table = null
        table = <table className="table table-bordered table-striped table-condensed flip-content">
                        <thead className="flip-content">
                            <tr>
                                <th className="bg-blue-dark bg-font-blue-dark">Index</th>
                                <th className="bg-blue-dark bg-font-blue-dark">Name</th>
                                <th className="bg-blue-dark bg-font-blue-dark">Created Date</th>
                                <th className="bg-blue-dark bg-font-blue-dark">User Created</th>
                                <th className="bg-blue-dark bg-font-blue-dark">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.list.map((l,index)=>{
                                    var userCreated = (l.UserAccount)?l.UserAccount.UserName:'';
                                    return (
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>
                                                <a onClick={this._goToDetail.bind(this, l)}>{l.Name}</a>
                                            </td>
                                            <td>
                                                {moment(l.CreatedDate).format('DD/MM/YY HH:mm:ss')}
                                            </td>
                                            <td>
                                                {userCreated}
                                            </td>
                                            <td>
                                                <a onClick={this._goToDetail.bind(this, l)} 
                                                    className="label label-sm label-success">
                                                    View Form
                                                </a>
                                                &nbsp;
                                                <a onClick={this._onOpenPrint.bind(this, l)} 
                                                    className="label label-sm label-success">
                                                    Change Print Type
                                                </a>
                                                &nbsp;
                                                <span className="label label-sm label-success" 
                                                    onClick={this._onClickUpdate.bind(this, l)}
                                                    style={{cursor:'pointer'}}>
                                                    Update Form
                                                </span>
                                                &nbsp;
                                                <span className="label label-sm label-success" 
                                                    onClick={this._onClickRemove.bind(this, l)}
                                                    style={{cursor:'pointer'}}>
                                                    Remove Form
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
                    <Modal ref="modalPrintTypes">
                        <div className="header">
                                <h4>Select Print Type</h4>
                        </div>
                        <div className="content">
                            <div className="col-md-12">
                                <form>
                                    <div className="form-body">
                                        <div className="form-group">
                                            <Dropdown list={printTypes} code="code" name="name" ref="dropdownPrint"/>
                                        </div>
                                        <div className="form-group" style={{float:'right'}}>
                                            <button type="button" className="btn btn-primary" onClick={this._onPrintForm}>Save</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Modal>
                    <div className="col-md-12">
                        {table}
                    </div>
                </div>
	)
    }
})