'use strict';

const CW_THEMES=!undefined;

/*
This file provides a definition for various themes.
*/

const cw_Cobalt=function(language)
{
	//Global styles.
	const global={
		//The background color.
		background:'#00213f',//Dark blue.
		//Keywords
		keyword:'#ff9d00',//Bright Orange.
		//Types
		type:'#80ffbb',//Teal blue.
		//Storage classes
		storage_class:'#80ffbb',//Teal blue.
		//Special characters/functions etc.
		special_char:'#cccccc',//Light grey.
		//Special constants.
		special_constants:'#ff0044',//Nail polish pink.
		//Preprocessor.
		preprocessor:'#cccccc',//Light grey.
	};

	/*
	Language-specific overrides
	*/

	//C
	const C={
		//Preprocessor.
		preprocessor:'#80ffbb',//Teal blue.
	};

	//Store the override rules if any.
	//If no rules are specified, then this remains an empty object.
	let override={};
	//Get the local style rules if any.
	if(language==='C')override=C;
	//Fill out the target theme to be returned.
	const target_theme=Object.assign({},global,override);
	//Return the target theme.
	return target_theme;
};

