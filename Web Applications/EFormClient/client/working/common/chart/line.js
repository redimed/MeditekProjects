var InputAxisX = require('modules/eform/eformTemplateDetail/chart/inputAxisX');

module.exports = React.createClass({
    image: null,
    _theme: function(){
        /**
         * Grid-light theme for Highcharts JS
         * @author Torstein Honsi
         */

        // Load the fonts
        Highcharts.createElement('link', {
           href: 'https://fonts.googleapis.com/css?family=Dosis:400,600',
           rel: 'stylesheet',
           type: 'text/css'
        }, null, document.getElementsByTagName('head')[0]);

        Highcharts.theme = {
           colors: ["#7cb5ec", "#f7a35c", "#90ee7e", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
              "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
           chart: {
              backgroundColor: null,
           },
           title: {
              style: {
                 fontSize: '16px',
                 fontWeight: 'bold',
                 textTransform: 'uppercase'
              }
           },
           tooltip: {
              borderWidth: 0,
              backgroundColor: 'rgba(219,219,216,0.8)',
              shadow: false
           },
           legend: {
              itemStyle: {
                 fontWeight: 'bold',
                 fontSize: '13px'
              }
           },
           xAxis: {
              gridLineWidth: 1,
              labels: {
                 style: {
                    fontSize: '12px'
                 }
              }
           },
           yAxis: {
              minorTickInterval: 'auto',
              title: {
                 style: {
                    textTransform: 'uppercase'
                 }
              },
              labels: {
                 style: {
                    fontSize: '12px'
                 }
              }
           },
           plotOptions: {
              candlestick: {
                 lineColor: '#404048'
              }
           },


           // General
           background2: '#F0F0EA'

        };

        // Apply the theme
        Highcharts.setOptions(Highcharts.theme);
    },
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
                reversed: true,
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
        this._theme()
        var self = this;
        if(this.props.permission !== 'eformDev'){
            this.refs.inputAxisX.init(this.props.axisX.toJS(), this.props.series.toJS());
            setInterval(function(){
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
            }, 2000)
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
    getBase64Value: function(){
        var type = 'line_chart';
        var name = this.props.name;
        var ref = this.props.refTemp;
        var value = this.image;
        return {value: value, type: type, ref: ref, name: name};
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