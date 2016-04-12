var EFormHistory = require('./eformHistory')
module.exports = React.createClass({
	propTypes: {

	},
	componentWillMount: function() {

	},
	componentDidMount: function() {

	},
	componentWillUnmount: function() {

	},
	render: function() {
		return (
				<table className="table table-hover table-striped">
                    <thead>
                        <tr>
                            <th width="1">#</th>
                            <th>Created date</th>
                            <th>Created by</th>
                        </tr>
                    </thead>
                    <tbody>
                    	<EFormHistory />
                    	<EFormHistory />
                    </tbody>
                </table>
			)
	}
})