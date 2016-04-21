var InputAxisX = require('modules/eform/eformTemplateDetail/chart/inputAxisX');

module.exports = React.createClass({
    componentDidMount: function(){
        if(typeof this.refs.group !== 'undefined' && this.props.context !== 'none'){
            $(this.refs.group).contextmenu({
                target: '#'+this.props.context,
                before: function(e, element, target) { 
                    e.preventDefault();
                    return true;
                },
                onItem: function(element, e) {
                    this.props.onRightClickItem(this.props.code, e, this.props.refTemp);
                }.bind(this)
            })
        }
        $(this.refs.line_chart).highcharts({
            title: {
                text: this.props.title,
                x: -20
            },
            subtitle: {
                text: this.props.subtitle,
                x: -20
            },
            xAxis: {
                categories: this.props.axisX.toJS().categories
            },
            yAxis: {
                title: {
                    text: 'Temperature'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            series: this.props.series.toJS()
        })

        if(this.props.permission !== 'eformDev'){
            this.refs.inputAxisX.init(this.props.axisX.toJS(), this.props.series.toJS());
        }
    },
    getName: function(){
        return this.props.name;
    },
    getSize: function(){
        return this.props.size;
    },
    getType: function(){
        return this.props.type;
    },
    getRoles: function(){
        return this.props.roles;
    },
    getAxisX: function(){
        return this.props.axisX;
    },
    getTitle: function(){
        return this.props.title;
    },
    getSubtitle: function(){
        return this.props.subtitle;
    },
    getSeries: function(){
        return this.props.series;
    },
    _onChangeInput: function(serie, serieIndex){
        var chart = $(this.refs.line_chart).highcharts();
        chart.series[serieIndex].update({
            data: serie
        }, false);
    },
    _clickUpdateChart: function(){
        var chart = $(this.refs.line_chart).highcharts();
        chart.redraw();
    },
    getAllValue: function(){
        var series = this.refs.inputAxisX.getValue();
        var type = 'line_chart';
        var name = this.props.name;
        var ref = this.props.refTemp;
        return {series: series, type: type, ref: ref, name: name};
    },
    setValue: function(field, chartType){
        var chart = $(this.refs.line_chart).highcharts();
        field.series.map(function(serie, index){
            chart.series[index].update({
                data: serie.data
            }, true);     
        })
        this.refs.inputAxisX.setSeries(field);
    },
    render: function(){
        if(this.props.permission === 'eformDev'){
            return (
                <div className={"col-xs-"+this.props.size} ref="group">
                    <div className="form-group" id={this.props.groupId}>
                        <div className="col-xs-12">
                            <div ref="line_chart"/>
                        </div>
                    </div>
                </div>
            )
        }else{
            return (
                <div className={"col-xs-"+this.props.size} ref="group">
                    <div className="form-group" id={this.props.groupId}>
                        <div className="col-xs-12">
                            <InputAxisX ref="inputAxisX" onChangeInput={this._onChangeInput}
                                clickUpdateChart={this._clickUpdateChart}/>
                            <div ref="line_chart"/>
                        </div>
                    </div>
                </div>
            )
        }
    }
})