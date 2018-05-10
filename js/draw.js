function withLineBox (points,meshmeterial,linemeterial) {
	var g = [new THREE.Geometry(),new THREE.Geometry()]
	for(let i = 0; i < points.length; i++){
		g[0].vertices.push(points[i])
		for(let j = i + 1; j < points.length; j++){
			g[1].vertices.push(points[i])
			g[1].vertices.push(points[j])
		}
		for(let m = 0; m < points.length; m ++){
			if(m != i){
				for(let n = 0; n < points.length; n ++){
					if(n != m && n != i){
						g[0].faces.push(new THREE.Face3( i, m, n ))
					}
				}
			}
		}
	}
	g[0].computeBoundingSphere()
	var mesh = new THREE.Mesh(g[0],meshmeterial || new THREE.MeshBasicMaterial( {color: 0x0000ff} ))
	var line = new THREE.LineSegments(g[1],linemeterial || new THREE.MeshBasicMaterial( {color: 0xffffff} ))
	return {
		mesh: mesh,
		line: line
	}
}