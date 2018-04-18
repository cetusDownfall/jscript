var mz = document.getElementById('maze');
var rstack = new Array(), cstack = new Array(), pathstack = new Array();
var rows,columns,color, ir, ic, r, c, rs, cs, rt, ct;
function genmaze() {
	makemaze();
	walkthrough(floorandint(rows),floorandint(columns));
}
function gensetmaze() {
	rows = Math.floor(document.getElementById('rowNum').value);
	columns = Math.floor(document.getElementById('colNum').value);
	color = document.getElementById('wallColor').value;
	genmaze();
}
function makemaze() {
	mz.innerHTML = '';
	for(var h = 0; h < rows; h++) {
		var currrow=mz.insertRow(h);
		for(var w = 0; w < columns; w++) {
			var ncel=currrow.insertCell(w);
			unvisit(ncel).style.borderColor=color;
			ncel.setAttribute("data-row", h.toString());
			ncel.setAttribute("data-col", w.toString());
		}
	}
}
function walkthrough(sr,sc) {
	ir=sr;
	ic=sc;
	r=ir;
	c=ic;
	visit(r,c);
	addcoords();
	moveto(randomunvisitedneighbor());
	var dly = document.getElementById("delay").value;
	var nc=nextcoords();
	if (dly>0) var j = setInterval((function (){if(nc<2)nc=nextcoords();else clearInterval(j);}), dly);
	else while(nc<2) nc=nextcoords();
}
function nextcoords() {
	var cell=randomunvisitedneighbor();
	while(cell==="a") cell=randomunvisitedneighbor();
	if(cell==="o") return 2
	else {
		moveto(cell); 
		return 1;
	}
}
function randomunvisitedneighbor() {
	var possdirs = new Array();
	if(unvisited(r+1,c)) possdirs.push("s");
	if(unvisited(r-1,c)) possdirs.push("n");
	if(unvisited(r,c+1)) possdirs.push("e");
	if(unvisited(r,c-1)) possdirs.push("w");
	if(possdirs.length>0) return possdirs[floorandint(possdirs.length)];
	else {
		if(r!==ir||c!==ic) {
			lastcoords();
			return "a";
		} else return "o";
	}
}
function moveto(d) {
	addclass(d,getcell(r,c));
	var nextclass = "";
	switch (d) {
		case "n": {r-=1; nextclass="s"; break;}
		case "e": {c+=1; nextclass="w"; break;}
		case "s": {r+=1; nextclass="n"; break;}
		case "w": {c-=1; nextclass="e"; break;}
	}
	addclass(nextclass,getcell(r,c));
	visit(r,c);
	addcoords();
}
function addcoords() {
	if((r!==rstack[rstack.length-1])||(c!==cstack[cstack.length-1])) {rstack.push(r);cstack.push(c)}
}
function lastcoords() {
	if(r===rstack[rstack.length-1]&&c===cstack[cstack.length-1]) {rstack.pop();cstack.pop();}
	r=rstack[rstack.length-1];
	c=cstack[cstack.length-1];
}
function floorandint(big) { return Math.floor(Math.random() * big); }
function visited(ra,ca) { 
	return ra<0 || ra>(rows-1) ||
	       ca<0 || ca>(columns-1) ||
	       (ca===ic && ra===ir) ||
	       getcell(ra,ca).dataset.visted === "t"; 
}
function unvisited(ra,ca) { 
	return ra>=0 && ra<rows &&
		ca>=0 && ca<columns &&
		(ca!==ic || ra!==ir) && getcell(ra,ca).dataset.visited === "f"; 
}
function solvemaze() {
	if(mz.innerHTML==="") gensetmaze();
	rstack = [];
	cstack = [];
	solve(0,0,rows-1,columns-1);
}
function solve(ra,ca,rb,cb) {
	document.querySelectorAll("[data-visited=t]").forEach(function(e) {e.setAttribute("data-visited", "u");});
	ir=ra; ic=ca; r=ra; c=ca; rt=rb; ct=cb;
	setpath(ra,ca);
	addcoords();
	movesolve(solveneighbor(name(r,c)));
	var dly = document.getElementById("delay").value;
	var fint=stepsolve();
	if (dly>0){var j=setInterval((function(){if(fint<1)fint=stepsolve();else clearInterval(j);}),dly);}
	else while(fint<1) fint=stepsolve(name(r,c));
	for(var h = 0; h < rows; h++) 
		for(var w = 0; w < columns; w++) getcell(h,w).setAttribute("data-visited", "t");
	while(rstack.length>0&&cstack.length>0) setpath(rstack.pop(),cstack.pop());
	setpath(rb,cb);
}
function stepsolve() {
	if(r>=0&&r<rows&&c>=0&&c<columns) {
		let d = solveneighbor(name(r,c));
		while (d==="a"&&saferc(r,c)) d = solveneighbor(name(r,c));
		if(d==="o") return 1;
		else {
			movesolve(d);
			return 0;
		}
	} else return 1;
}
function solveneighbor(n) {
	var d = "a";
	if(n.includes("n")&&unsolved(r-1,c)) d="n";
	else if(n.includes("e")&&unsolved(r,c+1)) d="e";
	else if(n.includes("s")&&unsolved(r+1,c)) d="s";
	else if(n.includes("w")&&unsolved(r,c-1)) d="w";
	if(d!=="a") return d;
	if(r===rt&&c===ct) return "o";
	else 
		if(r!==rt||c!==ct) {
			visit(r,c);
			lastcoords();
			return d;
		} else return "o";
}
function movesolve(d) {
	setpath(r,c);
	switch (d) {
		case "n": r-=1; break;
		case "e": c+=1; break;
		case "s": r+=1; break;
		case "w": c-=1; break;
	}
	setpath(r,c);
	addcoords();
}
function inname(ra,ca,n) { return name(ra,ca).includes(n); }
function unsolved(ra,ca) { return getcell(ra,ca).dataset.visited === "u"; }
function solvefinish(ra,ca) { return ra===rt&&ca===ct; }
function name(ra,ca) { return getcell(ra,ca).className||""; }
function saferc(ra,ca) { return (ra && ca && ra>=0 && ra<rows && ca>=0 && ca<columns); }
function setpath(ra,ca) { getcell(ra,ca).setAttribute("data-visited", "p"); }
function path(ra,ca) { return getcell(ra,ca).className.includes("p"); }
function unsolve(ra,ca) { getcell(ra,ca).setAttribute("data-visited", "u"); }
function visit(ra,ca) { getcell(ra,ca).setAttribute("data-visited", "t"); }
function getcell(ra,ca) { return mz.rows[ra].cells[ca]; }
function unvisit(cell) { cell.setAttribute("data-visited", "f"); return cell; }
function addclass(x,tad) { tad.className += ' ' + x; return tad; }
