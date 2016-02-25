module.exports = React.createClass({
    propTypes: {
        list: React.PropTypes.array.isRequired,
        code: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired
    },
    componentDidMount: function(){
        $(this.refs.select).select2({
            width: null,
            placeholder: 'Select...'
        })
    },
    setValue: function(value){
        $(this.refs.select).select2('val',value)
    },
    getValue: function(){
        return $(this.refs.select).val()
    },
	render: function(){
        return (
            <select ref="select" className="form-control">
                <option value=""></option>
                {
                    this.props.list.map(function(l, index){
                        return <option key={index} value={l[this.props.code]}>{l[this.props.name]}</option>
                    }, this)
                }
            </select>
        )
	}
})