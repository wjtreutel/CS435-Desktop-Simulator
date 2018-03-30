// CS435, Project #4, William Treutel
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
var inetWindows, inetClosers, calcWindows, calcClosers;
var inetGeo, inetCloseGeo, inetMat, inetCloseMat;
var calcGeo, calcCloseGeo, calcMat, calcCloseMat;

var loader = new THREE.FontLoader();
var pivot1,  pivot2,  pivot3;

var inetActive = false, calcActive = false, inetCount = 0, calcCount = 0;

var movingObject, startMouseX, startMouseY;


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

	
	var geometry = new THREE.BoxGeometry(100, .8, 0.1);
	var material = new THREE.MeshBasicMaterial({ color: 0x808080 });
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


	inetWindows = []; inetClosers = [];
	calcWindows = []; calcClosers = [];

	inetGeo = new THREE.BoxGeometry(6, 4, .1);
	inetMat = new THREE.MeshPhongMaterial({transparent: false, map: THREE.ImageUtils.loadTexture('inetimage.png')});

	
	inetCloseGeo = new THREE.BoxGeometry(.2, .2, .1);
	inetCloseMat = new THREE.MeshBasicMaterial({ opacity: 0, transparent: true });
	
	calcGeo = new THREE.BoxGeometry(6, 4, .1);
	calcMat = new THREE.MeshPhongMaterial({transparent: true, map: THREE.ImageUtils.loadTexture('calcimage.png')});

	calcCloseGeo = new THREE.BoxGeometry(.35, .35, .1);
	calcCloseMat = new THREE.MeshBasicMaterial({ opacity: 0, transparent: true, color: 0xff0000 });

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
	
	//for ( var i = 0; i < intersects.length; i++) {
	for ( var i = 0; i < 1; i++) {
		if (intersects[i].object == inet) {
			inetWindows.push(new THREE.Mesh(inetGeo,inetMat));
			inetClosers.push(new THREE.Mesh(inetCloseGeo,inetCloseMat));
			inetClosers[inetCount].buddy = inetWindows[inetCount];
			inetClosers[inetCount].position.y = 2.72;
			inetClosers[inetCount].position.z = .021;
			inetClosers[inetCount].position.x = (inetCount % 11) - 2.0;

			inetWindows[inetCount].position.x = (inetCount % 11) - 5;
			inetWindows[inetCount].position.y = 1;
			inetWindows[inetCount].position.z = .02;

			scene.add(inetWindows[inetCount]);
			scene.add(inetClosers[inetCount]);
			inetCount++;
			}	
		else if (inetClosers.indexOf(intersects[i].object) > -1) {
			j = inetClosers.indexOf(intersects[i].object);
			
				scene.remove(inetClosers[j].buddy);
				scene.remove(inetClosers[j]);
		}

		else if (inetWindows.indexOf(intersects[i].object) >= 0) {
			for (j = 0; j < inetWindows.length; j++) {
				inetWindows[j].position.z = -.01;
				inetClosers[j].position.z = -.005;
				}
			inetWindows[inetWindows.indexOf(intersects[i].object)].position.z = .01;
			inetClosers[inetWindows.indexOf(intersects[i].object)].position.z = .02;
			}


		// CALCULATOR STUFF
		else if (intersects[i].object == calc) {
			calcWindows.push(new THREE.Mesh(calcGeo,calcMat));
			calcClosers.push(new THREE.Mesh(calcCloseGeo,calcCloseMat));
			calcClosers[calcCount].buddy = calcWindows[calcCount];
			calcClosers[calcCount].position.x = 2.8;
			calcClosers[calcCount].position.y = 1.66;
			calcClosers[calcCount].position.z = .021;
			calcClosers[calcCount].position.x = (calcCount % 11) - 2.1;

			calcWindows[calcCount].position.z = .02;
			calcWindows[calcCount].position.x = (calcCount % 11) - 5;


			scene.add(calcWindows[calcCount]);
			scene.add(calcClosers[calcCount]);
			calcCount++;
			}	
		else if (calcClosers.indexOf(intersects[i].object) >= 0) {
			j = calcClosers.indexOf(intersects[i].object);
				scene.remove(calcClosers[j].buddy);
				scene.remove(calcClosers[j]);
		}

		else if (calcWindows.indexOf(intersects[i].object) >= 0) {
			for (j = 0; j < calcWindows.length; j++) {
				calcWindows[j].position.z = -.01;
				calcClosers[j].position.z = -.005;
				}
			calcWindows[calcWindows.indexOf(intersects[i].object)].position.z = .01;
			calcClosers[calcWindows.indexOf(intersects[i].object)].position.z = .02;
			}

		else if (intersects[i].object == start) { window.alert("The start button is just for decoration."); }
	}

	renderer.render( scene, camera );
	}
