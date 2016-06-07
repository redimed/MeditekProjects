var EFormService = require('modules/eform/services');
var history = ReactRouter.hashHistory;

module.exports = React.createClass({
    propTypes: {
        onClickUpdate: React.PropTypes.func,
        onClickRemove: React.PropTypes.func,
        onSelect: React.PropTypes.func
    },
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
        EFormService.eformTemplateModuleList()
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
    _onSelect: function(l) {
        this.props.onSelect(l);
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
                                                <a onClick={this._onSelect.bind(this, l)}>{l.Name}</a>
                                            </td>
                                            <td>
                                                {moment(l.CreatedDate).format('DD/MM/YY HH:mm:ss')}
                                            </td>
                                            <td>
                                                {userCreated}
                                            </td>
                                            <td>
                                                <a onClick={this._onSelect.bind(this, l)} 
                                                    className="label label-sm label-success">
                                                    Select Form
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
                    <div className="col-md-12 table-responsive">
                        {table}
                    </div>
                </div>
    )
    }
})