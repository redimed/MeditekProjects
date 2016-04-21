var CommonInputText = require('common/inputText');

module.exports = React.createClass({
    axisX: {categories: []},
    _onAddSerie: function(){
        this.axisX.categories.push('x');
        this.forceUpdate();
    },
    _onSaveX: function(index){
        var name = this.refs['x_'+index].getValue();
        this.axisX.categories[index] = name;
        this.forceUpdate();
    },
    _onDeleteX: function(index){
        this.axisX.categories.splice(index, 1);
        this.forceUpdate();
    },
    init: function(axisX){
        this.axisX = axisX;
        this.forceUpdate();
    },
    getValue: function(){
        return this.axisX;
    },
    render: function(){
        return (
            <div className="form-group">
                <label>Axis X</label>
                &nbsp;
                <button className="btn-primary btn-small btn" onClick={this._onAddSerie}>Add</button>
                <br/>
                {
                    this.axisX.categories.map(function(x, index){
                        return (
                            <span key={index}>
                                <CommonInputText placeholder="Add a serie" ref={"x_"+index} defaultValue={x} style={{width: '100px'}}
                                    className="default"/>
                                <a onClick={this._onSaveX.bind(this, index)}>Save</a>
                                <a onClick={this._onDeleteX.bind(this, index)}>Delete</a>
                            </span>
                        )
                    }, this)
                }
            </div>
        )
    }
})