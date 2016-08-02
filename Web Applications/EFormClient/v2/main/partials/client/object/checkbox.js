import React, {Component} from 'react'

class Checkbox extends Component{
    componentDidMount(){
        $(this.refs.root).iCheck({
            checkboxClass: 'icheckbox_square-green'
        })
    }
    render(){
        return (
            <input type="checkbox" name={this.props.name} id={this.props.id} ref="root"/>
        )
    }
}

export default Checkbox