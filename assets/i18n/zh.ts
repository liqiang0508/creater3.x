const win = window as any
 export const languages = {
	"2001":"你好",
	"2002":"中国",
	"2003":"666",
	"2004":"222",
	"2005":"5",
	"2006":"6",
	"2007":"7",
}
if(!win.languages){
	win.languages = {};
}
win.languages.zh= languages;