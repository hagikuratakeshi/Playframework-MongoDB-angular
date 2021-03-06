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
			globalEvents = data;
  		$('#eventSearchSpinner').hide();
  		
  		var newlyMarker = [];
  		for (var i = 0; i < data.length; i++) {
  			var event = data[i];
  			if (mapsutil.isMarkerAlreadyPut(event) < 0) {
  				var marker = mapsutil.putMarker(event);
  				newlyMarker.push(marker);
  			}
  		}
  		var mc = new MarkerClusterer(map, mapsutil.markers);
  		
  		for (var i = 0; i < newlyMarker.length; i++) {
  			mapsutil.putInfoWindow(newlyMarker[i]);
  		}
		}).error(function(data, status, headers, config) {
			// TODO error handling
  		$('#eventSearchSpinner').hide();
		});
	}
	
	$scope.getNearByEvents = function() {
		var center = map.getCenter();
  	getEvents('/api/events/searchWithin', {
  		latitude : center.lat(),
			longitude : center.lng()
  	});
	};
	
	$scope.getEventsByPolygon = function() {
		var mapBounds = map.getBounds();
		getEvents('/api/events/searchPolygon', {
      latMax : mapBounds.getNorthEast().lat(),
      latMin : mapBounds.getSouthWest().lat(),
      lonMax : mapBounds.getNorthEast().lng(),
			lonMin : mapBounds.getSouthWest().lng()
		});
	};
	
	$scope.openDetailedInfoWindow = function(e) {
		mapsutil.openDetailedInfoWindow(e.currentTarget.innerText);
	}
}
