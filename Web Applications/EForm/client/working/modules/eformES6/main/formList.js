import EFormService from 'modules/eform/services'
const Link = ReactRouter.Link

class FormList extends React.Component{
    constructor(){
        super()
        this.state = {
            list: []
        }
    }
    componentDidMount(){
        this._serverListForm()
    }
    refresh(){
        this._serverListForm()
    }
    _serverListForm(){
        var self = this
        App.blockUI()
        EFormService.formList()
        .then(function(response){
            self.setState({list: response.data})
            App.unblockUI()
        })
    }
	render(){
        var preList = null
        var table = null
        if(this.state.list.length === 0)
            preList = <p className="font-red-thunderbird">There is no data here</p>
        else
            table = <table className="table table-bordered table-striped table-condensed flip-content">
                        <thead className="flip-content">
                            <tr>
                                <th className="bg-blue-dark bg-font-blue-dark">Name</th>
                                <th className="bg-blue-dark bg-font-blue-dark">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.list.map((l,index)=>{
                                    return (
                                        <tr key={index}>
                                            <td>{l.name}</td>
                                            <td>
                                                <Link to={"/eform/detail/"+l.id} 
                                                    className="label label-sm label-success">
                                                    View Form
                                                </Link>
                                                &nbsp;
                                                <span className="label label-sm label-success" style={{cursor:'pointer'}}>
                                                    Edit Name
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
		return (
			<div className="row">
                <div className="col-md-12">
                    {preList}
                    {table}
                </div>
            </div>
		)
	}
}

export default FormList