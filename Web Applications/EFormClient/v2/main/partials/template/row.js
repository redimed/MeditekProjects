import React, {Component} from 'react'
import Baobab from 'baobab'
import CONSTANTS from '../../config/constants'
const EFORM_CONST = CONSTANTS.EFORM

class Row extends Component{
    constructor() {
        super()
        this.isShowToolBar = true
    }
    componentDidMount(){
        const self = this
        this._defaultValueForToolbar()
        this.refs.input_row_order.addEventListener('keyup', function(event){
            if(event.keyCode === 13){
                self.props.onChangeRowOrder(self.props.index, parseInt(event.target.value))
            }
        }, false)
    }
    componentDidUpdate(){
        this._defaultValueForToolbar()
    }
    _defaultValueForToolbar(){
        this.refs.input_row_order.value = this.props.index
    }
    _onChoose(type){
        this.props.onSelectObject(this.props.index, type)
    }
    _onClickObject(o, o_index){
        this.props.onClickObject(this.props.index, o_index, o)
    }
    _onRemove(){
        this.props.onRemoveRow(this.props.index)
    }
    _onClone(){
        this.props.onClone(this.props.index)  
    }
    _toggleToolBar(){
        if(this.isShowToolBar){
            $(this.refs.toolbar).hide()
            $(this.refs.nottoolbar).show()
        } else {
            $(this.refs.toolbar).show()
            $(this.refs.nottoolbar).hide()
        }
        this.isShowToolBar = !this.isShowToolBar
    }
    render(){
        return (
            <div className="row">
                <ul ref="toolbar" className="toolbar-row">
                    <li className="toolbar-row-action">
                        <a>
                            <button onClick={this._toggleToolBar.bind(this)}><i className="fa fa-check"></i> Done </button>
                        </a>
                    </li>
                    <li>
                        <a>
                            <b>Order</b><br/>
                            <input ref="input_row_order" className="small-input"/>
                        </a>
                    </li>
                    <li>
                        <a>
                            <b>Ref</b><br/>
                            {this.props.params.get('ref')}
                        </a>
                    </li>
                    <li className="toolbar-row-action">
                        <a>
                            <button onClick={this._onRemove.bind(this)}><i className="fa fa-remove"></i> Remove</button>
                        </a>
                    </li>
                    <li className="toolbar-row-action">
                        <a>
                            <button onClick={this._onClone.bind(this)}><i className="fa fa-copy"></i> Clone</button>
                        </a>
                    </li>
                    <li>
                        <a><i className="fa fa-tag"></i> 
                            <button onClick={this._onChoose.bind(this, EFORM_CONST.OBJECT_TYPE.LABEL)}>Label</button>
                        </a>
                    </li>
                    <li>
                        <a><i className="fa fa-circle-o"></i> 
                            <button onClick={this._onChoose.bind(this, EFORM_CONST.OBJECT_TYPE.RADIO)}>Radio</button>
                        </a>
                    </li>
                    <li>
                        <a><i className="fa fa-check-square-o"></i> 
                            <button onClick={this._onChoose.bind(this, EFORM_CONST.OBJECT_TYPE.CHECKBOX)}>Checkbox</button>
                        </a>
                    </li>
                    <li>
                        <a>
                            <button onClick={this._onChoose.bind(this, EFORM_CONST.OBJECT_TYPE.TEXT)}>Text</button>
                        </a>
                    </li>
                    <li>
                        <a>
                            <button onClick={this._onChoose.bind(this, EFORM_CONST.OBJECT_TYPE.NUMBER)}>Number</button>
                        </a>
                    </li>
                    <li>
                        <a><i className="fa fa-calendar-o"></i> 
                            <button onClick={this._onChoose.bind(this, EFORM_CONST.OBJECT_TYPE.DATE)}>Date</button>
                        </a>
                    </li>
                    <li>
                        <a><i className="fa fa-pencil"></i> 
                            <button onClick={this._onChoose.bind(this, EFORM_CONST.OBJECT_TYPE.SIGN)}>Signature</button>
                        </a>
                    </li>
                    <li>
                        <a><i className="fa fa-paint-brush"></i> 
                            <button onClick={this._onChoose.bind(this, EFORM_CONST.OBJECT_TYPE.DRAWING)}>Drawing</button>
                        </a>
                    </li>
                    <li>
                        <a><i className="fa fa-table"></i> 
                            <button onClick={this._onChoose.bind(this, EFORM_CONST.OBJECT_TYPE.DYNAMIC_TABLE)}>Dynamic Table</button>
                        </a>
                    </li>
                </ul>
                <div ref="nottoolbar"  style={{ display: 'none',  clear: 'both'}}>
                    <button onClick={this._toggleToolBar.bind(this)} style={{ color: 'red', float: 'right',}}>Toolbar</button>
                </div>

                <div className="content-row">
                    {
                        this.props.params.select('o').map(function(o, o_index){
                            // console.log(o.serialize())
                            var res = null
                            var width = o.get('params', 'width') || 'initial'

                            switch(o.get('type')){
                                case EFORM_CONST.OBJECT_TYPE.LABEL:
                                    var title = o.get('params', 'title')||'<span style="color: yellow">Label</span>'
                                    res = (
                                        <div className="object" style={{width: width}}
                                            onClick={this._onClickObject.bind(this, o, o_index)}>
                                            <div dangerouslySetInnerHTML={{__html: title}}/>
                                        </div>
                                    )
                                    break
                                case EFORM_CONST.OBJECT_TYPE.RADIO:
                                    var nameHtml = o.get('name')
                                    // let title = o.get('params', 'title')||'<span style="color: yellow">Label</span>'
                                    res = (
                                        <div className="object"  style={{width: width}}
                                            onClick={this._onClickObject.bind(this, o, o_index)}>
                                            <div className="object-wrapper">
                                                <div className="object-name">{nameHtml}</div>
                                                <input type="radio" disabled/>&nbsp;{o.get('params', 'title')}
                                            </div>
                                        </div>
                                    )
                                    break
                                case EFORM_CONST.OBJECT_TYPE.CHECKBOX:
                                    var nameHtml = o.get('name')
                                    res = (
                                        <div className="object"  style={{width: width}}
                                            onClick={this._onClickObject.bind(this, o, o_index)}>
                                            <div className="object-wrapper">
                                                <div className="object-name">{nameHtml}</div>
                                                <input type="checkbox" disabled/>&nbsp;{o.get('params', 'title')}
                                            </div>
                                        </div>
                                    )
                                    break
                                case EFORM_CONST.OBJECT_TYPE.TEXT:
                                    var nameHtml = o.get('name')
                                    res = (
                                        <div className="object" style={{width: width}}
                                            onClick={this._onClickObject.bind(this, o, o_index)}>
                                            <div className="object-wrapper">
                                                <div className="object-name object-it">{nameHtml}</div>
                                                <input type="text" disabled placeholder="Input Text"/>
                                            </div>
                                        </div>
                                    )
                                    break
                                case EFORM_CONST.OBJECT_TYPE.NUMBER:
                                    res = (
                                        <div className="object"  style={{width: width}}
                                            onClick={this._onClickObject.bind(this, o, o_index)}>
                                            <input type="number" disabled placeholder="Number"/>
                                        </div>
                                    )
                                    break
                                case EFORM_CONST.OBJECT_TYPE.DATE:
                                    var nameHtml = o.get('name')
                                    res = (
                                         <div className="object" style={{width: width}}
                                            onClick={this._onClickObject.bind(this, o, o_index)}>
                                             <div className="object-wrapper">
                                                <div className="object-name object-id">{nameHtml}</div>
                                                <input type="text" disabled placeholder="Input Date"/>
                                            </div>
                                        </div>
                                    )
                                    break
                                case EFORM_CONST.OBJECT_TYPE.SIGN:
                                    var nameHtml = o.get('name')
                                    res = (
                                        <div className="object"  style={{width: width}}
                                            onClick={this._onClickObject.bind(this, o, o_index)}>
                                             <div className="object-wrapper">
                                                <div className="object-name object-si">{nameHtml}</div>
                                                <input type="text" disabled placeholder="Signature"/>
                                            </div>
                                        </div>
                                    )
                                    break
                                 case EFORM_CONST.OBJECT_TYPE.DRAWING:
                                    var nameHtml = o.get('name')
                                    res = (
                                        <div className="object"  style={{width: width}}
                                            onClick={this._onClickObject.bind(this, o, o_index)}>
                                             <div className="object-wrapper">
                                                <div className="object-name object-dr">{nameHtml}</div>
                                                <input type="text" disabled placeholder="Drawing"/>
                                            </div>
                                        </div>
                                    )
                                    break    
                                case EFORM_CONST.OBJECT_TYPE.DYNAMIC_TABLE:
                                    res = (
                                        <div className="object" style={{width: width}}
                                            onClick={this._onClickObject.bind(this, o, o_index)}>
                                            Dynamic Table
                                        </div>
                                    )
                                    break
                            }
                            return res
                        }, this)
                    }
                </div>
            </div>
        )
    }
}

export default Row