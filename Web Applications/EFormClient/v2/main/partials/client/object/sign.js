import React, {Component} from 'react'

class Sign extends Component{
    constructor(){
        super()
    }
    init(width, height){
        $('#'+this.props.name).jSignature({width: width, lineWidth: 1, height: (width-100)})
    }
    componentDidMount(){

    }
    _onClear(){
        $('#'+this.props.name).jSignature("reset")
    }
    _onSign(){
        $(this.refs.real).show()
        $(this.refs.preview).hide()
    }
    _onCancel(){
        $(this.refs.real).hide()
        $(this.refs.preview).show()  
    }
    render(){
        return (
            <div className="canvas" ref="canvas">
                <div ref="real" style={{display: 'none'}}>
                    <ul className="toolbar">
                        <li><a><button onClick={this._onClear.bind(this)}>Clear</button></a></li>
                        <li><a><button onClick={this._onCancel.bind(this)}>Cancel</button></a></li>
                    </ul>
                    <div id={this.props.name}/>
                </div>
                <div ref="preview">
                    <ul className="toolbar">
                        <li><a><button onClick={this._onSign.bind(this)}>Sign New</button></a></li>
                    </ul>
                    <img ref="image" src="/images/nosign.gif" style={{width: '100%'}} id={this.props.name+'_image'}/>
                </div>
            </div>
        )
    }
}

export default Sign