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
			// TODO Get latlng from address
			return;
		}
		var markerOpts = {
			position : new google.maps.LatLng(event.latlng.lat, event.latlng.lon),
			map : map,
			animation : google.maps.Animation.DROP,
			title : event.name,
			event : event
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

		var infoWindow = new google.maps.InfoWindow({
			content : '<div class="eventInfoWindowTitle">' + event.name.substr(0, 5) + "..."
					+ '</div> <img src="' + event.imageLarge.source + '" width="40" height="40" /> ',
      disableAutoPan : true
		});
		infoWindow.open(map, marker);

		function formatDateAsYYYYMMDD(date) {
			return (date.getYear() + 1900) + ' / ' + (date.getMonth() + 1) + ' / ' + date.getDay();
		}
		var detailInfoWindow = new google.maps.InfoWindow({
			content : '<h3>' + event.name + '</h3>' +
			'<dl class="dl-horizontal">' +
			'  <dt>' + Messages('eventImage') + '</dt> ' +
			'  <dd><img src="'+ event.imageLarge.source + '"></img></dd>' +
			'  <dt>' + Messages('eventMedia') + '</dt> ' +
			'  <dd>' + event.media + '</dd>' +
			'  <dt>' + Messages('eventVenue') + '</dt> ' +
			'  <dd>' + event.venue.name + '</dd>' +
			'  <dt>' + Messages('eventVenueType') + '</dt> ' +
			'  <dd>' + event.venue.venueType + '</dd>' +
			'  <dt>' + Messages('eventVenueAddress') + '</dt> ' +
			'  <dd>' + event.venue.address + '</dd>' +
			'  <dt>' + Messages('eventVenuePhone') + '</dt> ' +
			'  <dd>' + event.venue.phone + '</dd>' +
			'  <dt>' + Messages('eventVenueAccess') + '</dt> ' +
			'  <dd>' + event.venue.access + '</dd>' +
			'  <dt>' + Messages('eventVenueOpenineHour') + '</dt> ' +
			'  <dd>' + event.venue.openingHour + '</dd>' +
			'  <dt>' + Messages('eventVenueClosingHour') + '</dt> ' +
			'  <dd>' + event.venue.closingHour + '</dd>' +
			'  <dt>' + Messages('eventDateStart') + '</dt> ' +
			'  <dd>' + formatDateAsYYYYMMDD(new Date(event.dateStart)) + '</dd>' +
			'  <dt>' + Messages('eventDateEnd') + '</dt> ' +
			'  <dd>' + formatDateAsYYYYMMDD(new Date(event.dateEnd)) + '</dd>' +
			'  <dt>' + Messages('eventPrice') + '</dt> ' +
			'  <dd>' + event.price + '</dd>' +
			'  <dt>' + Messages('eventDescription') + '</dt> ' +
			'  <dd>' + event.description + '</dd>' +
			'</dl>',
			zIndex : 10000
		});
		
		google.maps.event.addListener(marker, 'click', function() {
			infoWindow.close();
			detailInfoWindow.open(map, marker);
		});

		google.maps.event.addListener(detailInfoWindow, 'closeclick', function() {
			infoWindow.open(map, marker);
		});
	},
	initialize : function() {
		var mapOptions = {
			zoom : 16,
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
			mapsutil.updateEventsByPolygon();
		});
		google.maps.event.addListener(map, 'zoom_changed', function() {
			mapsutil.updateEventsByPolygon();
		});
		
		mapsutil.updateNearByEvents();

		var mc = new MarkerClusterer(map);
	}
};
