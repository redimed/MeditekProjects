import React, {Component} from 'react'
import Baobab from 'baobab'
import {render} from 'react-dom'

import Section from '../../partials/template/section'
import MeMath from '../../config/math'

import Service from '../../services/main'
import CONSTANTS from '../../config/constants'
const EFORM_CONST = CONSTANTS.EFORM

class EFormTemplateDetail extends Component{
    constructor(){
        super()
        this.list = new Baobab({
            sections: [],
            obj: [],
            defVal: []
        })
        this.selected_obj = null
        // this.align_arr = [
        //     {code: 'left', name: 'Left'},
        //     {code: 'center', name: 'Center'},
        //     {code: 'right', name: 'Right'}
        // ]
        this.align_arr = EFORM_CONST.DEFAULT_VALUE.ALIGN_ARR
        this.suggest_width = EFORM_CONST.DEFAULT_VALUE.SUGGEST_WIDTH
        this.user_uid = ''
        this.template_uid = ''
        this.dynamic_obj = []
        this.dynamic_id = ''
    }
    componentDidMount(){
        const self = this
        this.user_uid = MeMath.parseQueryString(window.location.href).userUID
        this.template_uid = MeMath.parseQueryString(window.location.href).templateUID
        Service.EFormTemplateDetail({uid: this.template_uid})
        .then(function(response){
            var TempData = JSON.parse(response.data.EFormTemplateData.TemplateData)
            console.log(TempData)
            if(TempData.hasOwnProperty('sections')) {
                 self.list.set('sections', TempData.sections)
            } else {
                 self.list.set('sections', []);
            }
            if(TempData.hasOwnProperty('defVal')) {
                 self.list.set('defVal', TempData.defVal)
            }

            self._register_navbar_add_section()
            self._clearAllDetail()
            self.forceUpdate()
        })
    }
    _getCurrentRef(){
        let res = 0
        this.list.select('sections').map(function(s, s_index){
            let ref_num = s.get('ref').split('_')[1]
            if(MeMath.largerEq(ref_num, res))
                res = ref_num
        })
        if(this.list.select('sections').get().length > 0)
            res++
        return res
    }
    _addSection(section){
        section.ref = 's_'+this._getCurrentRef()
        let section_list = this.list.select('sections').push(section)
        this.list.sections = section_list
        this.forceUpdate()
    }
    _getCurrentRow(s_index){
        let res = 0
        this.list.select('sections', s_index, 'r').map(function(r, r_index){
            let ref_num = r.get('ref').split('_')[2]
            if(MeMath.largerEq(ref_num, res))
                res = ref_num 
        })        
        if(this.list.select('sections', s_index, 'r').get().length > 0)
            res++
        return res
    }
    _addRow(row, s_index){
        row.ref = 'r_'+s_index+'_'+this._getCurrentRow(s_index)
        this.list.select('sections', s_index, 'r').push(row)        
        this.forceUpdate()  
    }
    _register_navbar_add_section(){
        const self = this
        this.refs.navbar_add_section.addEventListener('click', function(event){
            self._addSection({title: '', page: 1, r: []})
        }, false)
    }
    
    
    _onChangeSectionDynamic(s_index, value){
        this.list.select('sections', s_index).set('dynamic', value)
        this.forceUpdate()
    }
    _onChangeSectionTitle(s_index, new_title){
        this.list.select('sections', s_index).set('title', new_title)
        this.forceUpdate()
    }
    _onChangeSectionPage(s_index, new_page){
        this.list.select('sections', s_index).set('page', new_page)
        this.forceUpdate()
    }
    _onChangeSectionOrder(s_index, new_order){
        const section_length = this.list.select('sections').get().length
        if(s_index !== new_order && new_order < section_length){
            const change_section = this.list.select('sections', s_index)
            const old_section = this.list.select('sections', new_order)
            let new_list = new Baobab({
                sections: []
            })
            if(new_order < s_index){
                this.list.select('sections').map(function(s, ss_index){
                    if(ss_index < new_order)
                        new_list.select('sections').push(s.get())
                })
                new_list.select('sections').push(change_section.get())
                new_list.select('sections').push(old_section.get())
                this.list.select('sections').map(function(s, ss_index){
                    if(ss_index > new_order && ss_index !== s_index)
                        new_list.select('sections').push(s.get())
                })
            }else{
                this.list.select('sections').map(function(s, ss_index){
                    if(ss_index <= new_order)
                        new_list.select('sections').push(s.get())
                })
                new_list.select('sections').unset(s_index)
                new_list.select('sections').push(change_section.get())
                this.list.select('sections').map(function(s, ss_index){
                    if(ss_index > new_order)
                        new_list.select('sections').push(s.get())
                })
            }
            this.list = new_list
            this.forceUpdate()
        }
    }
    _onRemoveSection(s_index){
        this.list.select('sections').unset(s_index)
        this.forceUpdate()
    }
    _onCloneSection(s_index){
        let section = this.list.select('sections', s_index)
        this._addSection(section.serialize())
    }
    _onAddRow(s_index){
        const row = {o: []}
        this._addRow(row, s_index)
    }
    _onRemoveRow(s_index, r_index){
        this.list.select('sections', s_index, 'r').unset(r_index)
        this.forceUpdate()
    }
    _onCloneRow(s_index, r_index){
        const row = this.list.select('sections', s_index, 'r', r_index)
        this._addRow(row.serialize(), s_index)
    }
    _onChangeRowOrder(s_index, r_index, new_order){
        const row_length = this.list.select('sections', s_index, 'r').get().length
        if(r_index !== new_order && new_order < row_length){
            const change_row = this.list.select('sections', s_index, 'r', r_index)
            const old_row = this.list.select('sections', s_index, 'r', new_order)
            let new_list_serialize = this.list.serialize()
            new_list_serialize.sections[s_index].r = []
            let new_list = new Baobab(new_list_serialize)
            if(new_order < r_index){
                this.list.select('sections', s_index, 'r').map(function(r, rr_index){
                    if(rr_index < new_order)
                        new_list.select('sections', s_index, 'r').push(r.get())
                })
                new_list.select('sections', s_index, 'r').push(change_row.get())
                new_list.select('sections', s_index, 'r').push(old_row.get())
                this.list.select('sections', s_index, 'r').map(function(r, rr_index){
                    if(rr_index > new_order && rr_index !== r_index)
                        new_list.select('sections', s_index, 'r').push(r.get())
                })
            }else{
                this.list.select('sections', s_index, 'r').map(function(r, rr_index){
                    if(rr_index <= new_order)
                        new_list.select('sections', s_index, 'r').push(r.get())
                })
                new_list.select('sections', s_index, 'r').unset(r_index)
                new_list.select('sections', s_index, 'r').push(change_row.get())
                this.list.select('sections', s_index, 'r').map(function(r, rr_index){
                    if(rr_index > new_order)
                        new_list.select('sections', s_index, 'r').push(r.get())
                })
            }
            this.list = new_list
            this.forceUpdate()
        }
    }
    _onSelectObject(s_index, r_index, type){
        var get_object = this.list.select('sections', s_index, 'r', r_index, 'o');
        switch(type) {
            case EFORM_CONST.OBJECT_TYPE.LABEL:
                get_object.push({type: type, name: '', params: {width: '150px', title: 'Label'}})
                break;
            case EFORM_CONST.OBJECT_TYPE.RADIO:
            case EFORM_CONST.OBJECT_TYPE.CHECKBOX:
                get_object.push({type: type, name: '', params: {width: '150px', title: 'Title', value: ''}})
                break;
            case EFORM_CONST.OBJECT_TYPE.DYNAMIC_TABLE:
                get_object.push({type: type, name: '', params: {width: '768px', objects:[]}})
                break;
            case EFORM_CONST.OBJECT_TYPE.DRAW:
                get_object.push({type: type, name: '', params: {width: '250px'}})
                break;    
            default:
                get_object.push({type: type, name: '', params: {width: '150px'}})
        }
        this.forceUpdate()
    }

 


    _onClickObject(s_index, r_index, o_index, o){
        this._clearAllDetail()


        const type = o.get('type')
        switch(type) {
            case EFORM_CONST.OBJECT_TYPE.LABEL:
                this.refs.label.style.display = 'inline-block'
                this.refs.label_width.value = o.select('params').get('width')
                this.refs.label_value.value = o.select('params').get('title')
                this.refs.label_order.value = o_index
                this.refs.label_border.value = o.select('params').get('border') || 'none'
                break;
            case EFORM_CONST.OBJECT_TYPE.RADIO:
            case EFORM_CONST.OBJECT_TYPE.CHECKBOX:    
                this.refs.default.style.display = 'inline-block'
                this.refs.default_title.value = o.select('params').get('title')
                this.refs.default_width.value = o.select('params').get('width')
                this.refs.default_name.value = o.get('name') || ''
                this.refs.default_value.value = o.select('params').get('value')
                this.refs.default_order.value = o_index
                this.refs.default_id.value = o.select('params').get('id') || ''
                this.refs.default_border.value = o.select('params').get('border') || 'none'
                this.refs.default_align.value = o.select('params').get('align') || 'left'
                this.refs.default_disabled.checked = o.select('params').get('disabled') || false
                break;
            case EFORM_CONST.OBJECT_TYPE.DYNAMIC_TABLE:     
                this.refs.dynamic.style.display = 'inline-block'
                this.refs.dynamic_width.value = o.select('params').get('width')
                this.refs.dynamic_name.value = o.get('name') || ''
                this.refs.dynamic_border.value = o.select('params').get('border') || 'none'
                this.refs.dynamic_order.value = o_index
                break;
            default:
                var value =  this.__getDefaultValue(o.get('name'))

                if(value) {
                    this.refs.input_default_value.value = value.v
                } else { 
                    this.refs.input_default_value.value = o.select('params').get('default_value') || ''
                }

                this.refs.input.style.display = 'inline-block'
                this.refs.input_width.value = o.select('params').get('width')
                this.refs.input_name.value = o.get('name') || ''
                this.refs.input_order.value = o_index
                this.refs.input_border.value = o.select('params').get('border') || 'none'
                this.refs.input_align.value = o.select('params').get('align') || 'left'
                this.refs.input_disabled.checked = o.select('params').get('disabled') || false
        }

        this.selected_obj = {s_index: s_index, r_index: r_index, o_index: o_index, o: o}
    }
    _clearAllDetail(){
        this.selected_obj = null
        this.refs.default.style.display = 'none'
        this.refs.chart.style.display = 'none'
        this.refs.label.style.display = 'none'
        this.refs.input.style.display = 'none'
        this.refs.dynamic.style.display = 'none'
    }
    _onSubmitObject(group_type){
        let params = null
        let object = null; // this.list.select('sections', this.selected_obj.s_index, 'r', this.selected_obj.r_index, 'o', this.selected_obj.o_index)
      
        switch(group_type){
            case EFORM_CONST.GROUP_OBJECT.LABEL:
            // case 'label':
                params = {
                    width: this.refs.label_width.value,
                    value: this.refs.label_value.value,
                    border: this.refs.label_border.value
                }
                object = this.list.select('sections', this.selected_obj.s_index, 'r', this.selected_obj.r_index, 'o', this.selected_obj.o_index)
                object.select('params').set('width', params.width)
                object.select('params').set('title', params.value)
                object.select('params').set('border', params.border)
                break
            case EFORM_CONST.GROUP_OBJECT.CHECKBOX:    
            // case 'default':
                params = {
                    width: this.refs.default_width.value,
                    value: this.refs.default_value.value,
                    title: this.refs.default_title.value,
                    name: this.refs.default_name.value,
                    id: this.refs.default_id.value,
                    border: this.refs.default_border.value,
                    align: this.refs.default_align.value,
                    disabled: this.refs.default_disabled.checked
                }
                object = this.list.select('sections', this.selected_obj.s_index, 'r', this.selected_obj.r_index, 'o', this.selected_obj.o_index)
                // console.log(object.serialize())
                object.set('name', params.name)
                object.select('params').set('width', params.width)
                object.select('params').set('value', params.value)
                object.select('params').set('title', params.title)
                object.select('params').set('id', params.id)
                object.select('params').set('border', params.border)
                object.select('params').set('align', params.align)
                object.select('params').set('disabled', params.disabled)
                break
            case EFORM_CONST.GROUP_OBJECT.INPUT:      
            // case 'input':
                params = {
                    width: this.refs.input_width.value,
                    name: this.refs.input_name.value,
                    default_value: this.refs.input_default_value.value,
                    border: this.refs.input_border.value,
                    align: this.refs.input_align.value,
                    disabled: this.refs.input_disabled.checked
                }
                object = this.list.select('sections', this.selected_obj.s_index, 'r', this.selected_obj.r_index, 'o', this.selected_obj.o_index)
                object.set('name', params.name)
                object.select('params').set('width', params.width)
                object.select('params').set('value', params.value)
                object.select('params').set('border', params.border)
                object.select('params').set('align', params.align)
                object.select('params').set('disabled', params.disabled)
                object.select('params').set('default_value', params.default_value)
                break
            case EFORM_CONST.GROUP_OBJECT.DYNAMIC:    
            // case 'dynamic':
                params = {
                    width: this.refs.input_width.value,
                    name: this.refs.input_name.value,
                    border: this.refs.input_border.value,
                    align: this.refs.input_align.value,
                }
        }
        this._clearAllDetail()
        this.forceUpdate()
    }
    _onRemoveObject(){
        this.list.select('sections', this.selected_obj.s_index, 'r', this.selected_obj.r_index, 'o').unset(this.selected_obj.o_index)
        this._clearAllDetail()
        this.forceUpdate()
    }
    _onCloneObject(){
        this.list.select('sections', this.selected_obj.s_index, 'r', this.selected_obj.r_index, 'o').push(this.selected_obj.o.serialize())
        this.forceUpdate()
    }
    _onChangeObjectOrder(type){
        const new_order = this.refs[type+'_order'].value
        const s_index = this.selected_obj.s_index
        const r_index = this.selected_obj.r_index
        const o_index = this.selected_obj.o_index

        const obj_length = this.list.select('sections', s_index, 'r', r_index, 'o').get().length
        if(r_index !== new_order && new_order < obj_length){
            const change_obj = this.list.select('sections', s_index, 'r', r_index, 'o', o_index)
            const old_obj = this.list.select('sections', s_index, 'r', r_index, 'o', new_order)
            let new_list_serialize = this.list.serialize()
            new_list_serialize.sections[s_index].r[r_index].o = []
            let new_list = new Baobab(new_list_serialize)
            if(new_order < o_index){
                this.list.select('sections', s_index, 'r', r_index, 'o').map(function(o, oo_index){
                    if(oo_index < new_order)
                        new_list.select('sections', s_index, 'r', r_index, 'o').push(o.get())
                })
                new_list.select('sections', s_index, 'r', r_index, 'o').push(change_obj.get())
                new_list.select('sections', s_index, 'r', r_index, 'o').push(old_obj.get())
                this.list.select('sections', s_index, 'r', r_index, 'o').map(function(o, oo_index){
                    if(oo_index > new_order && oo_index !== o_index)
                        new_list.select('sections', s_index, 'r', r_index, 'o').push(o.get())
                })
            }else{
                this.list.select('sections', s_index, 'r', r_index, 'o').map(function(o, oo_index){
                    if(oo_index <= new_order)
                        new_list.select('sections', s_index, 'r', r_index, 'o').push(o.get())
                })
                new_list.select('sections', s_index, 'r', r_index, 'o').unset(o_index)
                new_list.select('sections', s_index, 'r', r_index, 'o').push(change_obj.get())
                this.list.select('sections', s_index, 'r', r_index, 'o').map(function(o, oo_index){
                    if(oo_index > new_order)
                        new_list.select('sections', s_index, 'r', r_index, 'o').push(o.get())
                })
            }
            this.list = new_list
            this.forceUpdate()
        }  
    }
   
    __getDefaultValue(name){
        // console.log(this.list.select('defVal').serialize(), name)
        return this.list.select('defVal', {n: name}).serialize()
    }


    _onSave(){
        let res_obj = []
        let newDefVal = []  
        let defVal = this.list.select('defVal').serialize();

        var getIndexDefaultValue = function(name) {
            for(var i=0, len = defVal.length; i < len ; ++i) {
                if(defVal[i].n == name)
                    return i;
            }
            return -1;
        }
        var removeDefaultValue = function(index) {
            return defVal.splice(index, 1);
        }



        const sections = this.list.select('sections')
        sections.map(function(section, s_index){
            section.select('r').map(function(row){
                row.select('o').map(function(object){
                    var obj = object.serialize()
      
                    if(obj.type === EFORM_CONST.OBJECT_TYPE.RADIO || obj.type === EFORM_CONST.OBJECT_TYPE.CHECKBOX){
                        obj.v = obj.params.value
                    } 

                    if(obj.type !== EFORM_CONST.OBJECT_TYPE.LABEL){
                        if(section.get('dynamic') === 'd'){
                            obj.d = {
                                s: section.get('ref'),
                                d: false
                            }
                            res_obj.push(obj)
                        }else
                            res_obj.push(obj)
                    }
                    obj.n = obj.name
                    obj.t = obj.type

                    /** DEFAULT VALUE **/
                    let index = getIndexDefaultValue(obj.n)
                    if(index != -1) {
                        let t = removeDefaultValue(index);
                        // REMOVE OLD ITEM IN defVal
                        if(obj.params.default_value) {
                            newDefVal.push({n: obj.n, v: obj.params.default_value, t: obj.t})
                        } else {
                            newDefVal.push(t)
                        }
                    } else if(obj.params.default_value) {
                        newDefVal.push({n: obj.n, v: obj.params.default_value, t: obj.t})
                    }
                    /** END DEFAULT VALUE **/

                    delete obj.params
                    delete obj.align
                    delete obj.name
                    delete obj.type
                })
            })
        })
        console.log(res_obj)

        var newArray = newDefVal;

        this.list.set('obj', res_obj)
        this.list.set('defVal', newArray)

        Service.EFormTemplateSave({ uid: this.template_uid, content: JSON.stringify(this.list.serialize()), userUID: this.user_uid })
        .then(function(response) {
            alert("Success")
        })
        console.log(JSON.stringify(this.list.serialize()))
    }
    _onClickDynamicObject(type){
        if(type === 'it'){
            
        }
    }
    _onChangeSuggestWidth(group_type){
         console.log('log log', type)
        
       
        console.log(val, EFORM_CONST.DEFAULT_VALUE.SUGGEST_WIDTH[0])
        if(EFORM_CONST.DEFAULT_VALUE.SUGGEST_WIDTH[0] === val) 
            return

        switch(group_type) {
            case EFORM_CONST.GROUP_OBJECT.INPUT:
                 var val = $(this.refs.suggest_input_width).val();
                $(this.refs.input_width).val(val);
                // $(this.refs.s)
                break;
            case EFORM_CONST.GROUP_OBJECT.LABEL:
                 var val = $(this.refs.suggest_label_width).val();
                $(this.refs.label_width).val(val);
                break;
            default:
                var val = $(this.refs.suggest_default_width).val();
                 $(this.refs.default_width).val(val);
        }    
    }

    render(){
        return (
            <div>
                <div className="editor">
                    <ul className="navbar">
                        <li>
                            <a onClick={this._onSave.bind(this)}> <i className="fa fa-save"></i>
                                 Save
                            </a>
                            <a ref="navbar_add_section"> <i className="fa fa-plus"></i>
                                Add Section
                            </a>
                        </li>
                    </ul>
                    <div className="content">
                        {
                            this.list.select('sections').map(function(s, s_index){
                                return (
                                    <Section ref={s.get('ref')}
                                        key={s_index}
                                        index={s_index}
                                        dynamic={s.get('dynamic') || ''}
                                        params={s}
                                        onChangeSectionTitle={this._onChangeSectionTitle.bind(this)}
                                        onChangeSectionPage={this._onChangeSectionPage.bind(this)}
                                        onChangeSectionOrder={this._onChangeSectionOrder.bind(this)}
                                        onRemoveSection={this._onRemoveSection.bind(this)}
                                        onCloneSection={this._onCloneSection.bind(this)}

                                        onAddRow={this._onAddRow.bind(this)}
                                        onSelectObject={this._onSelectObject.bind(this)}
                                        onClickObject={this._onClickObject.bind(this)}
                                        onRemoveRow={this._onRemoveRow.bind(this)}
                                        onCloneRow={this._onCloneRow.bind(this)}
                                        onChangeRowOrder={this._onChangeRowOrder.bind(this)}
                                        onChangeSectionDynamic={this._onChangeSectionDynamic.bind(this)}/>
                                )
                            }, this)
                        }
                    </div>
                </div>
                <div className="detail">

                    <div className="form-detail" ref="dynamic">
                        <b>Width</b><br/>
                        <input type="text" placeholder="Width" ref="dynamic_width"/><br/>
                        <b>Name</b><br/>
                        <input type="text" placeholder="Name" ref="dynamic_name"/><br/>
                        <b>Border</b><br/>
                        <input type="text" placeholder="Border" ref="dynamic_border"/><br/>
                        <b>Order</b><br/>
                        <input type="text" ref="dynamic_order" style={{width: '60%'}}/>
                        <button onClick={this._onChangeObjectOrder.bind(this, 'default')}>Change</button><br/>
                        <br/>
                        <b>Objects</b><br/>
                        <button ref="dynamic_obj_input" onClick={this._onClickDynamicObject.bind(this, 'it')}>Add Input</button>
                        <button ref="dynamic_obj_txt">Add Textarea</button>
                        <button ref="dynamic_obj_remove">Remove</button>
                        <br/>
                        <table>
                        {
                            this.dynamic_obj.map(function(obj){
                                return (
                                    <tr>
                                        <td><textarea ref="dynamic_obj_label">Label</textarea></td>
                                        <td>Input</td>
                                    </tr>
                                )
                            }, this)
                        }
                        </table>
                        <br/>
                        <button onClick={this._onSubmitObject.bind(this, 'dynamic')}>Submit</button>
                        &nbsp;
                        <button style={{background: 'red'}} onClick={this._onRemoveObject.bind(this)}>Remove</button>
                        &nbsp;
                        <button style={{background: 'red'}} onClick={this._onCloneObject.bind(this)}>Clone</button>
                    </div>

                    {/*    RADIO & CHECKBOX   */}
                    <div className="form-detail" ref="default">
                        <b>Title</b><br/>
                        <input type="text" placeholder="Title" ref="default_title"/><br/>
                        <b>Width</b><br/>
                        <input style={{width: '30%'}} type="text" placeholder="Width" ref="default_width"/>
                         Suggest: <select onChange={this._onChangeSuggestWidth.bind(this, EFORM_CONST.GROUP_OBJECT.CHECKBOX)} ref="suggest_default_width">
                            {
                                this.suggest_width.map(function(width){
                                    return <option value={width}>{width}</option>
                                })
                            }
                        </select>
                        <br/>
                        <b>Name</b><br/>
                        <input type="text" placeholder="Name" ref="default_name"/><br/>
                        <b>Id</b><br/>
                        <input type="text" placeholder="Id" ref="default_id"/><br/>
                        <b>Value</b><br/>
                        <input type="text" placeholder="Value" ref="default_value"/><br/>
                        <b>Border</b><br/>
                        <input type="text" placeholder="Border" ref="default_border"/><br/>
                        <b>Align</b><br/>
                        <select ref="default_align">
                            {
                                this.align_arr.map(function(align){
                                    return <option value={align.code}>{align.name}</option>
                                })
                            }
                        </select><br/>
                        <b>Disabled</b><br/>
                        <input type="checkbox" ref="default_disabled"/><br/>
                        <b>Order</b><br/>
                        <input type="text" ref="default_order" style={{width: '60%'}}/>
                        <button onClick={this._onChangeObjectOrder.bind(this, 'default')}>Change</button><br/>
                        <br/>
                        <button onClick={this._onSubmitObject.bind(this, 'default')}>Submit</button>
                        &nbsp;
                        <button style={{background: 'red'}} onClick={this._onRemoveObject.bind(this)}>Remove</button>
                        &nbsp;
                        <button style={{background: 'red'}} onClick={this._onCloneObject.bind(this)}>Clone</button>
                    </div>

                    {/*    INPUT TEXT, NUMBER, DATE , SIGNATURE, DRAWING  */}
                    <div className="form-detail" ref="input">
                        <div>
                            <b>Width</b><br/>
                            <input style={{width: '30%'}} type="text" placeholder="Width" ref="input_width"/> 
                            Suggest: <select onChange={this._onChangeSuggestWidth.bind(this, EFORM_CONST.GROUP_OBJECT.INPUT)} ref="suggest_input_width">
                                {
                                    this.suggest_width.map(function(width){
                                        return <option value={width}>{width}</option>
                                    })
                                }
                            </select>
                        </div>
                        
                        <div>
                            <b>Name</b><br/>
                            <input type="text" placeholder="Name" ref="input_name"/>
                        </div>

                        <b>Default Value</b><br/>
                        <input type="text" placeholder="Default value" ref="input_default_value"/><br/>
                        <b>Border</b><br/>
                        <input type="text" placeholder="Border" ref="input_border"/><br/>
                        <b>Align</b><br/>
                        <select ref="input_align">
                            {
                                this.align_arr.map(function(align){
                                    return <option value={align.code}>{align.name}</option>
                                })
                            }
                        </select><br/>
                        <b>Disabled</b><br/>
                        <input type="checkbox" ref="input_disabled"/><br/>
                        <b>Order</b><br/>
                        <input type="text" ref="input_order" style={{width: '60%'}}/>
                        <button onClick={this._onChangeObjectOrder.bind(this, 'input')}>Change</button><br/>
                        <br/>
                        <button onClick={this._onSubmitObject.bind(this, 'input')}>Submit</button>
                        &nbsp;
                        <button style={{background: 'red'}} onClick={this._onRemoveObject.bind(this)}>Remove</button>
                        &nbsp;
                        <button style={{background: 'red'}} onClick={this._onCloneObject.bind(this)}>Clone</button>
                    </div>


                     {/*    LABEL   */}
                    <div className="form-detail" ref="label">
                        <b>Width</b><br/>
                        <input style={{width: '30%'}} type="text" placeholder="Width" ref="label_width"/>
                           Suggest: <select onChange={this._onChangeSuggestWidth.bind(this, EFORM_CONST.GROUP_OBJECT.LABEL)} ref="suggest_label_width">
                            {
                                this.suggest_width.map(function(width){
                                    return <option value={width}>{width}</option>
                                })
                            }
                        </select><br/>
                        <b>Value</b><br/>
                        <textarea placeholder="Value" ref="label_value" rows="10"/><br/>
                        <b>Border</b><br/>
                        <input type="text" placeholder="Border" ref="label_border"/><br/>
                        <b>Order</b><br/>
                        <input type="text" ref="label_order" style={{width: '60%'}}/>
                        <button onClick={this._onChangeObjectOrder.bind(this, 'label')}>Change</button><br/>
                        <br/>
                        <button onClick={this._onSubmitObject.bind(this, 'label')}>Submit</button>
                        &nbsp;
                        <button style={{background: 'red'}} onClick={this._onRemoveObject.bind(this)}>Remove</button>
                        &nbsp;
                        <button style={{background: 'green'}} onClick={this._onCloneObject.bind(this)}>Clone</button>
                    </div>

                    {/*    CHART   */}
                    <div className="form-detail" ref="chart">
                        <b>Width</b><br/>
                        <input type="text" placeholder="Width"/><br/>
                        <b>Name</b><br/>
                        <input type="text" placeholder="Name"/><br/>
                        <b>Value</b><br/>
                        <input type="text" placeholder="Value"/><br/>
                        <b>Order</b><br/>
                        <input type="text"/><br/>
                        <br/>
                        <button>Submit</button>
                        <button style={{background: 'red'}}>Remove</button>
                    </div>
                </div>
            </div>
        )
    }
}

render(<EFormTemplateDetail/>, document.getElementById('app'))