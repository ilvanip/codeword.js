'use strict';

//Guards to ensure that language.js and theme.js have been included.
try{CW_LANG_SPECS;}catch(re){throw Error('language.js is not included.');}
try{CW_THEMES;}catch(re){throw Error('theme.js is not included.');}

/*
A wrapper to get values out of configuration items.
Return object[key] if it exists.
If it doesn't, return the default value.

If the default value is undefined, then the key is a mandatory property of the object.
*/
const cw_get=function(object,key,default_value)
{
	if(object[key]===undefined && default_value===undefined)
		throw Error(`Compulsory parameter [${key}] not provided.`);
	if(object[key]===undefined)
		return default_value;
	return object[key];
};

/*
Return a random element from a given array.
*/
const cw_randomElement=function(array)
{
	return array[Math.floor(Math.random()*array.length)];
};

/*
A rendering candidate is defined as 'a word to render and its font color'.
Given a language and a theme, this function returns a rendering candidate.
The word is randomly chosen and the font color is chosen from the theme.
*/
const cw_renderingCandidate=function(language,theme)
{
	//Get all the keys of the language. Get a random key from it.
	const rand_key=cw_randomElement(Object.keys(language));
	//Get a random keyword from the words defined in that element.
	const keyword=cw_randomElement(language[rand_key])+' ';
	//Get the font color to render that word with.
	const font_color=theme[rand_key];
	//Return an object containing the required data.
	return {keyword:keyword,color:font_color};
};

/*
This is the cake!!
*/
function cw_Codeword(canvas,configuration)
{
	/*
	Private variables.
	*/

	const __canvas=canvas;
	const __context=__canvas.getContext('2d');
	const __font_size=cw_get(configuration,'font_size',10);
	const __font_style=cw_get(configuration,'font_style','');
	//Set the font style.
//TODO
//Doesn't work in my browser.
//Wonder why??
	__context.font=`${__font_size}px ${__font_style}`;

	//The language to use.
	//Get the name from the configuration.
	//Use that to get the language object.
	const __language_name=cw_get(configuration,'language',undefined);
	const __language=cw_LanguageSpec(__language_name);

	//The theme to use while rendering.
	//Get the name from the configuration.
	//Use that to get the theme object.
	const __theme_name=cw_get(configuration,'theme',undefined);
	const __theme=__theme_name(__language_name);

	//Rendering time interval.
	const __interval=cw_get(configuration,'interval',40);

	//Coordinates to render from.
	let __basex;
	let __basey;

	//The id for the animation.
	let __animation_id=undefined;

	/*
	Class methods begin here.
	*/

	//Public function to stop the animation.
	this.stop=()=>
	{
		if(__animation_id!==undefined)
			clearInterval(__animation_id);
		__animation_id=undefined;
	};

	//Public function to begin animation.
	this.animate=()=>
	{
		//Reset coordinates for rendering.
		__basex=1;
		__basey=__font_size;

		//Set limits for the coordinates.
		const max_width=__canvas.width;
		const max_height=__canvas.height;

		//Blanket the canvas with the background.
		__context.fillStyle=__theme.background;
		__context.fillRect(0,0,max_width,max_height);

		//The animation function.
		const __animate=()=>
		{
			//If the Y-coordinate goes beyond the limit of the canvas, stop rendering and return.
			if(__basey>max_height)
			{
				this.stop();
				return;
			}
			//Get a rendering candidate.
			const info=cw_renderingCandidate(__language,__theme);
			const keyword=info['keyword'];
			//The actual width of the string measured in pixels according to the canvas.
			const canvas_font_width=__context.measureText(keyword).width;
			//The font color is set.
			__context.fillStyle=info['color'];
			//Render the random keyword.
			__context.fillText(keyword,__basex,__basey);
			//Update the rendering X-coordinate.
			__basex+=canvas_font_width;
			//If the X coordinate goes out of bounds, goto the beginning of the next line and return.
			if(__basex>max_width)
			{
				__basex=1;
				__basey+=__font_size;
			}
			//Debug.
//			console.log("Running");
		};
		//Begin the animation with the given interval.
		__animation_id=setInterval(__animate,__interval);
	};
	//Push the current instance into the global array of instances.
	cw_Codeword.trailers.push(this);
};
//Store all the objects made so far.
//This is used for event handlers.
cw_Codeword.trailers=[];

/*
Code to handle resize events.
Resize events are always registered on the window object.
*/
const cw_onwindowresize=(resize_event)=>
{
	const repeat_animation=function(code)
	{
		code.stop();
		code.animate();
	};
	cw_Codeword.trailers.forEach(repeat_animation);
};
window.addEventListener('resize',cw_onwindowresize);

