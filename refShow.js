// v2 Array.forEach();
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
var refShow = {
	getElementsByClass : function(clss) {
		var itemsfound = [];
		var elements = document.getElementsByTagName('*');
		for( var i=0; i < elements.length; i++){
			if(elements[i].className === clss){
				itemsfound.push(elements[i]);
			}
		}
		return itemsfound;
	},
	//
	// http://stackoverflow.com/questions/143847/best-way-to-find-an-item-in-a-javascript-array
	//
	include: function (arr,obj) {
    	return (arr.indexOf(obj) !== -1);
	},
	count : 0,
	incr:function(){
		refShow.count++;
		console.log(refShow.count);
	},
	//
	// Test if JQuery is running. Also works as: if ($) { etc }
	//
	tst$ : function(){
		if (jQuery) { 
			console.log("JQUERY running");
		} else {
			console.log("NOJQUERY");
		}
	},
	frag:document.createDocumentFragment(),
	
	// Why do this and duplicate functionality that jQuery provides?
	// I don't know, I just like it. Doesn't harm anything since it is
	// in the refShow namespace.
	//
	$ : function(id) {				 	
		return document.getElementById(id);
	},

	// to be called from within a loop, not to be used by calling a specific reference	
	onOrOff : function(i) {
		if (!references.reflist[i][2]===0 || references.reflist[i][2]===null || references.reflist[i][2]===1 || references.reflist[i][2]===undefined  ) {
			return true;	
		} else {
			return false;
		}
	},

	// Simply counting the references marked 'off'. returns that number.
	//
	NoOfOff: function(){ 
		var i;var Offs = 0;
		for (i = 0; i<references.reflist.length; i++){
			if (footnote.onOrOff(i) === false){
				Offs++;
			}
		}
		return Offs;
	 },
	 // an array of References that are on, pulled from the master reference list.
	 //
	OnReflist: function(OnList){
		var i; OnList = OnList || [];
			for (i = 0; i<references.reflist.length; i++){
				if (refShow.onOrOff(i) === true){
					OnList.push(references.reflist[i]);
				}
			}
		return OnList;
	 },
	// better off with JQUERY index()?
	//
	// For optimization's sake, what I'd really like is for this function to run once. 
	// Have all other functions that need it to simply to refer to the created array.
	// Because the shortRefs will never change.
	//
	// NB: This function honors whether the reference has been marked ON or OFF (3rd position).
	//
	shortRefs : function (ref){
		var shortRef = shortRef || []; // need to make an array of the short refs
		for ( var k=0; k < references.reflist.length; k++ ){
			if (refShow.onOrOff(k)){
				shortRef.push(references.reflist[k][1]);
			}
		}
		var refPos = shortRef.indexOf( ref );
		return refPos;
	},
	// If you want to dump all the references, on and off, simply make an element with id="allRefs".
	// 
	// NB. This method does not care whether the ref item is "on" (marked 1).
	// The allRefsOL method does care. allRefsOL will skip references set "off" (marked 0).
	//
	allRefs : function (){ 
		if (!refShow.$('allRefs')) {
			return;
		}
		for (var i=0; i < references.reflist.length;i++)	{
			var refdiv=document.createElement("div");
			refdiv.innerHTML=references.reflist[i][0];
			refShow.frag.appendChild(refdiv);
			refShow.$("allRefs").appendChild(refdiv);
		}
	},
	//	
	// allRefsOL is more useful. It will dump all refs in a div with id="allRefsOL"
	// in an ordered list. allRefsOL: "All references in an ordered list".
	//
	// NB. This will skip references marked "off" (zero in the third item).
	//
	// Use this in content_global
	//
	allRefsOL : function (){ 
		if (!refShow.$("allRefsOL")) {
			return;
		}
		var refol=document.createElement("ol");
		
		refShow.$("allRefsOL").appendChild(refol);
		for (var i=0;i<references.reflist.length;i++)	{
			if ( refShow.onOrOff(i) ){
				var refli=document.createElement("li");
				refli.innerHTML=references.reflist[i][0];
				refShow.frag.appendChild(refli);
				refol.appendChild(refli);
			}
			
		}
	},
	//	
	// allRefsAlpha will dump all refs in a div with id="allRefsAlpha"
	// in an alphabetical list. allRefsAlpha: "All references in an alphabetical list".
	//
	// NB. This will skip references marked "off" (zero in the third item).
	//
	// Use this in content_global
	//
	allRefsAlpha : function (){ 
		var refs,refdiv,i,alphaDiv;
		alphaDiv = refShow.$("allRefsAlpha");
		if (!alphaDiv ) {
			return
		}
		refs = refShow.OnReflist();
		refs.Long=[];
		for (i=0; i < refs.length;i++)	{
			refs.Long.push(refs[i][0]);
		}
		// why not: http://www.wrichards.com/blog/2009/02/jquery-sorting-elements/ ???? 
		refs.Long.sort();

		for (i=0; i < refs.Long.length;i++)	{
			refdiv = document.createElement('div');
			refdiv.id='alpharefs'+i;
			refdiv.className='alphaRefs';
			refdiv.innerHTML=refs.Long[i];
			alphaDiv.appendChild(refdiv);
		}
	},
	
	// This is for use in superscripts. It returns the number of the footnote
	// given a "ref" attribute in a superscript.
	//
	// The ref attribute must be the abbreviated version of the footnote. 
	// Use the first few letters of the first author's name when creating the references.reflist object. 
	// 
	// EG:
	// <sup ref="qui"></sup> would render as <sup ref="qui">2</sup> or similar. 
	// 
	// supRef returns an empty value if the reference is marked 'off'.
	//
	supRef: function(){
		var sups = document.getElementsByTagName('sup');
		if (sups.length>0) {
			for (var i=0; i < sups.length; i++){
				if (sups[i].getAttribute("ref")) { // test if there are any "ref" attributes in superscripts 
					var ref = sups[i].getAttribute("ref");
					var shortRef = []; // need to make an array of the short refs
					for (var k=0;k<references.reflist.length;k++){
						if (refShow.onOrOff(k)){
							shortRef.push(references.reflist[k][1]);
						}
					}
					var refPos = shortRef.indexOf(ref);
					if (refPos===-1) {
						$(sups[i]).html('');	
					} else {
						$(sups[i]).html(refPos+1); 
					}
				}
			}
		}
	},
	//
	// Similar to supRefs, but for the entire footnote including position number.
	// eg: <div class="foot" ref="quin"></div>
	footReqs: function(){
		var i;
		var footReq = refShow.getElementsByClass('foot');
		var refs = [];
		for (i=0;i<footReq.length;i++){
			if (footReq[i].getAttribute('ref')){
				refs[i] = footReq[i].getAttribute('ref');
			}
		}
		if (refs.length>0){
		// DOUBLE LOOP
		// executing OnReflist everytime IS BAD
		for (i=0;i<footReq.length;i++){
			for (var a=0;a<refShow.OnReflist().length;a++){
				if (refs[i] === refShow.OnReflist()[a][1]) {
					footReq[i].innerHTML = a+1+". "+refShow.OnReflist()[a][0];
				};
			}
		}
		};
	},

	// For footnotes to be ordered on each page from #1. 
	// This is not a common request, usually footnotes keep the same number throughout
	// the SDLM. This will make the list of footnote on each page start at #1.
	// use like:
	// <div class="foot" alpha-ref="jin"></div>
	feetFromOne: function (){ 
		var i;
		var footReq = refShow.getElementsByClass('foot');
		var refs = new Array;
		if (footReq.length === 0){
			return;
		}
		for (i=0;i<footReq.length;i++){
			if (footReq[i].getAttribute('alpha-ref')){
				refs[i] = footReq[i].getAttribute('alpha-ref');
			};
		};
		for (i=0;i<footReq.length;i++){
			for (var a=0;a<refShow.OnReflist().length;a++){
				if (refs[i] === refShow.OnReflist()[a][1]) {
					footReq[i].innerHTML = i+1+". "+refShow.OnReflist()[a][0];
				};
			}
		}


	},

	init:function(){
		refShow.supRef();
		refShow.allRefsOL();
		refShow.allRefs();
		refShow.footReqs(); 
		refShow.feetFromOne(); 
//		refShow.allRefsAlpha();
	}

}
if (!window.addEventListener) { //http://msdn.microsoft.com/en-us/library/ms536343%28v=vs.85%29.aspx
    window.addEventListener = function (type, listener, useCapture) {
        attachEvent('on' + type, function() { listener(event) });
    }
}
// IE 7 & 8 can't do INDEXOF!!!!
if(!Array.indexOf){
	Array.prototype.indexOf = function(obj){
		for(var i=0; i<this.length; i++){
			if(this[i]==obj){
			return i;
			}
		}
	return -1;
	}
}
//window.addEventListener('load', refShow.init, false);
//$(document).ready(refShow.init);