module.exports = React.createClass({
	propTypes: {
		portal: React.PropTypes.string.isRequired
	},
	show: function(){
		this.componentWillUnmount();
		this.mountPortal();
		var self = this;
		$('#'+this.props.portal).modal('show')
		$('#'+this.props.portal).on('hide.bs.modal', function(e){
			self.unmountPortal();
			self.mountPortal();
		});
	},
	hide: function(){
		$('#'+this.props.portal).modal('hide')
	},
	mountPortal: function(){
		if($('#'+this.props.portal).length === 0){
			var target = document.createElement('div');
			target.setAttribute('class','modal fade');
			target.setAttribute('data-width','760');
			target.setAttribute('id',this.props.portal);
			document.body.appendChild(target);
			this.renderPortal(target);
		}
	},
	unmountPortal: function(){
		$('#'+this.props.portal).parent().remove();
		$('#'+this.props.portal).remove();
		$('body').find('.modal-backdrop').remove();
	},
	componentDidMount: function(){
		this.mountPortal();
	},
	componentWillUnmount: function(){
		$('#'+this.props.portal).remove();
	},
	renderPortal: function(target){
		var component = React.createElement('div', null, this.props.children);
		ReactDOM.render(component, target);
	},
	render: function(){
		return null
	}
})