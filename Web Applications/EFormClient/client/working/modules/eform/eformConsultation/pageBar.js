module.exports = React.createClass({
	render: function() {
		return (
			<div className="page-bar">
			    <ul className="page-breadcrumb">
			        <li>
			            <i className="fa fa-home"></i>
			            <a>Consultation</a>
			        </li>
			        <li>
			            <i className="fa fa-angle-right"></i>
			            <label className="text-primary">Consultation Detail</label>
			        </li>
			    </ul>
			</div>
			)
	}
})