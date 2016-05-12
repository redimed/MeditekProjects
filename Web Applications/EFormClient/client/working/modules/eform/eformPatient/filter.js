var EFormService = require('modules/eform/services');
var InputText = require('common/inputText');
var InputDate = require('common/inputDate');
var Config = require('config');
// var _ = require('lodash');

module.exports = React.createClass({
    search:{},
    propTypes: {
        onFilter: React.PropTypes.func,
        onPress: React.PropTypes.func,
        onLoad: React.PropTypes.func,
    },
    _onFilter: function(refs) {
        // console.log("name ",refs.props.name);
        // console.log("value ", refs.getValue());
        if(!this.search[refs.props.name]) {
            this.search[refs.props.name] = refs.getValue();
        }
        else {
            if(refs.getValue() =='' || refs.getValue() == null) {
                delete this.search[refs.props.name];
            }
            else {
                this.search[refs.props.name] = refs.getValue();
            }
        }
        this.props.onSearch(this.search);
    },
    _onPress: function(refs, e) {
        if (e.keyCode === 13) {
            this._onFilter(refs);
        }
    },
    _clearSearch: function(callback) {
        this.search.FromTime = '';
        this.search.Code = null;
        this.search.Name = null;
        this.search.CreatedDate = '';
        this.setValue();
        callback();
    },
    setValue:function() {
        for(var key in this.search) {
            if(key == 'FromTime') {
                this.refs.apt_date.setValue(this.search.FromTime);
            }
            if(key == 'Code') {
                this.refs.apt_code.setValue(this.search.Code);
            }
            if(key == 'Name') {
                this.refs.name.setValue(this.search.Name);
            }
            if(key == 'CreatedDate') {
                this.refs.created_date.setValue(this.search.CreatedDate);
            }
        }
    },
	render: function(){
        var self = this;
		return (
            <tr>
                <td></td>
                <td><InputDate placeholder="Appointment date" name="FromTime" ref="apt_date" onChange={this._onFilter.bind(this,self.refs.apt_date)} /></td>
                <td><InputText placeholder="Appointment code" name="Code" ref="apt_code" onKeyPress={this._onPress.bind(this,self.refs.apt_code)} /></td>
                <td><InputText placeholder="Name" ref="name"  name="Name" onKeyPress={this._onPress.bind(this ,self.refs.name)} /></td>
                <td><InputDate placeholder="Created Date" name="CreatedDate" ref="created_date" onChange={this._onFilter.bind(this,self.refs.created_date)} /></td>
                <td width="1"></td>
            </tr>
		)
	}
})
