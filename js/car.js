function getInto (fun) {
	$.ajax({
		type:"get",
		url:"js/car.json",
		success: function (d) {
			let arr = []
			for(let i in d){
				arr.push(d[i])
			}
			fun(arr)
		}
	})
}
