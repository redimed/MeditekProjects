var CommonInputText = require('common/inputText');
var Series = require('modules/eform/eformTemplateDetail/chart/series');
var AxisX = require('modules/eform/eformTemplateDetail/chart/axisX');

module.exports = React.createClass({
    code: 0,
    ref: '',
    type: '',
    init: function(object){
        this.refs.series.init(object.series);
        this.refs.axisX.init(object.axisX);
        this.ref = object.ref;
        this.type = object.type;
        this.code = object.code;
        this.refs.formName.setValue(object.name);
        this.refs.formRef.setValue(object.ref);
        this.refs.formSize.setValue(object.size);
        this.refs.formTitle.setValue(object.title);
        this.refs.formSubtitle.setValue(object.subtitle);
    },
    _onSave: function(){
        var size = this.refs.formSize.getValue();
        var data = null;
        data = {
            name: this.refs.formName.getValue(),
            code: this.code,
            type: 'line_chart',
            size: size,
            ref: this.refs.formRef.getValue(),
            title: this.refs.formTitle.getValue(),
            subtitle: this.refs.formSubtitle.getValue(),
            series: this.refs.series.getValue(),
            axisX: this.refs.axisX.getValue()
        }
        this.props.onSave(data);
    },
    render: function(){
        return (
            <div className="grid">
                <div className="row" style={{paddingLeft: '40px', paddingRight: '40px'}}>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Pre Cal</label>
                            <CommonInputText placeholder="Type Pre Cal" ref="formPrecal"/>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Name</label>
                            <CommonInputText placeholder="Type name" ref="formName"/>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Ref</label>
                            <CommonInputText placeholder="Type Ref" ref="formRef"/>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Size</label>
                            <CommonInputText placeholder="Type Size" ref="formSize"/>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <AxisX ref="axisX"/>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Title</label>
                            <CommonInputText placeholder="Title" ref="formTitle"/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Subtitle</label>
                            <CommonInputText placeholder="Title" ref="formSubtitle"/>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <Series ref="series"/>
                    </div>
                    <div className="form-group" style={{float:'right'}}>
                        <button type="button" className="btn btn-default" onClick={this.props.onCloseModal}>Close</button>
                        &nbsp;
                        <button type="button" className="btn btn-primary" onClick={this._onSave}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
})