var history = ReactRouter.hashHistory;
var Router = ReactRouter.Router;

var routes = require('routes');

ReactDOM.render(<Router history={history} routes={routes}/>, document.getElementById('app'))