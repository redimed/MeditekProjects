import React, {Component} from 'react'
import {render} from 'react-dom'
import Service from '../../services/main'
import IP from '../../config/ip'
import Helper from '../../config/helper'

class EFormTemplateList extends Component{
	constructor(){
        super()
        this.listTemplate = []
   	}

   	componentDidMount(){
   		var self = this;
   		Service.EFormTemplateList().then(function (response) {
   			self.listTemplate = response.data
   			console.log(response)
   			 self.forceUpdate()
   		})
   	}

   	link2template(item){
   		return IP.Host + '/eformtemplate/detail?templateUID=' + item.UID
   	}
   	link2eform(item) {

   		var appt_uid = 'b7b9fd84-8c8e-423d-836e-b7a2e14e415f'
   	  var user_uid = '96ac29c9-5de1-11e6-ae53-0242ac130003'
   		var patient_uid = '4eb681ec-15cf-4382-95f8-499d100732d4'
      return Helper.linkEForm( 1 , item.UID , appt_uid, patient_uid, user_uid)
   		// return IP.Host + '/eform/detail?templateUID=' + item.UID + '&appointmentUID=' + appt_uid 
   	}

   	render(){
   		var self = this;
        return (<div>
        	<h1>Eform Template List</h1>
        	<div>
        		<table>
        			<thead>
	        			<tr>
	        				<th>No</th>
	        				<th>UID</th>
	        				<th>Name</th>
	        				<th>Created by</th>
	        				<th>To Eform Template</th>
	        				<th>To Eform</th>
	        			</tr>
        			</thead>
        			<tbody>
    				{
                        this.listTemplate.map(function(template, index){
                            return (
                                <tr>
                                    <td>{index+1}</td>
                                	<td>{template.UID}</td>
                                	<td>{template.Name}</td>
                                	<td>{(template.UserAccount) ? template.UserAccount.UserName : ''}</td>
                                	<td><a target="_blank" href={self.link2template(template)}>Pokemon Go!</a></td>
                                	<td><a target="_blank" href={self.link2eform(template)}> Go!</a></td>
                                </tr>
                            )
                        }, this)
                    }
                    </tbody>
        		</table>
        	</div>
        </div>)
    }
}


render(<EFormTemplateList/>, document.getElementById('app'))