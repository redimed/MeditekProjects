import React, {Component} from 'react'
import Baobab from 'baobab'
import {render} from 'react-dom'

import Section from '../../partials/client/section'
import MeMath from '../../config/math'

import Service from '../../services/main'

import Helper from '../../config/helper'
import CONSTANTS from '../../config/constants'


const EFORM_CLIENT_CONST = CONSTANTS.EFORM_CLIENT
var EFORM_CONST = CONSTANTS.EFORM



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
        this.current_page = EFORM_CLIENT_CONST.DEFAULT_VALUE.PAGE
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
        let p = MeMath.parseQueryString(window.location.href).page
        this.current_page = (p==undefined) ? EFORM_CLIENT_CONST.DEFAULT_VALUE.PAGE  : parseInt(p)
        this.appointment_uid = MeMath.parseQueryString(window.location.href).appointmentUID
        this.patient_uid = MeMath.parseQueryString(window.location.href).patientUID
        this.user_uid = MeMath.parseQueryString(window.location.href).userUID
        this.template_uid = MeMath.parseQueryString(window.location.href).templateUID
        this.md = new MobileDetect(window.navigator.userAgent)

        Service.EFormTemplateDetail({uid: this.template_uid})
        .then(function(response){
            self.eform_name = response.data.Name
            var TemplateData = JSON.parse(response.data.EFormTemplateData.TemplateData)
            // console.log(TemplateData)
            
            self.list.set('sections', TemplateData.sections)
    
            // GET ALL SECTIONS WILL DISPLAY IN PAGE
            self.list.select('sections').map(function(s, s_index){
                if(parseInt(s.get('page')) === self.current_page)
                    self.page_list.select('sections').push(s.serialize())
            })
            // END
            // GET LARGEST PAGE TO GET LIST6 
            let sections_length = self.list.select('sections').serialize().length
            const pages = self.list.select('sections', sections_length-1).get('page')
            // sections was sorted by page on server
            for(var i = 1; i <= pages; i++)
                self.pages.push({text: 'Page '+i, code: i})
            // END

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
                // console.log('EFORM DATA: ', TemplateData)
                Service.EFormCheckData({templateUID: self.template_uid, appointmentUID: self.appointment_uid})
                .then(function(response){
                    if(response.data){
                        self.is_data = true
                        self.eform_uid = response.data.UID

                        var last_data = JSON.parse(response.data.EFormData.TempData)
                        // MERGE DATA VS. OBJECT DATA
                        last_data.map(function(eo){
                            for(var i = 0; i < TemplateData.obj.length; i++){
                                var doj = TemplateData.obj[i]
                                if(EFORM_CONST.OBJECT_TYPE.RADIO  ===doj.t){
                                    if(eo.v === doj.v){
                                        doj.c = eo.c
                                        break
                                    }
                                }else if(eo.n === doj.n){
                                    doj.v = eo.v
                                    break
                                }
                            }
                        })

                        self.obj_data = TemplateData.obj;
                        console.log(self.obj_data)
                        // END MERGE DATA VS. OBJECT DATA
                        // LOAD DATA
                        self.__loadSavedData();
                        //END LOAD DATA
                    }else{
                        self.obj_data = TemplateData.obj
                    }
                })
            })
        })
    }

    __loadSavedData(){
        console.log('LOAD SAVED DATA')
        this.obj_data.map(function(o){
            if(EFORM_CONST.OBJECT_TYPE.RADIO === o.t)
                $('input[name='+o.n+'][value='+o.v+']').prop('checked', o.c)
            else if(EFORM_CONST.OBJECT_TYPE.SIGN === o.t){
                if(o.v) {
                    Service.EFormDownloadImage(o.v).then(function(response){
                        var objectUrl = response
                        $('#'+o.n+'_image').attr('src', objectUrl);
                    }, function(error){
                        alert("Cannot load image !!!");
                    })
                }
                // if(typeof o.v !== 'undefined' && o.v)
                //     $('#'+o.n+'_image').attr('src', 'data:'+o.v[0]+','+o.v[1])
            }else if(EFORM_CONST.OBJECT_TYPE.DATE === o.t){
                $('#'+o.n).val(o.v)
            }else{
                $('#'+o.n).val(o.v)
            }
        })
    }


    __getSignPromiseArr(arrSign){
        let arrPromise = []
        arrSign.map(function(sign){
            // sign.value starts with 'data:image/png;base64,...'
            var val = sign.value.split(',')[1]
            let blob = Helper.b64toBlob(val, 'image/png');
            /* TEST */
            // var blobUrl = URL.createObjectURL(blob);
            // var img = document.createElement('img');
            // img.src = blobUrl;
            // document.body.appendChild(img);
            /* END TEST */
            let p = Service.EFormUploadSignImage(blob, sign.object);
            arrPromise.push(p)
        })
        return arrPromise
    }

    __saveEFormData(){
        this.is_data ? this.__updateEFormDate() : this.__createEFormData() 
    }

    __createEFormData(){
        console.log('CREATE EFORM DATA');
        let data = {
            templateUID: this.template_uid, 
            appointmentUID: this.appointment_uid, 
            tempData: JSON.stringify(this.obj_data), 
            name: this.eform_name, 
            patientUID: this.patient_uid, userUID: this.user_uid
        }
        Service.EFormCreate(data)
        .then(function(response){
            location.reload();
        })
    }
    __updateEFormDate(){
        console.log('UPDATE EFORM DATA');
        let data = {
            UID: this.eform_uid, 
            content: JSON.stringify(this.obj_data)
        }
        Service.EFormUpdate(data)
        .then(function(response){

            location.reload();
         })
    }

    _onSave(){
        // get all signs to upload 
        let arrSign = []
        const self = this;
        this.obj_data.map(function(o){
            if(EFORM_CONST.OBJECT_TYPE.RADIO === o.t){
                if($('input[type=radio][name='+o.n+']').length){
                    const value = $('input[type=radio][name='+o.n+']:checked').val()
                    if(value === o.v) o.c = true
                    else o.c = false
                }
            }else if(EFORM_CONST.OBJECT_TYPE.SIGN === o.t){
                const changed = $('#'+o.n).data('changed')
                if( CONSTANTS.VALUES.TRUE === changed) {
                    const value = $('#'+o.n).jSignature("getData")
                    arrSign.push({ object: o, value: value });
                }
            }else if(EFORM_CONST.OBJECT_TYPE.DATE === o.t){
                let value = $('#'+o.n).val()
                o.v = value
            }else{
                const value = $('#'+o.n).val()
                o.v = value
            }
        })

        let arrPromise = self.__getSignPromiseArr(arrSign)
        console.log('Arr Promise: ', arrPromise.length)
        if(arrPromise.length > 0) {
            Promise.all(arrPromise).then(
            values => {   
                // console.log('VALUE PROMISE: ', values)
                console.log('PASSED SIGNATURE OK !!!!!'); 
                for(let i =0; i < values.length; ++i) {
                    let value = values[i]
                    if(value.response && value.response.status && value.response.status === 'success') {
                        // set value to object
                        value.meta.v = value.response.fileUID;
                    } else {
                        alert('SIGN WASNT UPLOADED!!!')
                    }
                }
                // console.log('FORM DATA: ', self.obj_data)
                self.__saveEFormData() 
            } , reason => {
                alert('Upload file server is down !!!')
                console.log(reason)
            });
        } else {
            self.__saveEFormData()
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
        // console.log(this.page_list.serialize())
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