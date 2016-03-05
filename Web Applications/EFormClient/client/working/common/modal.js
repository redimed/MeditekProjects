module.exports = React.createClass({
	show: function(){
		$(this.refs.modal).modal('show');
	},
	hide: function(){
		$(this.refs.modal).modal('hide');
	},
	componentDidMount: function(){
		$(this.refs.modal).modal({
			detachable: false
		});
	},
	render: function(){
		return (
			<div className="ui modal" ref="modal">
				{this.props.children}
			</div>
		)
	}
})