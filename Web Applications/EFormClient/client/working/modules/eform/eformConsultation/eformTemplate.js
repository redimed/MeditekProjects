module.exports = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		data: React.PropTypes.object,
		onClick: React.PropTypes.func
	},
	_onClick: function(e) {
		e.preventDefault()
		this.props.onClick(this.props.data)
	},
	render: function() {
		return (
				<div className="col-lg-6 col-md-12 margin-bottom-20">
                    <div className={"dashboard-stat "+this.props.className}>
                        <div className="visual">
                            <i className="fa fa-file-text-o"></i>
                        </div>
                        <div className="details">
                            <div className="number">{this.props.data.Name}</div>
                        </div>
                        <a className="more" onClick={this._onClick}>
                            View  <i className="m-icon-swapright m-icon-white"></i>
                        </a>
                    </div>
                </div>
			)
	}
})