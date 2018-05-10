document.body.onload = function () {
	var glObj = {
		scene: null,
		camera: null,
		renderer: null,
		lights: null,
		cone: null,
		helper: null,
		innerScene: function () {
			this.scene = new THREE.Scene()
		},
		innerCamera: function () {
			this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
			this.camera.position.z = 200
			this.camera.position.y = 0
		},
		innerRenderer: function () {
			this.renderer = new THREE.WebGLRenderer({
		        antialias: true
		    })
			this.renderer.shadowMap.enabled = true
			this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
			this.renderer.setSize(window.innerWidth,window.innerHeight)
			document.body.appendChild(this.renderer.domElement)
		},
		innerLight: function () {
			this.lights = []
			this.lights[ 0 ] = new THREE.AmbientLight( 0x000000 )
			this.lights[ 1 ] = new THREE.SpotLight( 0xffffff, 2, 0 )
//			this.lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 )
//			this.lights[ 3 ] = new THREE.PointLight( 0xffffff, 1, 0 )
//			this.lights[ 4 ] = new THREE.PointLight( 0xffffff, 1, 0 )
		
			this.lights[ 1 ].position.set( 200, 200, 200 )
			this.lights[ 1 ].castShadow = true
//			this.lights[ 2 ].position.set( 200, 0, 0 )
//			this.lights[ 3 ].position.set( 0, - 200, 0 )
//			this.lights[ 4 ].position.set( - 200, 0, 0 )
//		
			this.lights.map(function(item){
		    	glObj.scene.add(item)
		    })
		},
		innerCone: function () {
			this.cone = new THREE.Object3D()
			
			var pointarr = []
			
			getInto(function(d){
				pointarr = d
				
				var points = []
					
				pointarr.map(function(group,i){
					points[i] = []
					group.map(function(item){
						points[i].push(new THREE.Vector3(item[0],item[1],item[2]))
					})
				})
				
				points.map(function(item){
					let box = withLineBox(
						item,
						new THREE.MeshPhongMaterial( {
							color: 0x0000ff,
							emissive: 0x666666,
							side: THREE.DoubleSide,
							flatShading: THREE.FlatShading
						} )
					)
					glObj.cone.add(box.mesh,box.line)
				})
			})
			
			var floorboard = [
				[
					[-1000,0,-1000],
					[1000,0,-1000],
					[-1000,0,1000],
					[1000,0,1000],
				]
			]
			
			var floor = []
			
			floorboard.map(function(group,i){
				floor[i] = []
				group.map(function(item){
					floor[i].push(new THREE.Vector3(item[0],item[1],item[2]))
				})
			})
			
			floor.map(function(item){
				let box = withLineBox(
					item,
					new THREE.MeshPhongMaterial( {
						color: 0x333333,
						emissive: 0x333322,
						side: THREE.DoubleSide,
						flatShading: THREE.FlatShading
					} )
				)
				glObj.cone.add(box.mesh)
			})
			
		    this.scene.add(this.cone)
		},
		innerHelper: function () {
			this.helper = new THREE.GridHelper( 1000, 10 )
			this.scene.add(this.helper)
		},
		render: function () {
			requestAnimationFrame( glObj.render )
			glObj.renderer.render(glObj.scene, glObj.camera)
		},
		innerResize: function () {
			glObj.camera.aspect = window.innerWidth / window.innerHeight
			glObj.camera.updateProjectionMatrix()
			glObj.renderer.setSize( window.innerWidth, window.innerHeight )
		},
		innerControl: function () {
			var isSeen = false,
				startPosX = 0,
				startPosY = 0
			window.addEventListener('mousedown',function () {
				isSeen = true
//				console.log(event)
//				startPosX = event.clientX
			})
			window.addEventListener('mousemove',function () {
				if(isSeen){
					if(Math.abs(event.movementY) > Math.abs(event.movementX)){
						glObj.camera.position.y += event.movementY * 0.05
					}
					else{
//						var changeX = event.clientX - startPosX
//						glObj.cone.rotation.y += changeX / document.body.offsetWidth * 4
						glObj.cone.rotation.y += event.movementX / document.body.offsetWidth * 4
					}
				}
			})
			window.addEventListener('mousewheel',function () {
				if(event.deltaY > 0){
					glObj.camera.rotation.y -= 0.1
				}
				else{
					glObj.camera.rotation.y += 0.1
				}
			})
			window.addEventListener('keydown',function () {
			//          	console.log(event.keyCode) // 38 40 37 39
				let vx = glObj.camera.getWorldDirection().x,vy = glObj.camera.getWorldDirection().y,vz = glObj.camera.getWorldDirection().z
				let vp = Math.sqrt(Math.pow(vx,2) + Math.pow(vz,2))
				if(event.keyCode == 38){
					glObj.camera.position.x += glObj.camera.getWorldDirection().x 
					glObj.camera.position.y += glObj.camera.getWorldDirection().y 
					glObj.camera.position.z += glObj.camera.getWorldDirection().z 
				}
				if(event.keyCode == 40){
					glObj.camera.position.x -= glObj.camera.getWorldDirection().x 
					glObj.camera.position.y -= glObj.camera.getWorldDirection().y 
					glObj.camera.position.z -= glObj.camera.getWorldDirection().z 
				}
				if(event.keyCode == 37){
					glObj.camera.position.x += glObj.camera.getWorldDirection().z / vp
					glObj.camera.position.z -= glObj.camera.getWorldDirection().x / vp
				}
				if(event.keyCode == 39){
					glObj.camera.position.x -= glObj.camera.getWorldDirection().z / vp
					glObj.camera.position.z += glObj.camera.getWorldDirection().x / vp
				}
			})
			window.addEventListener('mouseup',function () {
				isSeen = false
			})
			window.addEventListener('mouseleave',function () {
				isSeen = false
			})
			window.addEventListener('touchstart',function () {
				startPosX = event.touches[0].clientX
			})
			window.addEventListener('touchmove',function () {
				var changeX = event.touches[0].clientX - startPosX
				glObj.cone.rotation.y += changeX / document.body.offsetWidth * 4
				startPosX = event.touches[0].clientX
			})
		},
		main: function () {
			this.innerScene()
			this.innerCamera()
			this.innerRenderer()
			this.innerLight()
			this.innerCone()
//			this.innerHelper()
			window.addEventListener('resize',this.innerResize)
			this.render()
			this.innerControl()
		}
	}
	glObj.main()
}