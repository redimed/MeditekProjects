import React, {Component} from 'react'

class Radio extends Component{
    componentDidMount(){
        /*$(this.refs.root).iCheck({
            radioClass: 'iradio_square-green'
        })*/
    }
    render(){
        return (
            <input type="radio" name={this.props.name} id={this.props.id} ref="root" value={this.props.value}/>
        )
    }
}

export default Radio