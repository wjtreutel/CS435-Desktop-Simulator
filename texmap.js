// CS435, Project #5, William Treutel
// A basic desktop emulator


// This code is written for the THREE JS library, which has been included
// Note: Because THREE JS is a library that is built entirely on WebGL, I do not believe its use 
// 	     will be an issue. Please let me know if this is not the case!

"use strict"

var canvas;
var gl;

var projection; // projection matrix uniform shader variable location
var transformation; // projection matrix uniform shader variable location
var vPosition;
var vColor;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var scene, camera, renderer;
var calc, inet, start, taskbar, inetWindow, inetClose, calcWindow, calcClose;
var inetWindows, inetClosers, calcWindows, calcClosers, inetBars, calcBars;
var inetGeo, inetCloseGeo, inetMat, inetCloseMat;
var calcGeo, calcCloseGeo, calcMat, calcCloseMat; 
var inetBarGeo, inetBarMat, calcBarGeo, calcBarMat;
var geometry, material;


var loader = new THREE.FontLoader();
var pivot1,  pivot2,  pivot3;

var inetActive = false, calcActive = false, inetCount = 0, calcCount = 0;

var windowToDrag = null, startMouseX, startMouseY;


function init() {
	scene = new THREE.Scene();
	var WIDTH = window.innerWidth,
		HEIGHT = window.innerHeight;

	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(WIDTH,HEIGHT);
	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 0.1, 20000);
	camera.position.set(0,0,0);
	scene.add(camera);

	window.addEventListener('resize',function() {
		var WIDTH = window.innerWidth,
			HEIGHT = window.innerHeight;
		
		renderer.setSize(WIDTH,HEIGHT);
		camera.aspect = WIDTH / HEIGHT;
		camera.updateProjectionMatrix();
	});

	var light = new THREE.PointLight(0xffffff);
	light.position.set(-100,200,100);
	scene.add(light);

	document.addEventListener('mousedown', onDocumentMouseDown, false);
	}


function animate() {
	requestAnimationFrame(animate);

	renderer.render(scene, camera);
	}



window.onload = function initialize() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

	init();
	camera.position.z = 10;

	
	geometry = new THREE.BoxGeometry(100, .8, 0.1);
	material = new THREE.MeshBasicMaterial({ color: 0x808080 });
	taskbar = new THREE.Mesh(geometry,material);
	scene.add(taskbar);
	
	taskbar.position.y = -3.16;
	taskbar.position.z = .9;


	geometry = new THREE.BoxGeometry(2, .5, 0.000001);
	material = new THREE.MeshPhongMaterial({transparent:false, map: THREE.ImageUtils.loadTexture('menubutton.png')});
	start = new THREE.Mesh(geometry,material);

	start.position.x = -6.34;
	start.position.y = -3.05;
	start.position.z = 1;


	material = new THREE.MeshPhongMaterial({transparent:false, map: THREE.ImageUtils.loadTexture('inetbutton.png')});
	inet = new THREE.Mesh(geometry,material);
	
	inet.position.x = -4.04;
	inet.position.y = -3.05;
	inet.position.z = 1;


	material = new THREE.MeshPhongMaterial({transparent:false, map: THREE.ImageUtils.loadTexture('calcbutton.png')});
	calc = new THREE.Mesh(geometry,material);

	calc.position.x = -1.80;
	calc.position.y = -3.05;
	calc.position.z = 1;


	geometry = new THREE.BoxGeometry(innerHeight,innerWidth,0.1);
	material = new THREE.MeshPhongMaterial({ transparent:false, map: THREE.ImageUtils.loadTexture('wallpaper.png')});
	var wallpaper = new THREE.Mesh(geometry,material);

	wallpaper.position.z = -40;


	inetWindows = []; inetClosers = []; inetBars = [];
	calcWindows = []; calcClosers = []; calcBars = [];
	

	inetGeo = new THREE.BoxGeometry(6, 4, .1);
	inetMat = new THREE.MeshPhongMaterial({transparent: false, map: THREE.ImageUtils.loadTexture('inetimage.png')});

	
	inetCloseGeo = new THREE.BoxGeometry(.2, .2, .1);
	inetCloseMat = new THREE.MeshBasicMaterial({ opacity: 0, transparent: true });
	
	calcGeo = new THREE.BoxGeometry(6, 4, .1);
	calcMat = new THREE.MeshPhongMaterial({transparent: true, map: THREE.ImageUtils.loadTexture('calcimage.png')});

	calcCloseGeo = new THREE.BoxGeometry(.35, .35, .1);
	calcCloseMat = new THREE.MeshBasicMaterial({ opacity: 0, transparent: true, color: 0xff0000 });

	inetBarGeo = new THREE.BoxGeometry(6,.2,.0000000001);
	inetBarMat = calcCloseMat;

	calcBarGeo = new THREE.BoxGeometry(6,.35,.1);
	calcBarMat = inetBarMat;

	

	scene.add(wallpaper);
	scene.add(start);
	scene.add(inet);
	scene.add(calc);
	animate();
}


document.addEventListener('mousemove',onMouseMove,false);
function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight) * 2 + 1;
	}


function onDocumentMouseDown(event) {
	raycaster.setFromCamera( mouse, camera );
	
	var intersects = raycaster.intersectObjects( scene.children );
	var j;

	startMouseX = mouse.x;
	startMouseY = mouse.y;
	
	for ( var i = 0; i < 1; i++) {
		if (intersects[i].object == inet) {
			inetWindows.push(new THREE.Mesh(inetGeo,inetMat));
			inetClosers.push(new THREE.Mesh(inetCloseGeo,inetCloseMat));
			inetBars.push(new THREE.Mesh(inetBarGeo, inetBarMat));

			inetWindows[inetCount].position.x = (inetCount % 11) - 5;
			inetWindows[inetCount].position.y = 1;
			inetWindows[inetCount].position.z = .02;

			inetClosers[inetCount].buddy = inetWindows[inetCount];
			inetClosers[inetCount].buddy2 = inetBars[inetCount];
			inetClosers[inetCount].position.y = 2.72;
			inetClosers[inetCount].position.z = .021;
			inetClosers[inetCount].position.x = (inetCount % 11) - 2.0;

			inetBars[inetCount].position.x = (inetCount % 11) - 4.9;
			inetBars[inetCount].position.y = 2.85;
			inetBars[inetCount].position.z = 0.2;


			scene.add(inetWindows[inetCount]);
			scene.add(inetClosers[inetCount]);
			scene.add(inetBars[inetCount]);
			inetCount++;
			}	

		// Close Button
		else if (inetClosers.indexOf(intersects[i].object) > -1) {
			j = inetClosers.indexOf(intersects[i].object);
				scene.remove(inetClosers[j].buddy);
				scene.remove(inetClosers[j].buddy2);
				scene.remove(inetClosers[j]);
		}

		// Bring to Forefront
		else if (inetBars.indexOf(intersects[i].object) >= 0) {
			for (j = 0; j < inetWindows.length; j++) {
				inetWindows[j].position.z = -.01;
				inetBars[j].position.z = .1;
				inetClosers[j].position.z = .0;
				}
			inetWindows[inetBars.indexOf(intersects[i].object)].position.z = .2;
			inetBars[inetBars.indexOf(intersects[i].object)].position.z = .28;
			inetClosers[inetBars.indexOf(intersects[i].object)].position.z = .3;

			windowToDrag = inetClosers[inetBars.indexOf(intersects[i].object)];
			}


		// CALCULATOR STUFF
		else if (intersects[i].object == calc) {
			calcWindows.push(new THREE.Mesh(calcGeo,calcMat));
			calcClosers.push(new THREE.Mesh(calcCloseGeo,calcCloseMat));
			calcBars.push(new THREE.Mesh(calcBarGeo,calcBarMat));
			
			calcClosers[calcCount].buddy = calcWindows[calcCount];
			calcClosers[calcCount].buddy2 = calcBars[calcCount];
			calcClosers[calcCount].position.x = 2.8;
			calcClosers[calcCount].position.y = 1.66;
			calcClosers[calcCount].position.z = .11;
			calcClosers[calcCount].position.x = (calcCount % 11) - 2.1;

			calcWindows[calcCount].position.z = .09;
			calcWindows[calcCount].position.x = (calcCount % 11) - 5;

			calcBars[calcCount].position.x = (calcCount % 11) - 4.93;
			calcBars[calcCount].position.y = 1.8;
			calcBars[calcCount].position.z = 0.1;

			scene.add(calcWindows[calcCount]);
			scene.add(calcClosers[calcCount]);
			scene.add(calcBars[calcCount]);
			calcCount++;
			}	

		else if (calcClosers.indexOf(intersects[i].object) >= 0) {
			j = calcClosers.indexOf(intersects[i].object);
				scene.remove(calcClosers[j].buddy);
				scene.remove(calcClosers[j].buddy2);
				scene.remove(calcClosers[j]);
		}

		else if (calcBars.indexOf(intersects[i].object) >= 0) {
			for (j = 0; j < calcWindows.length; j++) {
				calcWindows[j].position.z = -.01;
				calcBars[j].position.z = .1;
				calcClosers[j].position.z = .0;
				}
			calcWindows[calcBars.indexOf(intersects[i].object)].position.z = .2;
			calcBars[calcBars.indexOf(intersects[i].object)].position.z = .28;
			calcClosers[calcBars.indexOf(intersects[i].object)].position.z = .3;

			windowToDrag = calcClosers[calcBars.indexOf(intersects[i].object)];
			}

		else if (intersects[i].object == start) window.alert("The start button is just for decoration."); 
	}

	renderer.render( scene, camera );
	}

document.addEventListener('mouseup',onMouseUp,false);
function onMouseUp( event ) {

	var diffMouseX =  mouse.x - startMouseX, diffMouseY = mouse.y - startMouseY;
	

	if (windowToDrag != null) {
		windowToDrag.position.x = windowToDrag.position.x + diffMouseX;
		windowToDrag.position.y = windowToDrag.position.y + diffMouseY;
		windowToDrag.buddy.position.x = windowToDrag.buddy.position.x + diffMouseX;
		windowToDrag.buddy.position.y = windowToDrag.buddy.position.y + diffMouseY;
		windowToDrag.buddy2.position.x = windowToDrag.buddy2.position.x + diffMouseX;
		windowToDrag.buddy2.position.y = windowToDrag.buddy2.position.y + diffMouseY;
		}

	windowToDrag = null;
	}
