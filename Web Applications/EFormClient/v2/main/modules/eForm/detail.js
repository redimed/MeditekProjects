import React, {Component} from 'react'
import Baobab from 'baobab'
import {render} from 'react-dom'

import Section from '../../partials/client/section'
import MeMath from '../../config/math'

import Service from '../../services/main'

import Helper from '../../config/helper'
import CONSTANTS from '../../config/constants'

import loadDataHelper from '../../partials/client/helper/loaddatahelper'

import Toast from '../../config/toast'

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
        this.patient_uid = '' // 4 create EFormData
        this.template_uid = '' // load 
        this.user_uid = ''  // 4 create EFormData
        this.obj_data = [] 
        this.is_data = false
        this.eform_name = ''
    }

    _getRequiredData(){
        let p = MeMath.parseQueryString(window.location.href).page
        this.current_page = (p==undefined) ? EFORM_CLIENT_CONST.DEFAULT_VALUE.PAGE  : parseInt(p)
        this.appointment_uid = MeMath.parseQueryString(window.location.href).appointmentUID
        this.user_uid = MeMath.parseQueryString(window.location.href).userUID
        this.template_uid = MeMath.parseQueryString(window.location.href).templateUID
        this.patient_uid = MeMath.parseQueryString(window.location.href).patientUID
        if(!this.template_uid) {
            Toast.error('Missing Template uid')
            return false
        } else if(!this.appointment_uid) {
            Toast.error('Missing Appointment uid')
            return false
        } else if(!this.user_uid) {
            Toast.error('Missing User uid')
            return false
        } else if (!this.patient_uid) {
            Toast.error('Missing Patient UID ')
            return false
        } 
        return true
    }

    _initAutoSave() {
        console.log('STARTING: ACTIVE AUTO SAVE !!!')
        // EFORM_CLIENT_CONST.AUTO_SAVE_INTERVAL_TIME
        var self = this;
        this.autoSaveFunc = setInterval(function(){ 
            // alert("Hello");
            // DISABLED SAVE BUTTON HERE
            $( '.btnSave' ).prop( "disabled", true );
            // CALL SAVE get GET PROMISE
            self._onSave(false, function(){
                 // ENABLED SAVE BUTTON
                $( '.btnSave' ).prop( "disabled", false );
            })
           
        }, EFORM_CLIENT_CONST.AUTO_SAVE_INTERVAL_TIME  );
    }
    

    componentDidMount(){
        if(!this._getRequiredData()) {
            return
        }
        const self = this
        this.md = new MobileDetect(window.navigator.userAgent)

        Service.EFormTemplateDetail({uid: this.template_uid})
        .then(function(response){
            self.eform_name = response.data.Name
            var TemplateData = JSON.parse(response.data.EFormTemplateData.TemplateData)
            self.defVal = TemplateData.defVal; // SET DEFAULT VALUE
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
                    var page = event.target.value
                    window.location.href =  Helper.linkEForm(page,self.template_uid, self.appointment_uid, self.patient_uid, self.user_uid)  //'/eform/detail?page='+event.target.value
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
                                if(EFORM_CONST.OBJECT_TYPE.RADIO  === doj.t || EFORM_CONST.OBJECT_TYPE.CHECKBOX  === doj.t ){
                                    // console.log(eo , doj)
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
                         // console.log(last_data)
                        self.obj_data = TemplateData.obj;
                        self.__loadSavedData(); // synchornize func
                    }else{
                        // console.log('HAS NO DATA')
                        self.obj_data = TemplateData.obj
                    }

                    self._getApptInfo();              
                })
            })
        })
    }

    _getApptInfo(){
        var self = this;
        Service.EFormGetApptInfo(this.appointment_uid, this.user_uid).then(function(response){
            console.log('APPT INFO : ', response)
            loadDataHelper.setDBData(response.data)
            self.__loadDefaultValue()
            self._initAutoSave();  
        })
    }

    __loadDefaultValue() {
        let self = this
        this.defVal.map(function(defValObj){
            let index = _.findIndex(self.obj_data, {n: defValObj.n}) 
            if(index < 0) {
                console.error(`Name ${defValObj.n} is not Exists!`)
                return;
            }
            let tObj = self.obj_data[index]
            if(!tObj.v) { // EMPTY DATA 
                // console.log('LOAD HERE', tObj, defValObj)
                switch(tObj.t) {
                    case EFORM_CONST.OBJECT_TYPE.DATE:
                    case EFORM_CONST.OBJECT_TYPE.TEXT:
                    case EFORM_CONST.OBJECT_TYPE.NUMBER:
                        var value = loadDataHelper.value(defValObj.v)
                        // console.log(value);
                        $('#'+defValObj.n).val(value)
                        tObj.v = value
                        break;
                    case EFORM_CONST.OBJECT_TYPE.SIGN:
                        console.log('SIGNATURE LOAD HERE')
                        break
                }
            }
        })
    }

    __loadSavedData(){
        console.log('LOAD SAVED DATA')
        this.obj_data.map(function(o){
            if(EFORM_CONST.OBJECT_TYPE.RADIO === o.t || EFORM_CONST.OBJECT_TYPE.CHECKBOX === o.t) {
                if(o.n) { // check object has name or not
                    $('input[name='+o.n+'][value='+o.v+']').attr('checked', o.c)
                }
            }  else if(EFORM_CONST.OBJECT_TYPE.DRAWING === o.t || EFORM_CONST.OBJECT_TYPE.SIGN === o.t){
                if(o.v) {
                    // console.log(o)
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

    __getDrawingPromiseArr(arrDrawing) {
        var p = new Promise( function(resolve, reject) {
            let arrPromise = []
            arrDrawing.map(function(draw){
                var canvas = $('#'+draw.object.n)[0]
                // console.log(canvas)
                if(canvas.toBlob) {
                    canvas.toBlob(function(blob){
                        var p2 = Service.EFormUploadDrawing(blob, draw.object);
                        arrPromise.push(p2)
                        if(arrPromise.length == arrDrawing.length) {
                            resolve(arrPromise)
                        }
                    })
                } else {
                    reject({err: "CANVAS IS NOT IN DOM"})
                }
            })
        });
        return p
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

    __saveEFormData(cbDone){
        this.is_data ? this.__updateEFormData(cbDone) : this.__createEFormData(cbDone) 
    }

    /** FOR CLICK SAVE & AUTO SAVE */
    __createEFormData(cbDone){
        console.log('CREATE EFORM DATA');
        let data = {
            templateUID: this.template_uid, 
            appointmentUID: this.appointment_uid, 
            tempData: JSON.stringify(this.obj_data), 
            name: this.eform_name, 
            patientUID: this.patient_uid, userUID: this.user_uid
        }
        console.log('SUBMIT DATA ', data)
        Service.EFormCreate(data)
        .then(function(response){
            if(cbDone) {
                cbDone() // 
            }
            // location.reload();
        }, function(errr){console.log(errr)})
    }
    __updateEFormData(cbDone){
        console.log('UPDATE EFORM DATA');
        let data = {
            UID: this.eform_uid, 
            content: JSON.stringify(this.obj_data)
        }
        Service.EFormUpdate(data)
        .then(function(response){
            if(cbDone) {
                cbDone() // 
            }
            // location.reload();
         })
    }
    __validateB4Save() {
        for(let i=0; i  < this.obj_data.length; i++) {
            // CHECK RADIO BUTTON MUST BE CHOSEN 1
            var obj = this.obj_data[i]
            if(EFORM_CONST.OBJECT_TYPE.RADIO === obj.t) {
                /// check has in dom
                if($('input[type=radio][name='+obj.n+']').length){
                    let  v = $('input[type=radio][name='+obj.n+']:checked').val()
                    if(!v) { 
                        Toast.error('Radio Button must be choose 1!!!')
                        return false 
                    }
                }
            }
        }
    
        return true;
    }
    _onSave(isClickSave = true, cbDone){
        const self = this;
       if(isClickSave) {
            if(!this.__validateB4Save()) { // ERROR TO PASS
                return
            }
            // STOP AUTOSAVE
            clearInterval(this.autoSaveFunc);

            cbDone = function() {
                Toast.success('Saved!')
                self._initAutoSave()
            }
        }

        
        // get all signs & drawing to upload 
        let arrSign = []
        let arrDrawing = []
        

        // GET DATA FROM DOM 
        this.obj_data.map(function(o){
            let changed;
            switch(o.t) {
                case EFORM_CONST.OBJECT_TYPE.RADIO:
                    if(o.n && $('input[type=radio][name='+o.n+']').length){
                        const value = $('input[type=radio][name='+o.n+']:checked').val()
                        if(value === o.v) o.c = true
                        else o.c = false
                    }
                    break;
                case EFORM_CONST.OBJECT_TYPE.CHECKBOX:          
                    if(o.n && $('input[type=checkbox][name='+o.n+']').length){
                        const value = $('input[name='+o.n+'][value='+  o.v + ']').prop('checked')
                        o.c = value
                        // console.log($('input[type=checkbox][name='+o.n+']:checked').length, value)
                        // if(value === o.v) o.c = true
                        // else o.c = false
                    }
                    break;
                case EFORM_CONST.OBJECT_TYPE.SIGN: 
                    if($('#' + o.n).length) {
                        changed = $('#'+o.n).data('changed')
                        if( CONSTANTS.VALUES.TRUE === changed) {
                            const value = $('#'+o.n).jSignature("getData")
                            arrSign.push({ object: o, value: value });
                        }
                    }
                    break;
                 case EFORM_CONST.OBJECT_TYPE.DRAWING:
                    if($('#' + o.n).length) {
                        changed = $('#'+o.n).data('changed')
                        if( CONSTANTS.VALUES.TRUE === changed) {
                            arrDrawing.push({object: o})
                        }
                    }
                    break;
                case EFORM_CONST.OBJECT_TYPE.DATE:
                default:
                    // CHECK IN DOM
                    if($('#' + o.n).length) {
                        const value = $('#' + o.n).val()
                        o.v = value
                    }
            }
        })

        let isUploadDrawing = false, isUploadSign = false
        if(arrSign.length > 0) {
            let arrPromiseSign = self.__getSignPromiseArr(arrSign)
            Promise.all(arrPromiseSign).then(
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
                isUploadSign = true
                if(isUploadSign && isUploadDrawing) {
                    self.__saveEFormData()
                }
            } , reason => {
                alert('Upload file server is down !!!')
                console.log(reason)
            });
        }  else {
            isUploadSign = true
        } 
        if(arrDrawing.length > 0) {
            self.__getDrawingPromiseArr(arrDrawing).then(function(arrPromiseDrawing){
                Promise.all(arrPromiseDrawing).then(
                values => {   
                    // console.log('VALUE PROMISE: ', values)
                    console.log(values)
                    console.log('PASSED DRAWING OK !!!!!'); 
                    for(let i =0; i < values.length; ++i) {
                        let value = values[i]
                        if(value.response && value.response.status && value.response.status === 'success') {
                            // set value to object
                            value.meta.v = value.response.fileUID;
                        } else {
                            alert('DRAWING WASNT UPLOADED!!!')
                        }
                    }
                    isUploadDrawing = true
                    if(isUploadSign && isUploadDrawing) {
                        self.__saveEFormData()
                    }
                } , reason => {
                    alert('Upload file server is down !!!')
                    console.log(reason)
                });
            }, function(error){
                console.log(error)
            })
        } else {
            isUploadDrawing = true
        }
        
        // let arrPromiseDrawing = self.__getDrawingPromiseArr(arrDrawing)
        if(isUploadSign && isUploadDrawing) {
         
            self.__saveEFormData(cbDone)
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
                    <li><button className="btnSave btn-success" onClick={this._onSave.bind(this, true)}><i className="fa fa-save"></i> Save </button></li>
                    <li><a>Print</a></li>
                    <li><a>Refresh</a></li>
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
                    <li><button className="btnSave btn-success" onClick={this._onSave.bind(this, true)}><i className="fa fa-save"></i> Save </button></li>
                    <li><a>Print</a></li>
                    <li><a>Refresh</a></li>
                </ul>
            </div>
        )
    }
}

render(<EFormDetail/>, document.getElementById('app'))