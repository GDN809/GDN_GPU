// ----------------- main routine ------  
import * as THREE from "three/webgpu";
import { lineTo,dot,sphere,sphereVec } from './initGrModelGM.js' 

   export class Cell {			// ****** Cell Object ******
    constructor(cellNo) { this.cellNo = cellNo }
    properties
	    cellNo = 0;
	    grp =  new Array( new THREE.Vector3( 0,0,0 ) ); 	// coodinate of grow point
	    grlink = [0];			// prev grk ( Grow point counter )

	    nods = new Array() 	// grk of nodes
	    nodv = new Array()		// nod level
	    nodw = new Array()		// nod level rec mod
	    nodmt = new Array()	// grk connected to MT

		  nod1 = new Array()		// grk of layer1 node
		  nod1m = new Array()		// connected MT_number
		  nod1k = new Array()		// val of node1 index
		  nod1c = new Array()	
		  nod1v = new Array()
		  nod1w = new Array()
	
		  outw = 0

	    ndf = 0;				// node layer flag
	    ndkv = 0;				// layer1 node counter
	    grk = 0; 				// gr counter  ( Grow point counter )
	    dmk = 0;				// nearest mt( MNIST axon Terminal ) number
	    dmcp = new Array();		// grp connected to nearest mt
	    dmck = new Array();		// mt No. connected

	    dmin = 0;				// min distance from mt
	    line = new Array();		// save the line obj
	    thrd = -0.2

    methods
	  getv() {		// *** get vector and grow dendrite ***
		    var v = new THREE.Vector3, vv = new THREE.Vector3
		    var  sv, lv, nextk,  maxv, mx,my, hsl, sphV, lmatC = (this.cellNo)/10;

		    v = this.sumV( this.grp[this.grk] );		// grp[0] is the start point ( soma )
		    if  ( this.dmin > 0.005 ) {			// ---- gp is far from the MT 0.002----
			    v.normalize()
			    if ( this.grp.z< -0.2  ) { v.multiplyScalar(0.2) } else { v.multiplyScalar(0.02) }	//0.02
				  vv.addVectors( this.grp[this.grk],v);	
				  this.line[this.grk] = lineTo( 
					this.grp[this.grk].x, this.grp[this.grk].y,this.grp[this.grk].z, vv.x, vv.y, vv.z, lmatC )
					this.line[this.grk].visible = false				
				  	//line[this.grk].material.transparent = true

					if ( this.ndf == 0 ) { this.grlink[ this.grk ] = this.grk-1 } 	 // set prev grk-1
					if ( this.ndf == 1 ) { this.ndf = 0 }				// if new node, grk-1 is not prev grk
				  this.grk++;		 // next gr counter
				  this.grp[this.grk] = new THREE.Vector3; 
				  this.grp[this.grk] = this.grp[this.grk].addVectors( this.grp[this.grk-1],v ); 
		}
		else { 		// ---- gp is now near the MT ----
			this.line[this.grk] = lineTo(  this.grp[this.grk].x, this.grp[this.grk].y, this.grp[this.grk].z,
				h[this.dmk].x,  h[this.dmk].y, h[this.dmk].z,lmatC ); 	// line to MT
			this.line[this.grk].visible = false	
			this.line[this.grk].material.transparent=true
			mx = Math.floor( this.dmk/16 );  my = ( this.dmk%16 );
					this.nodmt.push( this.grk )			// connected nod to MT					
					//sphereVec( this.grp[this.grk],0.01, mtwA[this.cellNo][mx][my] )	//****** for debug ****
					hsl = 'hsl( 0, 100%,' + Math.floor(100-mtwA[ this.cellNo ][mx][my]*50)+'%)';
					//hsl = 'hsl( 0, 100%,100% )'
					//mtsph[mx][my].material.color=hsl;
					//mtsph[mx][my].material.color.set(hsl)	// = new THREE.Color(hsl)
					  //sphV = sphereVec( this.grp[this.grk-1],0.01, 0xff0000 ); 
					  //this.nodspt.push( sphV );	
			window.mt[this.dmk] = 0;					// update active MT map	
			this.dmck.push( this.dmk ); 			// save the MT No
			this.dmcp[this.dmk] = this.grk;		// this grk points to the MT
			this.grlink[ this.grk ]=this.grk-1	// grlink must back to the last grk
				this.nods.push(this.grk); this.nodv.push(0); this.nodw.push(0)
				
			maxv=0;		// search next gp
			for ( let k=0; k<this.grk; k++ ) {
				sv =this.sumV( this.grp[k] ); 	// sv is sum of distance from MTs 
				lv = sv.lengthSq();				// lv is len of min sv
				if ( lv>maxv ) { maxv = lv; nextk = k };	// min lv is max vec = new node
			};						
			if ( maxv>0 ) { 			// ----- found new node ---- 
				  if ( this.nods.indexOf(nextk) == -1 ) {		// next grk not exist in nodes array -1				  
					this.nods.push(nextk); 	this.nodv.push(0); this.nodw.push(0)
						if ( this.grp[nextk].z< this.thrd ) { 	// this grk is in the nod1 erea
							   //sphV = sphereVec( this.grp[nextk],0.02, 0xffffff )
							   this.nod1.push(nextk); this.ndkv++; 
							   this.nod1k.push(1); this.nod1c.push(0)
							   this.nod1v.push(0); this.nod1w.push(0) 
						}
						//else { sphV = sphereVec( this.grp[nextk],0.01, 0xff0000 ) }
						//this.nodspt.push( sphV )
				  }
				this.grk++; 
				this.grp[this.grk] = this.grp[nextk];		// nextk is new node 
				this.grlink[ this.grk ] = nextk;
				this.ndf=1;		// ndf=1 means this.grk is new node  
			}			
		};	return lnum	//console.log(window.tn,window.mt)
	}					// *** end of getv ***
	
	 sumV( S ) {		// *** returns Vec of min.distance(=maxV) S:grp ***
	   var v = new THREE.Vector3(0,0,0), d, mk, mx,my;
	   var vmax = new THREE.Vector3(0,0,0)
	     this.dmin=1000; mk=0; 	
		for ( let k=0; k<256; k++ ) { mx = Math.floor(k/16);  my = (k%16);
		   if ( window.mt[ k ] == 1 ) { mk++; 
			vmax.subVectors( h[k], S ); 		// vec h[k] - S																					
			d = vmax.lengthSq();	d = d*d/25;  // sum of grad /15
			vmax.divideScalar( d )
			vmax.multiplyScalar( window.mtwA[this.cellNo][mx][my] )
			v.add(vmax);
			if ( d<this.dmin ) { this.dmin = d; this.dmk = k; }
		   }
		}	
		 window.tn = mk	
		//if ( mk==0 ) { window.tn = 0 };	// Acive Mt is none										
	return v;  
	 }			// *** end of sumV ***

	vnods(phs,dsp) {		// *** sets nod color & count nods,nod1 activated : opc:opacity ***
	  let np,gp, mt, mx,my, inp,inp1, mtn, idx,nd1p,hsl;
	  
	    if ( phs==0 ) {   	this.nodv.fill(0); this.nod1v.fill(0); this.nod1k.fill(0) 
			for ( let k=0; k<this.ndkv; k++ ) { this.nod1m[k] = new Array() } }
	    else { 			this.nodw.fill(0); this.nod1c.fill(0) }		// rec mode this.nod1w.fill(0);
		
		  mtn = this.dmck.length
		  for ( let k=0; k<this.dmck.length; k++ ) {
			mt = this.dmck[k]; mx = Math.floor(mt/16);  my = (mt%16);			
			np = this.dmcp[ mt ]; inp = this.nods.indexOf(np);	// grp no. connected to nearest mt

			  if ( phs==0 ) { this.nodv[inp] = this.nodv[inp]+ window.mtwA[this.cellNo][mx][my] }
			  
			  if ( phs==1 && mtw[10][mx][my]>0 ) {	
							this.nodw[inp] = this.nodw[inp]+ mtw[10][mx][my] 
			  }

			do { 
				np = this.grlink[ np ];			// next gr
				inp = this.nods.indexOf(np);		// index of nods grlink
				if ( inp>-1 ) {
					if ( phs==0 ) { 
						this.nodv[inp] = this.nodv[inp]+ mtwA[this.cellNo][mx][my] }
					if ( phs == 1 && mtw[10][mx][my]>0) { 
						this.nodw[inp] = this.nodw[inp]+ mtw[10][mx][my] }
					
				inp1 = this.nod1.indexOf(np) 
				if ( inp1>-1 ){ 
					if ( phs==0 ) { this.nod1k[ inp1 ]++; 	this.nod1m[ inp1 ].push(mt)
								    this.nod1v[ inp1 ] = this.nod1v[ inp1 ]+mtwA[ this.cellNo ][mx][my] 
									}
					if ( phs == 1 ) { 
						if ( mtw[10][mx][my]>0.2 ) {  this.nod1c[ inp1 ]++ }
					}
				np=-1 }	
				}		
			}
			while ( np > 0 )	
//			
		if ( phs==0 ) {
			nd1p = inp1				// now nd1p has nod1 grk
			idx = this.dmcp[ mt ] 	// grp no. connected to nearest mt
				 idx = this.grlink[idx]; this.line[idx+1].material.color.setHSL( nd1p/10,1.0,0.1 )
				 if (dsp==1) { this.line[idx+1].visible = true }
			do { 
				if ( idx>0 ) { 
					if (dsp==1) { this.line[idx].material.color.setHSL( nd1p/10,1.0,0.1 ); 	
									this.line[idx].visible = true }
					idx = this.grlink[idx] }
			}
			while ( idx>0 )
		  }
//
		};
	 }					// *** end of vnods ***
	 	
	getoutw() {		// output of nod1 
	   var imt,mx,my,nx,ny, dm,dmn,dmkk,dmkm,dmx,dmy, fw, hsl  
		this.outw = 0
		for ( let m=0; m<this.nod1v.length; m++ ) { this.nod1w[m]=0 }
		 cux.clearRect( 50,this.cellNo*48,50,50 );
		 
		for ( let k=0; k<256; k++ ) {
			mx = Math.floor(k/16); my = (k%16); fw = 0; 
			hsl = 'hsl( 0, 0%,100% )'								// white
			mtsph[mx][my].material.color.setHSL( 0,0,1.0 )
					for ( let kk=0; kk<this.nod1m.length; kk++ ) {	// array of nod1
						if ( this.nod1m[kk].indexOf(k)>-1 ) { fw=1		// MT active
							if ( mtw[10][mx][my] >0.2 ) {				// red...white 
								this.nod1w[ kk ] = this.nod1w[ kk ] + mtwA[this.cellNo][mx][my]
												 *this.nod1c[kk]/this.nod1k[kk]
									hsl = 'hsl( 0, 100%,' + Math.floor(100-mtwA[this.cellNo][mx][my]*50)+'%)' }
							else { this.nod1w[ kk ] = this.nod1w[ kk ] - mtwA[this.cellNo][mx][my] 
													 //*this.nod1c[kk]/this.nod1k[kk]
									hsl = 'hsl( 0, 0%,80% )'  }		// gray
							//mtsph[this.cellNo][mx][my].material.color.set( hsl )		  
						}
					}
					  if ( fw==0 && mtw[10][mx][my] >0.0 ) { 		// MT not active 
						hsl = 'hsl( 0, 0%,50% )'						// gray
						dmn = 1000; dmkk = -1; dmkm = -1
						for ( let kk=0; kk<this.nod1m.length; kk++ ) {
							for ( let m=0; m<this.nod1m[kk].length; m++ ) {							
								nx=Math.floor(this.nod1m[kk][m]/16); ny=this.nod1m[kk][m]%16
								dm =  (nx-mx)*(nx-mx)+(ny-my)*(ny-my)
								if ( dm<dmn ) { dmn = dm; dmkk=kk; dmx=mx; dmy=my }
							}
						}
						if ( dmn>1.0 ) { 
							this.nod1w[ dmkk ] = this.nod1w[ dmkk ] - mtw[10][mx][my]*dmn 
							hsl = 'hsl( 0, 0%,20% )'			// dark gray
							//mtsph[this.cellNo][mx][my].material.color.set( hsl )}
						}
					 }		
			mtsph[mx][my].material.color.setHSL( 1.0, 1.0, 1-mtw[10][mx][my]/2 )
			cux.fillStyle = hsl; cux.fillRect(my*3+2+48,mx*3+2+this.cellNo*48,3,3)
		}
		for ( let m=0; m<this.nod1v.length; m++ ) { this.outw = this.outw + this.nod1w[m] } 
		this.outw = this.outw/this.dmck.length;	//console.log(cell[this.cellNo])
		return this.outw
	}	
	
}			// ****** End of Cell Object ******

let cell = new Array()
export { cell };
