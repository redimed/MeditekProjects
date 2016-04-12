var CommonInputText = require('common/inputText');

module.exports = React.createClass({
    propTypes: {
        onSave: React.PropTypes.func
    },
    cols: [],
    position: 0,
    init: function(content, position){
        this.cols = content.get('fields').toJS();
        this.position = position;
        this.forceUpdate();
    },
    _onSave: function(){
        var self = this;
        var fields = [];
        this.cols.map(function(col, col_i){
            var refTemp = 'field_'+self.position+'_'+col_i;
            var fieldRef = self.refs[refTemp];
            var fieldValue = fieldRef.getValue();
            fields.push({ref: refTemp, value: fieldValue, type: col.type});
        })
        var row = {fields: fields};
        this.props.onSave(row, this.position);
    },
    render: function(){
        return (
            <div className="row">
                <div className="col-md-12" style={{paddingRight: '40px', paddingLeft: '40px'}}>
                    <div className="form-body">
                        {
                            this.cols.map(function(col, index){
                                var control = null;
                                switch(col.type){
                                    case 'it':
                                        control = <CommonInputText ref={'field_'+this.position+'_'+index} defaultValue={col.value}/>;
                                        break;
                                }
                                return (
                                    <div key={index}>
                                        <div className="form-group">
                                            <label>{col.label}</label>
                                            {control}
                                        </div>
                                    </div>
                                )
                            }, this)
                        }
                        <div className="form-group" style={{float:'right'}}>
                            <button type="button" onClick={this.props.onCloseModal} className="btn btn-default">Close</button>
                            &nbsp;
                            <button type="button" className="btn btn-primary" onClick={this._onSave}>Save</button>
                            </div>
                    </div>
                </div>
            </div>
        )
    }
})