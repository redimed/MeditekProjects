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
        $(this.refs.signature).jSignature();

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
        $(this.refs.signature).jSignature("setData", "data:" + value.join(","));
    },
    getValue: function(){
        return $(this.refs.signature).jSignature("getData", "base30")
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
    _onReset: function(){
        $(this.refs.signature).jSignature("reset");
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
            case 'signature':
                html = (
                    <div className={"col-xs-"+this.props.size} ref="group">
                        <div className="form-group" id={this.props.groupId}>
                            <div className="col-xs-12">
                                <a className="btn btn-primary btn-sm" onClick={this._onReset}>
                                    Reset
                                </a>
                                <div ref="signature"/>
                            </div>
                        </div>
                    </div>
                )
        }
        return html;
    }
})