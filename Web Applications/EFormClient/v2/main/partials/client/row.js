import React, {Component} from 'react'
import Baobab from 'baobab'

import Radio from './object/radio'
import Checkbox from './object/checkbox'
import Sign from './object/sign'
import InputDate from './object/date'

import Helper from '../../config/helper'

import CONSTANTS from '../../config/constants'
const EFORM_CONST = CONSTANTS.EFORM

class Row extends Component{
    constructor(){
        super()
        this.objects_init = []
    }
    componentDidMount(){
        const self = this
        this.objects_init.map(function(obj){
            const width = $(self.refs[obj]).width()
            const height = $(self.refs[obj]).height()
            self.refs[obj+'_obj'].init(width, height)
        })
    }
    render(){
        return (
            <div className="row">
                {
                    this.props.params.select('o').map(function(o, o_index){
                        var res = null
                        if(EFORM_CONST.OBJECT_TYPE.LABEL === o.get('type'))
                            var style = {
                                width: o.get('params', 'width'),
                                border: 'none'
                            }
                        else
                            var style = {
                                width: o.get('params', 'width'),
                                border: 'none',
                                textAlign: o.get('params', 'align') || 'left'
                            }
                        var className = 'object'
                        if(typeof o.select('params').get('border') !== 'undefined'){
                            const p_border = o.select('params').get('border')
                            if(p_border !== 'none'){
                                Helper.toStyleBorder(p_border, style)
                                className += ' border'
                                if(o.get('type') === 'it')
                                    style.padding = 0
                            }
                        }
                        switch(o.get('type')){
                            case EFORM_CONST.OBJECT_TYPE.LABEL:
                                res = (
                                    <div className={className+' label'}
                                        style={style}>
                                        <span dangerouslySetInnerHTML={{__html: o.get('params','title')}}/>
                                    </div>
                                )
                                break
                            case EFORM_CONST.OBJECT_TYPE.RADIO:
                                res = (
                                    <div className={className}
                                        style={style}>
                                        <Radio name={o.get('name' || '')} id={o.get('params', 'id' || '')} value={o.get('params','value')}/>
                                        &nbsp;&nbsp;
                                        <label htmlFor={o.get('params', 'id' || '')}>{o.get('params', 'title')}</label>
                                    </div>
                                )
                                break
                            case EFORM_CONST.OBJECT_TYPE.CHECKBOX:
                                res = (
                                    <div className={className}
                                        style={style}>
                                        <Checkbox name={o.get('name' || '')} id={o.get('params', 'id' || '')}/>
                                        &nbsp;&nbsp;
                                        <label htmlFor={o.get('params', 'id' || '')}>{o.get('params', 'title')}</label>
                                    </div>
                                )
                                break
                            case EFORM_CONST.OBJECT_TYPE.TEXT:
                                var disabled = (o.get('params').disabled) || false
                                res = (
                                    <div className={className+' input'}
                                        style={style}>
                                        <input type="text" id={o.get('name') || ''} disabled={disabled}/>
                                    </div>
                                )
                                break
                            case EFORM_CONST.OBJECT_TYPE.NUMBER:
                                var disabled = (o.get('params').disabled) || false
                                res = (
                                    <div className={className+' input'}
                                        style={style}>
                                        <input type="number" id={o.get('name') || ''} disabled={disabled}/>
                                    </div>
                                )
                                break
                            case EFORM_CONST.OBJECT_TYPE.DATE:
                                var disabled = (o.get('params').disabled) || false
                                res = (
                                    <div className={className+' input'}
                                        style={style}>
                                        <InputDate name={o.get('name')}/>
                                    </div>
                                )
                                break
                            case EFORM_CONST.OBJECT_TYPE.SIGN:
                                this.objects_init.push(o.get('name') || '')
                                res = (
                                    <div className={className} ref={o.get('name') || ''}
                                        style={style}>
                                        <Sign ref={o.get('name')+'_obj'} name={o.get('name')}/>
                                    </div>
                                )
                                break
                        }
                        return res
                    }, this)
                }
            </div>
        )
    }
}

export default Row