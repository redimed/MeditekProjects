import React, {Component} from 'react'
import Baobab from 'baobab'
import {render} from 'react-dom'

import Section from '../../partials/client/section'
import MeMath from '../../config/math'

import Service from '../../services/main'

class EFormDetail extends Component{
    constructor(){
        super()
        this.list = new Baobab({
            sections: []
        })
        this.page_list = new Baobab({
            sections: []
        })
        this.pages = []
        this.current_page = 1
        this.md = null
        this.appointment_uid = ''
        this.patient_uid = ''
        this.template_uid = ''
        this.user_uid = ''
        this.obj_data = []
        this.is_data = false
        this.eform_name = ''
    }
    componentDidMount(){
        const self = this
        this.current_page = parseInt(MeMath.parseQueryString(window.location.href).page)
        this.appointment_uid = MeMath.parseQueryString(window.location.href).appointmentUID
        this.patient_uid = MeMath.parseQueryString(window.location.href).patientUID
        this.user_uid = MeMath.parseQueryString(window.location.href).userUID
        this.template_uid = MeMath.parseQueryString(window.location.href).templateUID
        this.md = new MobileDetect(window.navigator.userAgent)

        Service.EFormTemplateDetail({uid: this.template_uid})
        .then(function(response){
            self.eform_name = response.data.Name
            var TemplateData = JSON.parse(response.data.EFormTemplateData.TemplateData)
            self.list.set('sections', TemplateData.sections)
            self.list.select('sections').map(function(s, s_index){
                if(parseInt(s.get('page')) === self.current_page)
                    self.page_list.select('sections').push(s.serialize())
            })
            let sections_length = self.list.select('sections').serialize().length
            const pages = self.list.select('sections', sections_length-1).get('page')
            for(var i = 1; i <= pages; i++)
                self.pages.push({text: 'Page '+i, code: i})

            self.forceUpdate(function(){
                $(self.refs.page).val(self.current_page)
                $(self.refs.page).on('change', function(event){
                    window.location.href = '/eform/detail?page='+event.target.value
                })
                var body = new Hammer(document.body)
                body.on('tap', function(event){
                    if(self.md.is('iPad') || self.md.is('iPhone'))
                        document.activeElement.blur()
                })
                // DYNAMIC MODULE
                /*var s = ''
                TemplateData.map(function(o){
                    if(typeof o.d !== 'undefined'){
                        if(parseInt(s) !== o.d.s)
                            if(!o.d.d){
                                s = o.d.s
                                if(typeof self.refs[o.d.s] !== 'undefined')
                                    self.refs[o.d.s].hide()
                            }
                    }
                })*/
                // END DYNAMIC MODULE

                Service.EFormCheckData({templateUID: self.template_uid, appointmentUID: self.appointment_uid})
                .then(function(response){
                    if(response.data){
                        self.is_data = true
                        self.obj_data = JSON.parse(response.data.EFormData.TempData)
                        // MERGE DATA VS. OBJECT DATA
                        self.obj_data.map(function(eo){
                            for(var i = 0; i < TemplateData.obj.length; i++){
                                var doj = TemplateData.obj[i]
                                if(doj.t === 'r'){
                                    if(eo.v === doj.v){
                                        doj.c = eo.c
                                        break
                                    }
                                }else{
                                    if(eo.n === doj.n){
                                        doj.v = eo.v
                                        break
                                    }
                                }
                            }
                        })
                        // END MERGE DATA VS. OBJECT DATA
                        // LOAD DATA
                        self.obj_data.map(function(o){
                            if(o.t === 'r')
                                $('input[name='+o.n+'][value='+o.v+']').prop('checked', o.c)
                            else if(o.t === 'si'){
                                if(typeof o.v !== 'undefined' && o.v)
                                    $('#'+o.n+'_image').attr('src', 'data:'+o.v[0]+','+o.v[1])
                            }else if(o.t === 'id'){
                                $('#'+o.n).val(o.v)
                            }else{
                                $('#'+o.n).val(o.v)
                            }
                        })
                        //END LOAD DATA
                    }else{
                        self.obj_data = TemplateData.obj
                    }
                })
            })
        })
    }
    _onSave(){        
        if(this.is_data){
            console.log('is_data')
        }else{
            this.obj_data.map(function(o){
                if(o.t === 'r'){
                    if($('input[type=radio][name='+o.n+']').length){
                        const value = $('input[type=radio][name='+o.n+']:checked').val()
                        if(value === o.v) o.c = true
                        else o.c = false
                    }
                }else if(o.t === 'si'){
                    const value = $('#'+o.n).jSignature("getData", "svgbase64")
                    if(value[1] !== 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMCIgaGVpZ2h0PSIwIj48L3N2Zz4=')
                        o.v = value
                }else if(o.t === 'id'){
                    let value = $('#'+o.n).val()
                    o.v = value
                }else{
                    const value = $('#'+o.n).val()
                    o.v = value
                }
            })
            Service.EFormCreate({templateUID: this.template_uid, appointmentUID: this.appointment_uid, tempData: JSON.stringify(this.obj_data), name: this.eform_name, patientUID: this.patient_uid, userUID: this.user_uid})
            .then(function(response){
                console.log(response)
            })
        }
    }
    _onShowSection(s_params){
        const ref = s_params.get('ref')
        Data.obj.map(function(o){
            if(typeof o.d !== 'undefined' && o.d.s === ref){
                /*if(o.type === 'r'){
                    var val = $('input:radio[name='+o.name+'][value='+o.value+']')
                    console.log(val)
                    $('input:radio[name='+o.name+'][value='+o.value+']').prop('checked', false)
                }else{
                    $('#'+o.name).val('')
                }*/
                o.d.d = true
            }
        })
    }
    _onHideSection(s_params){
        const ref = s_params.get('ref')
        Data.obj.map(function(o){
            if(typeof o.d !== 'undefined' && o.d.s === ref){
                if(o.type === 'r'){
                    $('input:radio[name='+o.name+'][value='+o.value+']').prop('checked', false)
                }else{
                    $('#'+o.name).val('')
                }
                o.d.d = false
            }
        })
    }
    render(){
        return (
            <div className="client">
                <ul className="navbar">
                    <li className="pagination">
                        <a>
                            <select ref="page">
                                {
                                    this.pages.map(function(page){
                                        return <option value={page.code}>{page.text}</option>
                                    }, this)
                                }
                            </select>
                        </a>
                    </li>
                    <li>
                        <a onClick={this._onSave.bind(this)}>
                            Save
                        </a>
                    </li>
                    <li>
                        <a>
                            Print
                        </a>
                    </li>
                    <li>
                        <a>
                            Refresh
                        </a>
                    </li>
                </ul>
                <div className="content">
                    {
                        this.page_list.select('sections').map(function(s, s_index){
                            return (
                                <Section ref={s.get('ref')}
                                    key={s_index}
                                    index={s_index}
                                    dynamic={s.get('dynamic') || ''}
                                    params={s}
                                    onShow={this._onShowSection.bind(this)}
                                    onHide={this._onHideSection.bind(this)}/>
                            )
                        }, this)
                    }
                </div>
                <ul className="navbar" style={{marginTop: '20px'}}>
                    <li>
                        <a onClick={this._onSave.bind(this)}>
                            Save
                        </a>
                    </li>
                    <li>
                        <a>
                            Print
                        </a>
                    </li>
                    <li>
                        <a>
                            Refresh
                        </a>
                    </li>
                </ul>
            </div>
        )
    }
}

render(<EFormDetail/>, document.getElementById('app'))