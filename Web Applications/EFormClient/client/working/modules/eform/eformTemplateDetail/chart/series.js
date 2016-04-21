var CommonInputText = require('common/inputText');

module.exports = React.createClass({
    series: [],
    _onAddSerie: function(){
        this.series.push({data:[], name: 'Serie'});
        this.forceUpdate();
    },
    _onSaveSerie: function(index){
        var name = this.refs['ser_'+index].getValue();
        this.series[index].name = name;
        this.forceUpdate();
    },
    _onDeleteSerie: function(index){
        this.series.splice(index, 1);
        this.forceUpdate();
    },
    init: function(series){
        this.series = series;
        this.forceUpdate();
    },
    getValue: function(){
        return this.series;
    },
    render: function(){
        return (
            <div className="form-group">
                <label>Series</label>
                &nbsp;
                <button className="btn-primary btn-small btn" onClick={this._onAddSerie}>Add</button>
                <br/>
                {
                    this.series.map(function(ser, index){
                        return (
                            <span key={index}>
                                <CommonInputText placeholder="Add a serie" ref={"ser_"+index} defaultValue={ser.name}
                                    className="default"
                                    style={{width: '150xp'}}/>
                                <a onClick={this._onSaveSerie.bind(this, index)}>Save</a>
                                <a onClick={this._onDeleteSerie.bind(this, index)}>Delete</a>
                            </span>
                        )
                    }, this)
                }
            </div>
        )
    }
})