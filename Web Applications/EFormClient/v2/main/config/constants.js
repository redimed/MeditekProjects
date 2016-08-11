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
            DRAWING: 'dr',
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
        },
        DRAWING: {
            COLORS: [
                {'color': 'blue-ebonyclay'},
                {'color': 'green'},
                {'color': 'blue'},
                {'color': 'red'}
            ],
            SIZES: [
                {'width':550,'height':500,desc:'Canvas 550x500'},
                {'width':750,'height':650,desc:'Canvas 750x650'},
                // {'width':650,'height':650,desc:'Canvas 750x650'},
                {'width':900,'height':750,desc:'Canvas 900x750'},
                {'width':1000,'height':900,desc:'Canvas 1100x900'},
            ],
            FONT_SIZES:[
                {size:12,desc:'Font 12px'},
                {size:15,desc:'Font 15px'},
                {size:20,desc:'Font 20px'},
                {size:25,desc:'Font 25px'},
                {size:30,desc:'Font 30px'},
            ],
            LINE_WIDTHS:[
                 {width:1, desc:'Line 1'},
                {width:2, desc:'Line 2'},
                {width:3, desc:'Line 3'},
                {width:4, desc:'Line 4'},
                {width:5, desc:'Line 5'},
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