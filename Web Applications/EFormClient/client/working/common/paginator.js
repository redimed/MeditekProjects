module.exports = React.createClass({
	propTypes: {
        item : React.PropTypes.number,
        maxButtons: React.PropTypes.number,
        activePage: React.PropTypes.number,
	},
	getInitialState: function(){
		return {
            activePage:this.props.activePage?this.props.activePage:1,
            item : this.props.item?this.props.item:10,
            maxButtons: this.props.maxButtons?this.props.maxButtons:5,
        };
	},
    init: function(obj) {
        if(!_.isEmpty(obj)) {
            this.setState({activePage:obj.activePage, item:obj.item, maxButtons:obj.maxButtons});
        }
		var self = this;
        $('#pagination').twbsPagination({
            totalPages:self.state.item,
            visiblePages:self.state.maxButtons,
			onPageClick: function (event, page) {
				if(typeof self.props.onChange !== 'undefined'){
		            self.props.onChange(page);
		        }
	        }
        });
    },
    componentDidMount: function() {

    },
	render: function(){
		return(
            <ul id="pagination" className="pagination-sm"></ul>
        )
	},
});
