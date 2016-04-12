module.exports = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		data: React.PropTypes.object,
		no: React.PropTypes.number,
		onClick: React.PropTypes.func
	},
	_onClick: function(e) {
		e.preventDefault()
		this.props.onClick(this.props.data)
	},
	render: function() {
		return (
			<li className={this.props.className} onClick={this._onClick}>
                <a data-toggle="tab" href="@#tab_1">
                    <i className="">{this.props.no}</i>{this.props.data.Name}
                </a>
                <span className="after"></span>
            </li>
			)
	}
})