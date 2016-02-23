import Config from 'config'

const Services = {
	formCreate(data){
		const p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				url: Config.apiUrl+'eform/create',
				data: data,
				success: resolve
			})	
		})
		return p
	},
	formList(){
		const p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				url: Config.apiUrl+'eform/list',
				success: resolve
			})	
		})
		return p	
	},
	formSave(data){
		const p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eform/save',
				success: resolve
			})	
		})
		return p
	},
	formDetail(data){
		const p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eform/detail',
				success: resolve
			})	
		})
		return p
	}
}

export default Services