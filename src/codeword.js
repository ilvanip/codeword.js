'use strict';

//The global codeword object. Represents the namespace for this library.
const CODEWORD={};

/*
Definition of all utility functions.
*/
CODEWORD.utilities={
	/*
	Return a random element from a given array.	
	*/
	randomElement:function(array){return array[Math.floor(Math.random()*array.length)];},
	/*
	A wrapper to get values out of configuration items.
	Return object[key] if it exists.
	If it doesn't, return the default value.
	If the default value is undefined, then the key is a mandatory property of the object.
	*/
	get:function(object,key,default_value)
	{
		if(object[key]===undefined && default_value===undefined)
			throw Error(`Compulsory parameter [${key}] not provided.`);
		return (object[key]===undefined?default_value:object[key]);
	},
	/*
	A rendering candidate is defined as 'a word to render and its font color'.
	Given a language and a theme, this function returns a rendering candidate.
	The word is randomly chosen and the font color is chosen from the theme.
	*/
	renderingCandidate:function(language,theme)
	{
		//Get all the keys of the language. Get a random key from it.
		const rand_key=CODEWORD.utilities.randomElement(Object.keys(language));
		//Get a random keyword from the words defined in that element.
		const keyword=CODEWORD.utilities.randomElement(language[rand_key]);
		//Get the font color to render that word with.
		const font_color=theme[rand_key];
		//Return an object containing the required data.
		return {keyword:keyword,color:font_color};
	},
};

/*
All language definitions.
*/
CODEWORD.languageSpec=function(language_name)
{
	//C
	const C={
		//Preprocessor directives.
		preprocessor:'include define pragma ifdef'.split(' '),
		keyword:'break continue return switch case if else for do while goto default typedef struct'.split(' '),
		//Primitive types.
		type:'char int void float double long unsigned signed'.split(' '),
		storage_class:'const extern static inline'.split(' '),
	};
	const Java={
		//Primitive types.
		type:'boolean byte char double float int long short void'.split(' '),
		keyword:[
			'break','continue','return',
			'switch','case','default',
			'if','else',
			'for','do','while',
			'try','catch','finally',
			'new','super','this'],
		//Null value and boolean literals.
		special_constants:'true false null'.split(' '),
		//Scope declarations.
		storage_class:[
			'class','interface',
			'extends','implements',
			'private','protected','public',
			'final',
			'static','abstract',
			'synchronized',
			'throws'],
	};
	const Python3={
		//Preprocessor directives.
		preprocessor:'import as from'.split(' '),
		keyword:[
			'and','or','not','in',
			'break','continue','return',
			'if','elif','else',
			'for','while',
			'global',
			'try','except','finally','raise',
			'pass','yield','lambda',
			'class','type',
			'def','del'],
		special_constants:'True False None NotImplemented'.split(' '),
	};
	switch(language_name)
	{
		case 'C':return C;
		case 'Java':return Java;
		case 'Python3':return Python3;
		default:throw Error(`Undefined language spec [${spec_name}]`);
	}
};

/*
All theme definitions.
*/
CODEWORD.themes={
	//The cobalt theme by Will Farrington.
	Cobalt:function(language)
	{
		/*
		Colors:
		*/
		
		const dark_blue='#00213f';
		const bright_orange='#ff9d00';
		const teal_blue='#80ffbb';
		const light_grey='#cccccc';
		const nail_polish_pink='#ff0044';

		//Global styles.
		const global={
			//The background color.
			background:dark_blue,
			//Keywords
			keyword:bright_orange,
			//Types
			type:teal_blue,
			//Storage classes
			storage_class:teal_blue,
			//Special characters/functions etc.
			special_char:light_grey,
			//Special constants.
			special_constants:nail_polish_pink,
			//Preprocessor.
			preprocessor:light_grey,
		};

		/*
		Language-specific overrides
		*/

		//C
		const C={
			//Preprocessor.
			preprocessor:teal_blue,
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
	},
};

/*
This is the main part, containing the animation to run.
The class CODEWORD.Codeword must be instantiated with the configuration object.
Then the 'animate' method must be called on it to begin the animation.
*/
CODEWORD.Codeword=function(canvas,configuration)
{
	const __canvas=canvas;
	const __context=__canvas.getContext('2d');
	const __font_size=CODEWORD.utilities.get(configuration,'font_size',10);
	const __font_style=CODEWORD.utilities.get(configuration,'font_style','');
	//Set the font style.
//TODO
//Doesn't work in my browser.
//Wonder why??
	__context.font=`${__font_size}px ${__font_style}`;

	//The language to use:
	//Get the name from the configuration. Use that to get the language object.
	const __language_name=CODEWORD.utilities.get(configuration,'language',undefined);
	const __language=CODEWORD.languageSpec(__language_name);

	//The theme to use while rendering:
	//Get the name from the configuration. Use that to get the theme object.
	const __theme_name=CODEWORD.utilities.get(configuration,'theme',undefined);
	const __theme=__theme_name(__language_name);

	//Rendering time interval.
	const __interval=CODEWORD.utilities.get(configuration,'interval',40);

	//Coordinates to render from.
	let __basex;
	let __basey;

	//The id for the animation.
	let __animation_id=undefined;

	//Flag to describe animation state.
	let __running=true;

	//Public function to stop the animation.
	this.stop=()=>
	{
		if(__animation_id!==undefined)
			window.cancelAnimationFrame(__animation_id);
		__animation_id=undefined;
		//Change the animation state.
		__running=false;
	};

	//Public function to begin animation.
	this.animate=()=>
	{
		//Change the animation state.
		__running=true;

		//Reset coordinates for rendering.
		__basex=1;
		__basey=__font_size;

		//Hard limits for the coordinates.
		const max_width=__canvas.width;
		const max_height=__canvas.height;

		//Blanket the canvas with the background.
		__context.fillStyle=__theme.background;
		__context.fillRect(0,0,max_width,max_height);

		//The animation function responsible for the scroll effect.
		const __animate=()=>
		{
			//If the Y-coordinate goes beyond the limit of the canvas, stop rendering and return.
			if(__basey>max_height){this.stop();return;}
			//Get a rendering candidate.
			const info=CODEWORD.utilities.renderingCandidate(__language,__theme);
			//Add a space for visual clarity.
			const keyword=info['keyword']+' ';
			//The actual width of the string measured in pixels according to the canvas.
			const canvas_font_width=__context.measureText(keyword).width;
			//The font color is set.
			__context.fillStyle=info['color'];
			//Render the random keyword.
			__context.fillText(keyword,__basex,__basey);
			//Update the rendering X-coordinate.
			__basex+=canvas_font_width;
			//If the X coordinate goes out of bounds, goto the beginning of the next line.
			if(__basex>max_width){__basex=1;__basey+=__font_size;}
			//Debug.
			console.log("Running");
			//If the state is 'running', then get the next animation frame.
			//To throttle the frame rate to the desired delay, the request is placed
			//	after the specified delay.
			//If __running is false, then the animation stops
			//	as the next animation frame is not requested at all.
			if(__running===true)
				setTimeout(()=>{__animation_id=window.requestAnimationFrame(__animate);},__interval);
		};
		//Begin the animation.
		__animation_id=window.requestAnimationFrame(__animate);
	};
	//Push the current instance into the global array of instances.
	CODEWORD.Codeword.codewords.push(this);
};
//Contains all the objects created.
CODEWORD.Codeword.codewords=[];
//Run initialization functions, set up event handlers, etc.
CODEWORD.init=function()
{
	/*
	Code to handle resize events.
	Resize events are always registered on the window object.
	By default, whenever the window is resized, the animation renders again.
	*/
	const onWindowResize=function(resize_event)
	{
		//Repeat the animation:stop and start.
		const repeat_animation=function(cw){cw.stop();cw.animate();};
		//Do it for all codeword animations.
		CODEWORD.Codeword.codewords.forEach(repeat_animation);
	};
	window.addEventListener('resize',onWindowResize);
}
//Initialize the library.
CODEWORD.init();


