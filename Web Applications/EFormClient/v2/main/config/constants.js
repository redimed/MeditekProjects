const CONSTANTS = {
    VALUES: {
        TRUE: 'true',
        FALSE: 'false'
    },
    EFORM: {
    	SHORT: {
	    	SECTION_ROW: 'r',
	    	ROW_OBJECT: 'o',
    	},
    	OBJECT_TYPE: {
    		LABEL: 'lb',
    		RADIO: 'r',
    		CHECKBOX: 'c',
    		TEXT: 'it',
    		NUMBER: 'in',
    		DATE: 'id',
    		SIGN: 'si',
    		DYNAMIC_TABLE: 'di',
    	},
        DEFAULT_VALUE: {
            ALIGN_ARR: [
                {code: 'left', name: 'Left'},
                {code: 'center', name: 'Center'},
                {code: 'right', name: 'Right'}
            ],
            SUGGEST_WIDTH: [
                'NONE', '768px', '576px', '384px', '192px'
            ]
        }
    },
    EFORM_CLIENT:{
        DEFAULT_VALUE: {
            PAGE: 1
        }
    }
}

export default CONSTANTS