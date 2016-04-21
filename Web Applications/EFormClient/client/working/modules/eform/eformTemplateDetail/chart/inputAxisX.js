var CommonInputText = require('common/inputText');

module.exports = React.createClass({
    axisX: {categories: []},
    series: [],
    init: function(axisX, series){
        this.axisX = axisX;
        this.series = series;
        var self = this;
        this.series.map(function(serie, serieIndex){
            if(serie.data.length === 0){
                self.axisX.categories.map(function(x, catIndex){
                    self.series[serieIndex].data.push(0);
                })
            }
            if(self.axisX.categories.length > serie.data.length){
                for(var i = serie.data.length; i  < self.axisX.categories.length; i++){
                    self.series[serieIndex].data.push(0);
                }
            }
        })
        this.forceUpdate();
    },
    _onChangeInput: function(dataIndex, inputIndex, event){
        this.series[dataIndex].data[inputIndex] = parseFloat(event.target.value);
        this.props.onChangeInput(this.series[dataIndex].data, dataIndex);
    },
    getValue: function(){
        return this.series;
    },
    setSeries: function(field){
        var self = this;
        this.series = $.extend([], this.series, field.series);
        this.series.map(function(serie, serieIndex){
            if(self.axisX.categories.length > serie.data.length){
                for(var i = serie.data.length; i  < self.axisX.categories.length; i++){
                    self.series[serieIndex].data.push(0);
                }
            }
        })
        this.forceUpdate();
    },
    render: function(){
        return (
            <div style={{float: 'right'}}>
                <table className="table-bordered table-condensed table">
                    <thead>
                        <tr>
                            <th></th>
                            {
                                this.axisX.categories.map(function(x, index){
                                    return <th key={index}>{x}</th>
                                }, this)
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.series.map(function(serie, index){
                                return (
                                    <tr key={index}>
                                        <td>{serie.name}</td>
                                        {
                                            serie.data.map(function(input, inputIndex){
                                                return (
                                                    <td key={inputIndex}>
                                                        <CommonInputText ref={"serie_"+index+"_"+inputIndex}
                                                            onChange={this._onChangeInput.bind(this, index, inputIndex)}
                                                            defaultValue={input} className="default" style={{width: '60px'}}/>
                                                    </td>
                                                )
                                            }, this)
                                        }
                                    </tr>
                                )
                            }, this)
                        }
                    </tbody>
                </table>
                <button className="btn btn-primary btn-small" onClick={this.props.clickUpdateChart}>
                    Update Chart
                </button>
            </div>
        )
    }
})