module.exports = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		onKeyDown: React.PropTypes.func
	},
	render: function() {
		return (
			<input type ="text" className={this.props.className} placeholder={this.props.placeholder} onKeyDown={this.props.onKeyDown}/>
			)
	}
})