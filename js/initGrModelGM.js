////////////////////////////////////////////////////////////////////
// initGrModules
////////////////////////////////////////////////////////////////////

// Init Objects

var LDL=new Array();  // tn=0
  for ( var x=0; x<102; x++ ) { LDL[x]= new Array(102).fill(0)  }; 

import * as THREE from "three/webgpu";
import { WebGPURenderer } from "three/webgpu";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
//import { cell } from "./js/cell.js"

//	----------------------------------------------------------
  const clock = new THREE.Clock();
    // canvasサイズを指定
    const width = 1024;
    const height = 608;
  
    // レンダラーを作成
    const renderer = new WebGPURenderer({
      canvas: document.querySelector("#canvas-frame") });
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0xeeeeee); // 背景色を指定
    renderer.setAnimationLoop(tick);
    // シーンを作成
    var scene = new THREE.Scene();  
    // Light
    const directionalLight = new THREE.DirectionalLight(0xdddddd, 1.0,0);
	     directionalLight.position.set(50, 0, 50);
	    scene.add(directionalLight);
	  const ambientLight = new THREE.AmbientLight(0xffffff);
	    scene.add(ambientLight);       
    // カメラを作成
    const camera = new THREE.PerspectiveCamera(45, width / height);
    camera.position.set(10, 10, 4);
    camera.up.set(0, 0, 1);
        const controls = new OrbitControls(camera, renderer.domElement);
        // 滑らかにカメラコントローラーを制御する
          //controls.enableDamping = true;
          //controls.dampingFactor = 0.1; controls.update();

    //    ---- Axis line & grid ----- 
      let LT = lineTo(0,0,0, 8,0,0, 0xff0000); scene.add( LT ) // axis x
          LT = lineTo(0,0,0, 0,8,0, 0x00ff00); scene.add( LT ) // axis y
          LT = lineTo(0,0,0, 0,0,8, 0x0000ff); scene.add( LT ) // axis z

      //for ( let x=0; x<16; x++ ) {		 mtsph[x] = new Array()	// update mtwA with rc
		    //for ( let y=0; y<16; y++ ) { mtsph[x][y] = sphere(x*16,0,y*16,2,0xffffff) } }	
      
 let acm=0
	function tick(time) {
    //
    if (lnum<llen) {       //llen>0
      acm = acm + clock.getDelta();
      if ( acm>0.0001 ) {       //lnum<llen
        acm=0; cell[window.Gcn].line[lnum].visible=true; lnum++; }
      }
    //
    controls.update();
    renderer.render(scene, camera);
    }
  //renderer.setAnimationLoop(tick);

//	------------ Utils -------------------------------------------

function dot(x,y,z, r, col) {			// *** draw dot : col = HSLcolor ***
  var ptD = [], dotGeometry, dotMaterial, dots;
	ptD.push( new THREE.Vector3( x, y, z) );
	dotGeometry = new THREE.BufferGeometry().setFromPoints( ptD ); //console.log(dotGeometry)
	dotMaterial = new THREE.PointsMaterial( { size:r, sizeAttenuation: false } );
	  dotMaterial.color.setHSL(col, 1.0, 0.3 ); 
	dots = new THREE.Points( dotGeometry, dotMaterial ); //dots.material.visible=false
	scene.add( dots ); 
	return dots
}

window.dotVectors = function( V, r, col,op ) {			// *** draw dot : col = HSLcolor / opacity ***
  var ptD = [], dotGeometry, dotMaterial, dots, hsl;
	ptD.push( new THREE.Vector3( V.x, V.y, V.z ) );
	dotGeometry = new THREE.BufferGeometry().setFromPoints( ptD );
	//dotGeometry = dgm.setFromPoints( ptD );
	dotMaterial = new THREE.PointsMaterial( { size:r, sizeAttenuation: false } );
		//if ( !tr ) { tr = 0.3 }; 				 
		dotMaterial.transparent=true;  
		//dotMaterial.opacity = op;
	  dotMaterial.color.setHSL(col, 1.0, 0.5 );
	dots = new THREE.Points( dotGeometry, dotMaterial );	//dots.visible=false
	scene.add( dots ); 
	return dots
}

function sphere( x,y,z, r, col ) {
  var gm, mat, sph;
    gm = new THREE.SphereGeometry(r, 30, 30);
	mat = new THREE.MeshPhongMaterial( {color: col} ); //mat.color =  col ;	// ({color: 0xffff00});
	sph = new THREE.Mesh(gm, mat);
	  sph.position.x=x; sph.position.y=y; sph.position.z=z; 
	scene.add( sph );
	return sph
}

function sphereVec( S, r, col ) {
  var gm, mat, sph;
    gm = new THREE.SphereGeometry(r, 30, 30);
	mat = new THREE.MeshPhongMaterial( {color: col} ); //mat.color =  col ;	// ({color: 0xffff00});
	sph = new THREE.Mesh(gm, mat);
	  sph.position.x=S.x; sph.position.y=S.y; sph.position.z=S.z; 
	scene.add( sph );
	return sph
}

  //for ( let l=0; l<11; l++ ) { 
	//linemat[l] = new THREE.LineBasicMaterial()	//({ vertexColors: true }); 
	//linemat[l].color.setHSL( l/10, 0.3, 0.5 ) }
  //}
	
function lineTo(sx, sy, sz, ex, ey, ez, col) { 	// *** lineTo : col = HSLcolor or Hex ***
  let gm, pts=[], ln, lm; 
	pts.push( new THREE.Vector3( sx,sy,sz ) )
	pts.push( new THREE.Vector3( ex,ey,ez ) )
	gm = new THREE.BufferGeometry().setFromPoints( pts );
		lm = new THREE.LineBasicMaterial()	
		if ( col>1.0 ) { lm.color.set(col) } else { lm.color.setHSL( col, 1.0, 0.1 ) }
		ln = new THREE.Line( gm, lm );
	scene.add(ln);
  return ln
}

export { lineTo,dot,sphere,sphereVec }
