
import CONSTANTS from  '../../../config/constants'

class LoadData {

	static isFormula(val) {
		return val.startsWith('=')
	}
	static isFromDB(val) {
		// check val has _  
		return  val.indexOf('*') >= 0 //val.startsWith("_")
	}
	static isRaw (val) {
		return !(LoadData.isFormula(val) || LoadData.isFromDB(val))
	}

	static isFieldFromDB(field) {
		return field.startsWith('*')
	}

	static valueFormula(val){
		switch(val.toLowerCase()) {
			case 'now()':
				return moment().format(CONSTANTS.VALUES.DATE_FORMAT)
			default:
				return ''
		}
	}

	setDBData(data){
		this.db_data =  data;
	}


	valueField(field) {
		// remove _ 
		field = field.substring(1);

		var hasDot = field.indexOf('.')
		if(hasDot < 0)
			return this.db_data[field];

		// extract .
		var pieces = field.split('.')

		var value = this.db_data
		for(let i=0; i < pieces.length; i++) {
			if(value.hasOwnProperty(pieces[i]))
				value = value[pieces[i]]
			else 
				console.log(`ERROR HERE: doesnt exists ${pieces[i]} attributes!` )
		}
		return value
	}


	valueDBData(val) {
		if(	!this.db_data) {
			console.log(' DIDN\'T SET VALUE DB')
		}	

		var hasContenate = val.indexOf('+')
		if(hasContenate < 0){
			// ex: _Patient.Address1 goes here
			return this.valueField(val)
		}

		// BEGIN TO CONTENATE STRING
		// ex: _Patient.FirstName+ +_Patient.LastName goes here
		var params = val.split('+');

		var str = ""
		for(let i=0; i < params.length; i++) {
			let param = params[i].trim()
			let v = ""
			if(LoadData.isFieldFromDB(param)) {
				v = this.valueField(param)
			} else {
				v = param.substr(1, param.length-2) // "Hello world!" -> Hello world!
			}
			str += v
		}
		return str;
	}

	value(val) {
		// val = val.replace(/ /g,'')

		if(LoadData.isRaw(val)) {
			return val
		}

		if(LoadData.isFormula(val)) {
			let val2 = val.substring(1);
			return LoadData.valueFormula(val2);
		}

		
		if(LoadData.isFromDB(val)) {
			return this.valueDBData(val);
		}
		// moment().format('DD/MM/YYYY'); 
	}
	
}

var loadingData = new LoadData
export default loadingData