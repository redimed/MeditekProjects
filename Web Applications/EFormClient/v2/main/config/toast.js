class Alert {
	error(message){
		$.toast({
		    heading: 'Error',
		    text: message,
		    showHideTransition: 'plain',
		    hideAfter: 5000,
		    position: 'top-left',
		    icon: 'error'
		})
	}

	success(message){
		$.toast({
		    heading: 'Success',
		    text: message,
		    showHideTransition: 'plain',
		    hideAfter: 3000, 
		    position: 'top-left',
		    icon: 'success'
		})
	}
	
}

export default new Alert