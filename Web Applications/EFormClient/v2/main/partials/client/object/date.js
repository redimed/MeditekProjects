import React, {Component} from 'react'

class Date extends Component{
    constructor(){
        super()
    }
    componentDidMount(){
        $('#'+this.props.name).datetimepicker({
            timepicker: false,
            format: 'd/m/Y'
        })
    }
    render(){
        return (
            <input type="text" name={this.props.name} id={this.props.name}/>
        )
    }
}

export default Date