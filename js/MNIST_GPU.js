// ******* read MNIST labels & data ******
//
import { MersenneTwister } from "../js/mt.js"

var dr09 = [],drow
function getRandom0_9() {
  var Num,tNum, mt = new MersenneTwister();
  for ( var k=0; k<10; k++ ) {
   do { drow = Math.floor( mt.nextInt(0,10000) ); Num = ldata[drow]; }
   while ( Num != k );
   dr09[k] = drow;      //console.log(dr09)   ---- ok ----------
  }; 
}
//
export function getImgRnd(n) {  // console.log(idata[0],ldata[0])  OK
  var Num,tNum = 0;
  var mt = new MersenneTwister();
  //
   do { tNum = mt.nextInt(0,10000); Num = ldata[tNum]; }
   while ( Num != n );
		for( var x=0; x<28; x++) { 
      		for(var y=0; y<28; y++) {  img[n][x][y] = Math.floor( idata[ tNum ][x*28 + y] );
      		} ; 
		}; 
    //
	return tNum
}
function getImgNo(c,no) {	// c:char no:imagedata No
	for( var x=0; x<28; x++) { 
      		for(var y=0; y<28; y++) {  img[c][x][y] = Math.floor( idata[ no ][x*28 + y] );
      		} ; 
		}; 
}

//---------------- load 0-9 base data ---------------------
export var img = new Array()
function load09(k) {
	img[k] = new Array(); 
 	 for(var i=0; i<28; i++) { img[k][i] = new Array()
      		for(var j=0; j<28; j++) {  img[k][i][j] = Math.floor(idata[ dr09[k] ][j*28 + i]);
      		} ; 
  	 };       //console.log(img)    ---- ok ----------
}	 
	 
//---------------- read bin file ( https://qiita.com/kinmojr/items/4c7a003aa19f8dcf4c4f ) ---------------
export var idata = new Array();			// ***** Image data array *****
export function handleImageFiles(files) { 
  //const reader = new FileReader();
    if (window.FileReader) { getAsBin(files); 
      } else {	alert('FileReader are not supported in this browser.'); }
}   

    function getAsBin(fileToRead) {
      var reader = new FileReader();	 // Read file into memory as UTF-8      
      reader.readAsArrayBuffer(fileToRead);     // Handle errors load
      reader.onload = loadImgHandler;
      //reader.onerror = errorHandler;
    }
    function loadImgHandler(event) {
      var fbin = event.target.result;
      processImgData(fbin);
    }
    function processImgData(bin) { 
       var dataView = new DataView(bin);
       	var number_of_images = dataView.getInt32(4);
	      var row = dataView.getUint32(8);
	      var column = dataView.getUint32(12);
	      var dlen = row*column;
	    for(var i=0; i<number_of_images; i++) {  idata[i] = [];
	      for(var j=0; j<dlen; j++) {  idata[i][j] = dataView.getUint8(16+i*dlen+j);
		      if (idata[i][j]==255) { idata[i][j]=254; } }
	    };    //console.log(idata)   	// -------	ok  -------
      getRandom0_9();
      for( var k=0; k<10; k++) { load09(k);  }; 
    }
      
//---------------- read bin file ( https://qiita.com/kinmojr/items/4c7a003aa19f8dcf4c4f ) ---------------
export var ldata = new Array();				// ***** Label data array *****
export function handleLabelFiles(files) {
    if (window.FileReader) {   getAsText(files);	//getRandom0_9()
      } else {			 alert('FileReader are not supported in this browser.'); }
	//getRandom0_9(); //document.getElementById("btn0").disabled = false;
 }

    function getAsText(fileToRead) { 
      var reader = new FileReader();	 // Read file into memory as UTF-8      
      reader.readAsArrayBuffer(fileToRead);     // Handle errors load
      reader.onload = loadHandler;
      reader.onerror = errorHandler;
    }
    function loadHandler(event) {
      var fbin = event.target.result;
      processData(fbin);
    }
    function processData(bin) {
       var dataView = new DataView(bin);
       	var number_of_labels = dataView.getInt32(4); 
	  for(var i=0; i<number_of_labels; i++) { ldata[i] = dataView.getInt8(8+i); }
	  //console.log(ldata.length);	// -------	ok  -------
    }
    function errorHandler(evt) {
      if(evt.target.error.name == "NotReadableError") { alert("Canno't read file !"); }
    }
/*
var ld=new Array
export var ldata = [];			// ***** Label data array *****
 export function handleLabelFiles(files) { 
  const reader = new FileReader();
   reader.onload = () => {
    const arrayBuffer = reader.result; 
    const dataView  = new Uint8Array(arrayBuffer); // Wrap in a typed array to manipulate
    dataView.slice(8,dataView.length-8);    //console.log(dataView)
    ldata = dataView.slice(8);              console.log(ldata,ld.length)
      //for(var i=0; i<ld.length; i++) {  ldata[i]=ld[i] } //dataView.getInt8(8+i); }
   }
  reader.readAsArrayBuffer(files, "UTF-8");  
  console.log(dataView)
 }
  */