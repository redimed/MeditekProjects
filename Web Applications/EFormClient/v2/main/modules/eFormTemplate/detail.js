import React, {Component} from 'react'
import Baobab from 'baobab'
import {render} from 'react-dom'

import Section from '../../partials/template/section'
import Helper from '../../config/helper'
import Service from '../../services/main'
import CONSTANTS from '../../config/constants'
const EFORM_CONST = CONSTANTS.EFORM
const MAX_WIDTH = 768
const MAX_SEGMENT = 10
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
        this.suggest_width = [] //EFORM_CONST.DEFAULT_VALUE.SUGGEST_WIDTH
        this.user_uid = ''
        this.template_uid = ''
        this.dynamic_obj = []
        this.dynamic_id = ''

        this.user_uid = Helper.parseQueryString(window.location.href).userUID
        this.template_uid = Helper.parseQueryString(window.location.href).templateUID

        this.detailAreas = [
            {
                area: EFORM_CONST.GROUP_OBJECT.LABEL
            }, 
            {
                area: EFORM_CONST.GROUP_OBJECT.CHECKBOX
            }, 
            {
                area: EFORM_CONST.GROUP_OBJECT.INPUT
            }, 
            {
                area: EFORM_CONST.GROUP_OBJECT.TEXTAREA
            }, 
            {
                area: EFORM_CONST.GROUP_OBJECT.SIGN
            }, 
            {
                area: EFORM_CONST.GROUP_OBJECT.DYNAMIC
            }, 
            {
                area: EFORM_CONST.GROUP_OBJECT.CHART
            },
        ]
    }

    _showDetail(groupName){
        var index = _.findIndex(this.detailAreas, {area: groupName});
        if(index < 0) {
            console.log(`ERROR HERE: doesnt exist Detail area:  ${groupName}`)
        }
        this.refs[this.detailAreas[index].area].style.display = 'inline-block'
    }

    _clearAllDetail(){
        this.selected_obj = null
        for (var i = this.detailAreas.length - 1; i >= 0; --i) {
            this.refs[this.detailAreas[i].area].style.display = 'none'
        }

        // this.refs.default.style.display = 'none'
        // this.refs.chart.style.display = 'none'
        // this.refs.label.style.display = 'none'
        // this.refs.input.style.display = 'none'
        // this.refs.dynamic.style.display = 'none'
        // this.refs.textarea.style.display = 'none'
    }

    __getDefaultValue(name){
        // console.log(this.list.select('defVal').serialize(), name)
        return this.list.select('defVal', {n: name}).serialize()
    }

    _initSuggestWidth(){ 
        var self = this
        var addEventToObject = function(srcObj, targetObj) {
            // if(!srcObj) return
            srcObj.addEventListener('keyup', function(event){
                if(event.keyCode === 13){
                    var v = $(srcObj).val()
                    var value = parseFloat(MAX_WIDTH*v/MAX_SEGMENT ).toFixed(2)+"px"
                    $(targetObj).val(value)
                }
            }, false)
        }
        var arr = [
            {src: this.refs.label_suggest_width, tar: this.refs.label_width},
            {src: this.refs.textarea_suggest_width, tar: this.refs.textarea_width},
            {src: this.refs.input_suggest_width, tar: this.refs.input_width},
            {src: this.refs.default_suggest_width, tar: this.refs.default_width},
            {src: this.refs.sign_suggest_width, tar: this.refs.sign_width},
        ]

        for(let i =0, len = arr.length; i < len; ++i) {
            var obj = arr[i]
            addEventToObject(obj.src, obj.tar);
        }   
    }
    componentDidMount(){
        const self = this
        Service.EFormTemplateDetail({uid: this.template_uid})
        .then(function(response){
            var TempData = JSON.parse(response.data.EFormTemplateData.TemplateData)
            console.log(TempData)
            if(TempData.hasOwnProperty('sections')) {
                 self.list.set('sections', TempData.sections)
            } else {
                 self.list.set('sections', []);
            }
            self._initSuggestWidth()
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
            if(Helper.largerEq(ref_num, res))
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
            if(Helper.largerEq(ref_num, res))
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
            case EFORM_CONST.OBJECT_TYPE.DRAWING:
                get_object.push({type: type, name: '', params: {width: '300px'}})
                break;
            case EFORM_CONST.OBJECT_TYPE.TEXTAREA:
                get_object.push({type: type, name: '', params: {width: '400px'}})
                break;
            case EFORM_CONST.GROUP_OBJECT.SIGN:
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
        const name = o.get('name') || ''
        const params = o.select('params')
        const width = params.get('width')
        const border = params.get('border') || 'none'
        var width2suggest = function(width) {
            return parseFloat(width)/(MAX_WIDTH/MAX_SEGMENT)
        }
        console.log(width, border)

        switch(type) {
            case EFORM_CONST.OBJECT_TYPE.LABEL:
                this._showDetail(EFORM_CONST.GROUP_OBJECT.LABEL)
                // this.refs.label.style.display = 'inline-block'
                this.refs.label_order.value = o_index
                this.refs.label_width.value = width
                this.refs.label_suggest_width.value = width2suggest(width) // parse to suggest
                this.refs.label_border.value = border
                // this.refs.label_width.value = o.select('params').get('width')
                this.refs.label_value.value = params.get('title')
                this.refs.label_align.value = params.get('align') || 'left'
                break;
            case EFORM_CONST.OBJECT_TYPE.RADIO:
            case EFORM_CONST.OBJECT_TYPE.CHECKBOX:    
                this._showDetail(EFORM_CONST.GROUP_OBJECT.CHECKBOX)
                this.refs.default_name.value = name // o.get('name') || ''
                // this.refs.default.style.display = 'inline-block'
                this.refs.default_order.value = o_index
                this.refs.default_width.value = width
                this.refs.default_suggest_width.value = width2suggest(width) // parse to suggest
                this.refs.default_border.value = border

                this.refs.default_title.value = params.get('title')
                this.refs.default_value.value = params.get('value')
                this.refs.default_id.value = params.get('id') || ''
                this.refs.default_align.value = params.get('align') || 'left'
                this.refs.default_disabled.checked = params.get('disabled') || false
                break;
            
            case EFORM_CONST.OBJECT_TYPE.SIGN:
                this._showDetail(EFORM_CONST.GROUP_OBJECT.SIGN)            
                this.refs.sign_name.value  = name // o.get('name') || ''
                // this.refs.sign.style.display = 'inline-block'
                this.refs.sign_order.value = o_index
                this.refs.sign_width.value = width
                this.refs.sign_suggest_width.value = width2suggest(width) 
                // SIGN NO NEED BORDER

                //  ///
                //  add some thing to recognize signature of doctor, patient .... 
                //  /// 
                this.refs.sign_disabled.value = params.get('disabled') || false
                break      

            case EFORM_CONST.OBJECT_TYPE.TEXTAREA:
                this._showDetail(EFORM_CONST.GROUP_OBJECT.TEXTAREA)
                this.refs.textarea_name.value = name// o.get('name') || ''
                // this.refs.textarea.style.display = 'inline-block'
                this.refs.textarea_order.value = o_index
                this.refs.textarea_width.value = width
                this.refs.textarea_suggest_width.value = width2suggest(width) 
                this.refs.textarea_border.value = border
                
                this.refs.textarea_rows.value = params.get('rows') || 2
                break    
            /* WHAT IS IT, MR.VUONG ? =))  */
            case EFORM_CONST.OBJECT_TYPE.DYNAMIC_TABLE:     
                this.refs.dynamic.style.display = 'inline-block'
                this.refs.dynamic_width.value = params.get('width')
                this.refs.dynamic_name.value = o.get('name') || ''
                this.refs.dynamic_border.value = params.get('border') || 'none'
                this.refs.dynamic_order.value = o_index
                break;    
            // TEXT, NUMBER, DATE, DRAW GOES HERE
            default:
                this._showDetail(EFORM_CONST.GROUP_OBJECT.INPUT)
                // this.refs.input.style.display = 'inline-block'
                this.refs.input_order.value = o_index
                this.refs.input_width.value = width
                this.refs.input_suggest_width.value = width2suggest(width)
                this.refs.input_border.value = border

                this.refs.input_name.value =  name //o.get('name') || ''
                this.refs.input_align.value = params.get('align') || 'left'
                this.refs.input_disabled.checked = params.get('disabled') || false

                // JUST GROUP OBJECTS HERE HAVE DEFAULT VALUE
                var value =  this.__getDefaultValue(o.get('name'))
                this.refs.input_default_value.value = (!!value && !!value.v) ? value.v : (params.get('default_value') || '')
        }

        this.selected_obj = {s_index: s_index, r_index: r_index, o_index: o_index, o: o}
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
                    border: this.refs.label_border.value,
                    align: this.refs.label_align.value
                }
                object = this.list.select('sections', this.selected_obj.s_index, 'r', this.selected_obj.r_index, 'o', this.selected_obj.o_index)
                object.select('params').set('width', params.width)
                object.select('params').set('title', params.value)
                object.select('params').set('border', params.border)
                object.select('params').set('align', params.align)                
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
            case EFORM_CONST.GROUP_OBJECT.TEXTAREA:
                params = {
                    name: this.refs.textarea_name.value,
                    rows: this.refs.textarea_rows.value,
                    width: this.refs.textarea_width.value,
                    disabled: this.refs.textarea_disabled.checked,
                }
                object = this.list.select('sections', this.selected_obj.s_index, 'r', this.selected_obj.r_index, 'o', this.selected_obj.o_index)
                object.set('name', params.name)
                object.select('params').set('width', params.width)
                object.select('params').set('rows', params.rows)
                object.select('params').set('disabled', params.disabled)

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


    render(){
        var self = this
        function renderWidth(GroupObject) {
            var refWidth = GroupObject + "_width"
            var refDefWidth = GroupObject + "_suggest_width"
            console.log(refWidth,  refDefWidth)
            return (
                <div className="eform-row">
                    <b>Width</b>:  <input style={{width: '25%'}} type="text" placeholder="Width" ref={refWidth}/>&nbsp;   
                    <b>Segment</b>: <input style={{width: '15%'}} min="0.5" max="10" type="number" step="0.5" ref={refDefWidth} /> &nbsp;
                     Max width : {MAX_WIDTH}px
                </div>
            )
        }

        function renderName(GroupObject) {
            var refName = GroupObject + "_name"
            // console.log(refName)
            return (
                 <div className="eform-row">
                    <b>Name</b><br/>
                    <input type="text" placeholder="Name" ref={refName}/>
                </div>
            )
        }

        function renderOrder(GroupObject) {
            var refName = GroupObject + "_order"
            // console.log(refName)
            return (
                <div className="eform-row">
                    <b>Order</b><br/>
                    <input type="number" step="1" min="0" ref={refName} style={{width: '60%'}}/>
                    <button onClick={self._onChangeObjectOrder.bind(self, GroupObject)}>Change</button><br/>
                </div>
            )
        }

        function renderAlign(GroupObject) {
            var refName = GroupObject + "_align"
            // console.log(refName)
            return (
                <div className="eform-row">
                    <b>Align: </b>
                    <select ref={refName}>
                        {
                            EFORM_CONST.DEFAULT_VALUE.ALIGN_ARR.map(function(align){
                                return <option value={align.code}>{align.name}</option>
                            })
                        }
                    </select>
                </div>
            )
        }

        function renderBorder(GroupObject) {
            var refName = GroupObject + "_border"
            // console.log(refName)
            return (
                <div className="eform-row">
                    <b>Border</b><br/>
                    <input type="text" placeholder="Border" ref={refName}/>
                </div>
            )
        }

        function renderDisabled(GroupObject) {
            var refName = GroupObject + "_disabled"
            // console.log(refName)
            return (
                <div className="eform-row">
                    <b>Disabled</b><br/>
                    <input type="checkbox" ref={refName}/><br/>
                </div>
            )
        }



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
                
                    {/*    RADIO & CHECKBOX   */}
                    <div className="form-detail" ref={EFORM_CONST.GROUP_OBJECT.CHECKBOX}>
                        <div className="eform-row">
                            <b>Title</b><br/>
                            <input type="text" placeholder="Title" ref="default_title"/><br/>
                        </div>
                        {/* WIDTH & DEFAULT WIDTH*/}
                        { renderWidth(EFORM_CONST.GROUP_OBJECT.CHECKBOX)}
                        {/* NAME */}
                        { renderName(EFORM_CONST.GROUP_OBJECT.CHECKBOX)}
                        <div className="eform-row">
                            <b>Id</b><br/> 
                            <input type="text" placeholder="Id" ref="default_id"/>
                        </div>
                        <div className="eform-row">
                            <b>Value</b><br/>
                            <input type="text" placeholder="Value" ref="default_value"/>
                        </div>  
                        {/* BORDER */}
                        {renderBorder(EFORM_CONST.GROUP_OBJECT.CHECKBOX)}
                        {/* ALIGN */}
                        {renderAlign(EFORM_CONST.GROUP_OBJECT.CHECKBOX)}
                        {/* DISABLED */}
                        {renderDisabled(EFORM_CONST.GROUP_OBJECT.CHECKBOX)}
                        {/* ORDER */}
                        {renderOrder(EFORM_CONST.GROUP_OBJECT.CHECKBOX)}

                        <div className="eform-row">
                            <button onClick={this._onSubmitObject.bind(this, EFORM_CONST.GROUP_OBJECT.CHECKBOX)}>Submit</button>&nbsp;
                            <button style={{background: 'red'}} onClick={this._onRemoveObject.bind(this)}>Remove</button>&nbsp;
                            <button style={{background: 'green'}} onClick={this._onCloneObject.bind(this)}>Clone</button>
                        </div>
                    </div>

                    {/*    INPUT TEXT, NUMBER, DATE , DRAWING  */}
                    <div className="form-detail" ref={EFORM_CONST.GROUP_OBJECT.INPUT}>
                        {/* WIDTH & DEFAULT WIDTH*/}
                        { renderWidth(EFORM_CONST.GROUP_OBJECT.INPUT)}
                        {/* NAME */}
                        { renderName(EFORM_CONST.GROUP_OBJECT.INPUT)}

                        <div className="eform-row">
                            <b>Default Value</b><br/>
                            <input type="text" placeholder="Default value" ref="input_default_value"/><br/>
                        </div>    
                        {/* BORDER */}
                        {renderBorder(EFORM_CONST.GROUP_OBJECT.INPUT)}
                        {/* ALIGN */}
                        {renderAlign(EFORM_CONST.GROUP_OBJECT.INPUT)}
                        {/* DISABLED */}
                        {renderDisabled(EFORM_CONST.GROUP_OBJECT.INPUT)}
                        {/* ORDER */}
                        {renderOrder(EFORM_CONST.GROUP_OBJECT.INPUT)}
                        <div className="eform-row">
                            <button onClick={this._onSubmitObject.bind(this, EFORM_CONST.GROUP_OBJECT.INPUT)}>Submit</button>&nbsp;
                            <button style={{background: 'red'}} onClick={this._onRemoveObject.bind(this)}>Remove</button>&nbsp;
                            <button style={{background: 'red'}} onClick={this._onCloneObject.bind(this)}>Clone</button>
                        </div>      
                    </div>

                    {/*  SIGN  */}
                    <div className="form-detail" ref={EFORM_CONST.GROUP_OBJECT.SIGN}>
                        {/* WIDTH & DEFAULT WIDTH*/}
                        { renderWidth(EFORM_CONST.GROUP_OBJECT.SIGN)}
                        {/* NAME */}
                        { renderName(EFORM_CONST.GROUP_OBJECT.SIGN)}
                        <div className={'eform-row'}>
                            <b>Default Value</b><br/>
                            <input type="text" placeholder="Default value" ref="sign_default_value"/><br/>
                        </div>
                        {/* DISABLED */}
                        {renderDisabled(EFORM_CONST.GROUP_OBJECT.SIGN)}
                        {/* ORDER */}
                        {renderOrder(EFORM_CONST.GROUP_OBJECT.SIGN)}

                        <button onClick={this._onSubmitObject.bind(this, EFORM_CONST.GROUP_OBJECT.SIGN)}>Submit</button>
                        &nbsp;
                        <button style={{background: 'red'}} onClick={this._onRemoveObject.bind(this)}>Remove</button>
                        &nbsp;
                        <button style={{background: 'green'}} onClick={this._onCloneObject.bind(this)}>Clone</button>
                    </div>

                    {/*    TEXTAREA  */}
                    <div className="form-detail" ref={EFORM_CONST.GROUP_OBJECT.TEXTAREA}>
                        {/* WIDTH & DEFAULT WIDTH*/}
                        { renderWidth(EFORM_CONST.GROUP_OBJECT.TEXTAREA)}
                        {/* NAME */}
                        { renderName(EFORM_CONST.GROUP_OBJECT.TEXTAREA)}

                        <b>Rows</b><br/>
                        <input type="number" min="2" placeholder="Rows" ref="textarea_rows"/><br/>
 
                        {/* DISABLED */}
                        {renderDisabled(EFORM_CONST.GROUP_OBJECT.TEXTAREA)}
                        {/* ORDER */}
                        {renderOrder(EFORM_CONST.GROUP_OBJECT.TEXTAREA)}

                        <button onClick={this._onSubmitObject.bind(this, EFORM_CONST.GROUP_OBJECT.TEXTAREA)}>Submit</button>
                        &nbsp;
                        <button style={{background: 'red'}} onClick={this._onRemoveObject.bind(this)}>Remove</button>
                        &nbsp;
                        <button style={{background: 'green'}} onClick={this._onCloneObject.bind(this)}>Clone</button>
                    </div>


                    {/*    LABEL   */}
                    <div className="form-detail" ref={EFORM_CONST.GROUP_OBJECT.LABEL}>
                        {/* WIDTH & DEFAULT WIDTH*/}
                        { renderWidth(EFORM_CONST.GROUP_OBJECT.LABEL)}

                        <b>Value</b><br/>
                        <textarea placeholder="Value" ref="label_value" rows="10"/><br/>

                        {/* BORDER */}
                        {renderBorder(EFORM_CONST.GROUP_OBJECT.LABEL)}
                        {/* ALIGN */}
                        {renderAlign(EFORM_CONST.GROUP_OBJECT.LABEL)}
                        {/* ORDER */}
                        {renderOrder(EFORM_CONST.GROUP_OBJECT.LABEL)}

                        <br/>
                        <button onClick={this._onSubmitObject.bind(this, EFORM_CONST.GROUP_OBJECT.LABEL)}>Submit</button>
                        &nbsp;
                        <button style={{background: 'red'}} onClick={this._onRemoveObject.bind(this)}>Remove</button>
                        &nbsp;
                        <button style={{background: 'green'}} onClick={this._onCloneObject.bind(this)}>Clone</button>
                    </div>



                    {/*    CHART   */}
                    <div className="form-detail" ref={EFORM_CONST.GROUP_OBJECT.CHART}>
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
                     {/*    DYNAMIC   */}
                    <div className="form-detail" ref={EFORM_CONST.GROUP_OBJECT.DYNAMIC}>
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
                {/*    END DYNAMIC   */}
                </div>
            </div>
        )
    }
}

render(<EFormTemplateDetail/>, document.getElementById('app'))