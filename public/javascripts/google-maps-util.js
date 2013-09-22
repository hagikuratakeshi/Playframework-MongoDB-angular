var map;
var mapsutil = {
	/**
	 * Retains the markers put in the map. Sorted by the latitude.
	 */
	markers : [],
	isMarkerAlreadyPut : function(event) {
		if (mapsutil.markers.length == 0) {
			return -1;
		}
		var markerOpts = {
			position : new google.maps.LatLng(event.latlng.lat, event.latlng.lon),
			map : map,
			title : 'marker',
			visible : false,
		};
		var marker = new google.maps.Marker(markerOpts);
		return arrayUtil.binarySearch(marker, mapsutil.markers, function(left, right) {
			if (left.position.ob != right.position.ob) {
				return left.position.ob - right.position.ob;
			} else {
				return left.position.pb - right.position.pb;
			}
		});
	},
	updateNearByEvents : function() {
		angular.element('#nearByEventsId').scope().getNearByEvents();
	},

	updateEventsByPolygon : function() {
		angular.element('#nearByEventsId').scope().getEventsByPolygon();
	},

	putMarker : function(event) {
		if (!event.latlng) {
			//TODO Get latlng from address
			return;
		}
		var markerOpts = {
			position : new google.maps.LatLng(event.latlng.lat, event.latlng.lon),
			map : map,
			animation : google.maps.Animation.DROP,
			title : event.name
		};
		var marker = new google.maps.Marker(markerOpts);

		// Keep markers sorted by the latitude (next longitude)
		arrayUtil.binaryInsert(marker, mapsutil.markers, function(left, right) {
			if (left.position.ob != right.position.ob) {
				return left.position.ob - right.position.ob;
			} else {
				return left.position.pb - right.position.pb;
			}
		});

		var infoWindow = new google.maps.InfoWindow(
				{
					content : '<div class="eventInfoWindowTitle">' + event.name.substr(0, 5) + "..." + 
					  '</div> <img src="' + event.imageLarge.source + '" width="40" height="40" /> '
				});
		infoWindow.open(map, marker);

	},
	initialize : function() {
		var mapOptions = {
			zoom : 14,
			center : new google.maps.LatLng(35.66158511497833, 139.73045148651127),
			mapTypeId : google.maps.MapTypeId.ROADMAP,
			panControl : false
		};
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		// Locate search box
		var input = document.getElementById('searchBox');
		var searchBox = new google.maps.places.SearchBox(input);

		google.maps.event.addListener(searchBox, 'places_changed', function() {
			var places = searchBox.getPlaces();
			if (places.length > 0) {
				map.panTo(places[0].geometry.location);
			}
		});

		google.maps.event.addListener(map, 'dragend', function() {
			// 0.3 seconds after the center of the map has changed, update the
			// nearby events.
//			window.setTimeout(function() {
				mapsutil.updateEventsByPolygon();
//			}, 250);
		});
		mapsutil.updateNearByEvents();
	}
};
