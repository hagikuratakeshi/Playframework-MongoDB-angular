function updateCircles() {
	var topLeft = [ 35.85344, 139.598937 ];
	var bottomLeft = [ 35.603719, 139.598937 ];
	var topRight = [ 35.85344, 140.043883 ];
	var bottomRight = [ 35.627163, 140.043883 ];

	var startPoint = topLeft;

	var circles = [];
	for ( var x = startPoint[1]; x <= topRight[1]; x += 0.032) {
		for ( var y = startPoint[0]; y >= bottomLeft[0]; y -= 0.032) {
			console.log("(" + y + ", " + x + ")");
			circles.push(new google.maps.LatLng(y, x));
		}
	}

	for ( var i = 0; i < circles.length; i++) {
		var populationOptions = {
			strokeColor : "#FF0000",
			strokeOpacity : 0.8,
			strokeWeight : 2,
			fillColor : "#FF0000",
			fillOpacity : 0.35,
			map : map,
			center : circles[i],
			radius : 3000
		};
		circle = new google.maps.Circle(populationOptions);
	}
};