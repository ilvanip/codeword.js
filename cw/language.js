'use strict';

const CW_LANG_SPECS=!undefined;

const cw_LanguageSpec=function(spec_name)
{
	switch(spec_name)
	{
		case 'C':return {
				preprocessor:'include define pragma ifdef'.split(' '),
				keyword:'break continue return switch case if else for do while goto default typedef struct'.split(' '),
				type:'char int void float double long unsigned signed'.split(' '),
				storage_class:'const extern static inline'.split(' '),
			}
		case 'Java':return {
				//Primitive types.
				type:'boolean byte char double float int long short void'.split(' '),
				//Keywords.
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
					'static',
					'abstract',
					'synchronized',
					'throws'],
			}
		case 'Python3':return {
				preprocessor:'import as from'.split(' '),
				keyword:[
					'and','or','not',
					'in',
					'break','continue','return',
					'if','elif','else',
					'for','while',
					'global',
					'try','except','finally','raise',
					'pass',
					'yield',
					'lambda',
					'class','type',
					'def','del'],
				special_constants:'True False None NotImplemented'.split(' '),
			}
		default:throw Error(`Undefined language spec [${spec_name}]`);
	}
};















