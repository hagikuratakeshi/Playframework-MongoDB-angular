function nearByEventsCtrl($scope, $http) {
	$scope.nearByEvents = [];
	
	var getEvents = function(url, params) {
  	$('#eventSearchSpinner').show();
		$http({
			url : url,
			method : "GET",
			params : params
		}).success(function(data, status, headers, config) {
			$scope.nearByEvents = data;
  		$('#eventSearchSpinner').hide();
  		
			console.log(data);
  		for (var i = 0; i < data.length; i++) {
  			var event = data[i];
  			if (mapsutil.isMarkerAlreadyPut(event) < 0) {
  				mapsutil.putMarker(event);
  			}
  		}
		}).error(function(data, status, headers, config) {
			// TODO error handling
  		$('#eventSearchSpinner').hide();
		});
	}
	
	$scope.getNearByEvents = function() {
		var center = map.getCenter();
  	getEvents('/api/events/searchWithin', {
  		latitude : center.ob,
			longitude : center.pb
  	});
	};
	
	$scope.getEventsByPolygon = function() {
		var mapBounds = map.getBounds();
		getEvents('/api/events/searchPolygon', {
			latMax : mapBounds.ea.d,
			latMin : mapBounds.ea.b,
			lonMax : mapBounds.ia.d,
			lonMin : mapBounds.ia.b
		});
	};
}
