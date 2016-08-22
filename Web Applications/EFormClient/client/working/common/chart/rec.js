var InputRecChart = require('modules/eform/eformTemplateDetail/chart/inputRecChart');

var labelsY = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
var labelsX = [
    {value: 500},
    {value: 1000},
    {distance: 'near', value: 1500, position: 'up'},
    {distance: 'near', value: 2000},
    {distance: 'near', value: 3000, position: 'up'},
    {distance: 'near', value: 4000},
    {distance: 'near', value: 6000, position: 'up'},
    {distance: 'near', value: 8000}
];

var inputX = {
    axisX: {
        categories: ['500Hz', '1000Hz', '1500Hz', '2000Hz', '3000Hz', '4000Hz', '6000Hz', '8000Hz']
    },
    series: [
        {name: 'Right Ear', data: []},
        {name: 'Left Ear', data: []}
    ]
}

module.exports = React.createClass({
    image: null,
    image_header: null,
    paper: null,
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
        if(this.props.permission !== 'eformDev'){
            this.refs.inputRecChart.init(inputX.axisX, inputX.series);

            this.paper = Raphael('chart', 840, 620);
            var rectangle = this.paper.rect(30, 30, 800, 520);

            this.paper.text(45, 290, 'm').attr({'font-size': 14});
            this.paper.text(165, 330, 'ee').attr({'font-size': 14});
            this.paper.text(195, 340, 'or').attr({'font-size': 14});
            this.paper.text(345, 330, 'ar').attr({'font-size': 14});
            this.paper.text(345, 240, 'p').attr({'font-size': 14});
            this.paper.text(465, 260, 'k').attr({'font-size': 14});
            this.paper.text(565, 160, 'f').attr({'font-size': 14});
            this.paper.text(615, 202, 'th').attr({'font-size': 14});
            this.paper.text(615, 260, 't').attr({'font-size': 14});
            this.paper.text(568, 280, 'sh').attr({'font-size': 14});
            this.paper.text(645, 280, 's').attr({'font-size': 14});

            var distance = 30;
            var distance_line = 70;
            for(var ly = 0; ly < labelsY.length; ly++){
                if(labelsY[ly] == 10){
                    this.paper.path([
                        'M', 30, distance_line,
                        'L', 830, distance_line
                    ]).attr({
                        'stroke-width': 3
                    });
                }else{
                    if(ly < labelsY.length-2){
                        this.paper.path([
                            'M', 30, distance_line,
                            'L', 830, distance_line
                        ]);
                    }
                }
                this.paper.text(10, distance, labelsY[ly]).attr({'font-size': 12});
                distance += 40;
                distance_line += 40;
            }

            var distance = 180;
            var distance_line = 180;
            for(var lx = 0; lx < labelsX.length; lx++){
                if(typeof labelsX[lx].distance !== 'undefined' && labelsX[lx].distance === 'near'){
                    distance = distance-75;
                    distance_line = distance_line-75;
                    if(typeof labelsX[lx].position !== 'undefined' && labelsX[lx].position === 'up'){
                        this.paper.text(distance, 15, labelsX[lx].value).attr({'font-size': 14});
                        this.paper.path([
                            'M', distance_line, 30,
                            'L', distance_line, 550
                        ]).attr({"stroke-dasharray": "--"});
                    }else{
                        this.paper.text(distance, 565, labelsX[lx].value).attr({'font-size': 14});
                        this.paper.path([
                            'M', distance_line, 30,
                            'L', distance_line, 550
                        ]);
                    }
                }else{
                    this.paper.text(distance, 565, labelsX[lx].value).attr({'font-size': 14});
                    this.paper.path([
                        'M', distance_line, 30,
                        'L', distance_line, 550
                    ]);
                }
                distance += 150;
                distance_line += 150;
            }
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
        //console.log(serie);
        //console.log(serieIndex);
    },
    _clickUpdateChart: function(){
        var data = this.refs.inputRecChart.getValue();
        var self = this;

        var v_index = 0;
        data.map(function(v){
            var distance_y = 30;
            var distance_x = 180;
            var d_index = 0;
            var d_array = ['M'];
            v.data.map(function(d){
                if(d >= 0)
                    var d_y = (d*4)+30+40;
                else{
                    if(d === -10)
                        var d_y = 30;
                    else
                        var d_y = Math.abs((d*4))+30;
                }
                if(d_index === 0){
                    d_array.push(distance_x);
                    d_array.push(d_y);
                    distance_x += 150;
                }
                else{
                    d_array.push('L');
                    d_array.push(distance_x);
                    d_array.push(d_y);
                    distance_x += 75;
                }
                d_index++;
            })
            if(v_index === 0)
                self.paper.path(d_array)
                .attr({
                    'stroke-width': 3,
                    'stroke': 'red'
                });
            else
                self.paper.path(d_array)
                .attr({
                    'stroke-width': 3,
                    'stroke': 'blue'
                });
            v_index++;
        })
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
                            Rec Chart
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
                                <InputRecChart ref="inputRecChart" onChangeInput={this._onChangeInput}/>
                            </div>
                            <div ref="chart" id="chart"/>
                        </div>
                    </div>
                </div>
            )
        }
    }
})