var mz = document.getElementById('maze');
var rstack = new Array(), cstack = new Array();
var rows,columns,color, ir, ic, r, c;
function genmaze() {
	makemaze();
	walkthrough(floorandint(rows),floorandint(columns));
}
function gensetmaze() {
	rows = Math.floor(document.getElementById('rowNum').value);
	columns = Math.floor(document.getElementById('colNum').value);
	color = document.getElementById('wallColor').value;
	genmaze(rows,columns,color);
}
function makemaze() {
	mz.innerHTML = '';
	for(var h = 0; h < rows; h++) {
		var currrow=mz.insertRow(h);
		for(var w = 0; w < columns; w++) unvisit(currrow.insertCell(w)).style.borderColor=color;
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
	var nc=nextcoords();
	while(nc<2) {
		console.log('continuing'+nc);
		nc=nextcoords();
	}
	console.log('continuing'+nc);
}
function nextcoords() {
	var cell=randomunvisitedneighbor();
	while(cell==="a") cell=randomunvisitedneighbor();
	if(cell!=="o") moveto(cell);
	if(cell!=="o"&&(r!==ir||c!==ic)) return 1;
	else return 2;
}
function randomunvisitedneighbor() {
	var possdirs = new Array();
	/*
	var neighborsum = 0;
	if((r<(rows-1))&&visited(r+1,c)) neighborsum+=1;
	if((r>0)&&visited(r-1,c)) neighborsum+=1;
	if((c<(columns-1))&&visited(r,c+1)) neighborsum+=1;
	if((c>0)&&visited(r,c-1)) neighborsum+=1;
	*/
	console.log('possdirsinit'+possdirs.length+possdirs);
	if(unvisited(r+1,c)) possdirs.push("s");
	if(unvisited(r-1,c)) possdirs.push("n");
	if(unvisited(r,c+1)) possdirs.push("e");
	if(unvisited(r,c-1)) possdirs.push("w");
	console.log('possdirslength'+possdirs.length+possdirs);
	if(possdirs.length>0) return possdirs[floorandint(possdirs.length)];
	else {
		if(r!==ir||c!==ic) {
			console.log('callreturning');
			lastcoords();
			return "a";
		} else return "o";
	}
}
function moveto(d) {
	addclass(d,getcell(r,c));
	var nextclass = "";
	switch (d) {
		case "n": r-=1; nextclass="s"; break;
		case "e": c+=1; nextclass="w"; break;
		case "s": r+=1; nextclass="n"; break;
		case "w": c-=1; nextclass="e"; break;
	}
	console.log('goingfrom'+d+nextclass);
	addclass(nextclass,getcell(r,c));
	visit(r,c);
	addcoords();
}
function addcoords() {
	console.log('addingcoords'+r+c);
	if(r!==rstack[rstack.length-1]||c!==cstack[cstack.length-1]) {rstack.push(r);cstack.push(c)}
}
function lastcoords() {
	console.log('returningfrom'+r+c);
	if(r===rstack[rstack.length-1]&&c===cstack[cstack.length-1]) {rstack.pop();cstack.pop();}
	r=rstack[rstack.length-1];
	c=cstack[cstack.length-1];
}
function lastrow() { 
	rstack.pop();
	if(rstack[rstack.length-1]) r=rstack[rstack.length-1];
	else r=ir;
	return r;
}
function lastcol() {
	cstack.pop();
	if(cstack[cstack.length-1]) c=cstack[cstack.length-1];
	else c=ic;
	return c;
}
function floorandint(big) { return Math.floor(Math.random() * big); }
function visited(ra,ca) { 
	return ra<0 || ra>rows-1 ||
	       ca<0 || ca>columns-1 ||
	       getcell(ra,ca).dataset.visted === "t"; 
}
function unvisited(ra,ca) { return !visited(ra,ca); }
function visit(ra,ca) { getcell(ra,ca).setAttribute("data-visited", "t"); }
function getcell(ra,ca) { return mz.rows[ra].cells[ca]; }
function unvisit(cell) { cell.setAttribute("data-visited", "f"); return cell; }
function addclass(x,tad) { tad.className += ' ' + x; return tad; }
