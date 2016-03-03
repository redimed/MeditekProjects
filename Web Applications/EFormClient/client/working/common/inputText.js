module.exports = React.createClass({
    propTypes: {
        label: React.PropTypes.string,
        name: React.PropTypes.string,
        size: React.PropTypes.any,
        groupId: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        code: React.PropTypes.number,
        type: React.PropTypes.string,
        context: React.PropTypes.string,
        onRightClickItem: React.PropTypes.func
    },
    getDefaultProps: function(){
        return {
            placeholder: '',
            type: 'default',
            name: '',
            className: 'form-control',
            size: '12'
        }
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
    },
    setValue: function(value){
        $(this.refs.input).val(value)
    },
    getValue: function(){
        return $(this.refs.input).val()
    },
    getName: function(){
        return this.props.name;
    },
    getLabel: function(){
        return this.props.label;
    },
    getSize: function(){
        return this.props.size;
    },
    getType: function(){
        return this.props.type;
    },
	render: function(){
        var type = this.props.type;
        var html = null;
        switch(type){
            case 'default':
                html = (
                    <input type="text" className={this.props.className} ref="input" placeholder={this.props.placeholder}/>
                )
                break;
            case 'itlh':
                html = (
                    <div className={"dragula col-md-"+this.props.size} ref="group">
                        <div className="form-group" id={this.props.groupId}>
                            <label className="control-label col-md-3">{this.props.label}</label>
                            <div className="col-md-9">
                                <input type="text" className={this.props.className} ref="input" placeholder={this.props.placeholder}/>
                            </div>
                        </div>
                    </div>
                )
                break;
            case 'it':
                html = (
                    <input type="text" className="form-control" ref="input"/>
                )
                break;
            case 'itnl':
                html = (
                    <div className={"dragula col-xs-"+this.props.size} ref="group">
                        <div className="form-group" id={this.props.groupId}>
                            <div className="col-xs-12">
                                <input type="text" title={this.props.name} className={this.props.className} ref="input" placeholder={this.props.placeholder}/>
                            </div>
                        </div>
                    </div>
                )
        }
        return html;
	}
})