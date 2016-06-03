var CommonDropdown = require('common/dropdown');

module.exports = React.createClass({
    list: [
        {code: 'dynamic', name: 'Dynamic'},
        {code: 'static', name: 'Static'}
    ],
    propTypes: {
        viewType: React.PropTypes.any
    },
    componentDidMount: function(){
        this.refs.viewType.setValue(this.props.viewType);
    },
    getViewType: function(){
        return this.refs.viewType.getValue();
    },
    render: function(){
        return (
            <div className="row">
                <div className="col-md-12">
                    <form>
                        <div className="form-body">
                            <div className="form-group">
                                <label>View Type</label>
                                <CommonDropdown list={this.list} code="code" name="name" ref="viewType"/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
})