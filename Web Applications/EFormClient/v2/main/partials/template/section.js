import React, {Component} from 'react'
import Baobab from 'baobab'

import Row from './row'

class Section extends Component{
    componentDidMount(){
        this._register_input_section_title()
        this._register_input_section_page()
        this._register_input_section_order()

        this.refs.dynamic_section.value = this.props.dynamic

        this._defaultValueForToolbar()
    }
    componentDidUpdate(){
        this._defaultValueForToolbar()
    }
    _register_input_section_title(){
        const self = this
        this.refs.input_section_title.addEventListener('keyup', function(event){
            if(event.keyCode === 13){
                self.props.onChangeSectionTitle(self.props.index, event.target.value)
            }
        }, false)
    }
    _register_input_section_page(){
        const self = this
        this.refs.input_section_page.addEventListener('keyup', function(event){
            if(event.keyCode === 13){
                self.props.onChangeSectionPage(self.props.index, parseInt(event.target.value))
            }
        }, false)
    }
    _register_input_section_order(){
        const self = this
        this.refs.input_section_order.addEventListener('keyup', function(event){
            if(event.keyCode === 13){
                self.props.onChangeSectionOrder(self.props.index, parseInt(event.target.value))
            }
        }, false)
    }
    _defaultValueForToolbar(){
        this.refs.input_section_title.value = this.props.params.get('title')
        this.refs.input_section_page.value = this.props.params.get('page')
        this.refs.input_section_order.value = this.props.index
    }
    _onRemoveSection(){
        this.props.onRemoveSection(this.props.index)
    }
    _onCloneSection(){
        this.props.onCloneSection(this.props.index)
    }
    _onAddRow(){
        this.props.onAddRow(this.props.index)
    }
    _onSelectObject(r_index, type){
        this.props.onSelectObject(this.props.index, r_index, type)
    }
    _onClickObject(r_index, o_index, o){
        this.props.onClickObject(this.props.index, r_index, o_index, o)
    }
    _onRemoveRow(r_index){
        this.props.onRemoveRow(this.props.index, r_index)
    }
    _onCloneRow(r_index){
        this.props.onCloneRow(this.props.index, r_index)
    }
    _onChangeRowOrder(r_index, new_order){
        this.props.onChangeRowOrder(this.props.index, r_index, new_order)
    }
    _onDown(){        
        this.refs.content.style.display = (getComputedStyle(this.refs.content, null).display === 'none')?'block':'none'
    }
    _onChangeSectionDynamic(event){
        this.props.onChangeSectionDynamic(this.props.index, event.target.value)
    }
    render(){
        return (
            <div className="section">
                <ul className="toolbar">
                    <li>
                        <a>
                            <i className="fa fa-flash"></i><b> Title</b><br/>
                            <input ref="input_section_title"/>
                        </a>
                    </li>
                    <li>
                        <a>
                            <b>Page</b><br/>
                            <input ref="input_section_page" className="small-input"/>
                        </a>
                    </li>
                    <li>
                        <a><i className="fa fa-sort-numeric-asc"></i>
                            <b>Order</b><br/>
                            <input ref="input_section_order" className="small-input"/>
                        </a>
                    </li>
                    <li>
                        <a>
                            <b>Ref</b><br/>
                            {this.props.params.get('ref')}
                        </a>
                    </li>
                    <li>
                        <a><i className="fa fa-remove"></i>
                            <button onClick={this._onRemoveSection.bind(this)}>Remove</button>
                        </a>
                    </li>
                    <li>
                        <a><i className="fa fa-copy"></i>
                            <button onClick={this._onCloneSection.bind(this)}>Clone</button>
                        </a>
                    </li>
                    <li>
                        <a><i className="fa fa-plus"></i>
                            <button onClick={this._onAddRow.bind(this)}>Row</button>
                        </a>
                    </li>
                    <li>
                        <a>
                            <button onClick={this._onDown.bind(this)}>Down</button>
                        </a>
                    </li>
                    <li>
                        <a>
                            <select ref="dynamic_section" onChange={this._onChangeSectionDynamic.bind(this)}>
                                <option value="">Normal</option>
                                <option value="d">Dynamic</option>
                            </select>
                        </a>
                    </li>
                </ul>
                <div className="content" ref="content">
                    {
                        this.props.params.select('r').map(function(r, r_index){
                            return (
                                <Row ref={r.get('ref')}
                                    index={r_index}
                                    params={r}
                                    onSelectObject={this._onSelectObject.bind(this)}
                                    onClickObject={this._onClickObject.bind(this)}
                                    onRemoveRow={this._onRemoveRow.bind(this)}
                                    onClone={this._onCloneRow.bind(this)}
                                    onChangeRowOrder={this._onChangeRowOrder.bind(this)}/>
                            )
                        }, this)
                    }
                </div>
            </div>
        )
    }
}

export default Section