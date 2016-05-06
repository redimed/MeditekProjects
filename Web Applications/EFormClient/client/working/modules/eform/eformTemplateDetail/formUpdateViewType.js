var CommonDropdown = require('common/dropdown');

module.exports = React.createClass({
    list: [
        {code: 'show', name: 'Show'},
        {code: 'hide', name: 'Hide'}
    ],
    propTypes: {
        viewType: React.PropTypes.any
    },
    componentDidMount: function(){
        console.log(this.props.viewType);
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