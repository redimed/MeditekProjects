import React, {Component} from 'react'
import Baobab from 'baobab'

import Row from './row'

class Section extends Component{
    componentDidMount(){
        
    }
    hide(){
        $(this.refs.content).hide()
    }
    show(){
        $(this.refs.content).show()
    }
    _hide(){
       this.hide()
        this.props.onHide(this.props.params)
    }
    _show(){
        this.show()
        this.props.onShow(this.props.params)
    }
    render(){
        const title = (this.props.params.get('title') !== '')?'block':'none'
        const dynamic = this.props.dynamic?'block':'none'

        return (
            <div className="section">
                <ul className="toolbar" style={{display: dynamic}}>
                    <li><a onClick={this._show.bind(this)}>Show</a></li>
                    <li><a onClick={this._hide.bind(this)}>Hide</a></li>
                </ul>
                <h3 style={{display: title}}>{this.props.params.get('title')}</h3>
                <div className="content" ref="content">
                    {
                        this.props.params.select('r').map(function(r, r_index){
                            return (
                                <Row ref={r.get('ref')}
                                    index={r_index}
                                    params={r}/>
                            )
                        }, this)
                    }
                </div>
            </div>
        )
    }
}

export default Section