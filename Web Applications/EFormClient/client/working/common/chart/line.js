var InputAxisX = require('modules/eform/eformTemplateDetail/chart/inputAxisX');

module.exports = React.createClass({
    image: null,
    image_header: null,
    componentDidMount: function(){
        var self = this;
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
        var series = this.props.series.toJS();
        if(series[1])
            series[1].color = 'blue';
        if(series[0])
            series[0].color = 'red';
        $(this.refs.line_chart).highcharts({
            chart: {
                height: 700,
                width: 1200,
                backgroundColor: '#FFFFFF',
                marginTop: 90
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: this.props.axisX.toJS().categories,
                tickmarkPlacement: 'on',
                type: 'datetime',
                labels: {
                  y: -580,
                  x: -20,
                  align: 'left',
                  style: {
                        color: 'black',
                        fontSize: '16px'
                    }
                },
                gridLineWidth: 2,
                gridLineColor: 'black',
                lineColor: 'black',
                lineWidth: 2
            },
            yAxis: {
                title: {
                    text: 'Hearing Level in Decibels (dB)'
                },
                labels: {
                    style: {
                        color: 'black',
                        fontSize: '16px'
                    }
                },
                reversed: true,
                max: 120,
                min: -10,
                minRange: 5,
                tickInterval: 10,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: 'black'
                }],
                gridLineWidth: 2,
                gridLineColor: 'black',
                lineColor: 'black',
                lineWidth: 2
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0,
                style: {
                    color: 'black',
                    fontSize: '16px'
                }
            },
            series: series
        })
        if(this.props.permission !== 'eformDev'){
            this.refs.inputAxisX.init(this.props.axisX.toJS(), this.props.series.toJS());
            this._onUpdateBase64();
        }
    },
    _onUpdateBase64: function(){
        var self = this;
        var value = null;
        var chart = $(self.refs.line_chart).highcharts();
        var svg = chart.getSVG();
        var image = new Image;
        var canvas = document.createElement('canvas');
        canvas.width = chart.chartWidth;
        canvas.height = chart.chartHeight;
        image.onload = function(){
            canvas.getContext('2d').drawImage(this, 0, 0, chart.chartWidth, chart.chartHeight);
            self.image = canvas.toDataURL();
            self.image = self.image.replace('data:image/png;base64,','');
        }
        image.src = 'data:image/svg+xml;base64,' + window.btoa(svg);
        html2canvas($(self.refs.header), {
            onrendered: function(canvas){
                self.image_header = canvas.toDataURL();
                self.image_header = self.image_header.replace('data:image/png;base64,','');
            }
        })
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
        this._onUpdateBase64();
        var chart = $(this.refs.line_chart).highcharts();
        chart.redraw();
    },
    getAllValue: function(){
        if(this.props.permission !== 'eformDev')
            var series = this.refs.inputAxisX.getValue();
        else
            var series = '';
        var type = 'line_chart';
        var name = this.props.name;
        var ref = this.props.refTemp;
        return {series: series, type: type, ref: ref, name: name};
    },
    getBase64Value: function(){
        var type = 'line_chart';
        var name = this.props.name;
        var ref = this.props.refTemp;
        var value = this.image;
        var value_header = this.image_header;
        return {value: value, type: type, ref: ref, name: name, base64DataHeader: value_header};
    },
    setValue: function(field, chartType){
        var chart = $(this.refs.line_chart).highcharts();
        var self = this;
        if(typeof field.series !== 'undefined' && field.series !== ''){
            field.series.map(function(serie, index){
                chart.series[index].update({
                    data: serie.data
                }, true);
                self._onUpdateBase64();
            })
            this.refs.inputAxisX.setSeries(field);
        }
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
                            <button className="btn btn-primary btn-small" onClick={this._clickUpdateChart}>
                                Update Chart
                            </button>
                            <div ref="header" id="line_chart_header">
                                <InputAxisX ref="inputAxisX" onChangeInput={this._onChangeInput}/>
                                <center><h5>{this.props.title}</h5></center>
                                <center>{this.props.subtitle}</center>
                            </div>
                            <div ref="line_chart" id="line_chart"/>
                        </div>
                    </div>
                </div>
            )
        }
    }
})