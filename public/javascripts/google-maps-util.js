var map;
var mapsutil = {
	/**
	 * Retains the markers put in the map. Sorted by the latitude.
	 */
	markers : [],
	
	/**
	 * Retains the detailed info windows.
	 */
	detailedInfoWindows : [],
	isMarkerAlreadyPut : function(event) {
		if (mapsutil.markers.length == 0) {
			return -1;
		}
		var markerOpts = {
			position : new google.maps.LatLng(event.latlng.latitude, event.latlng.longitude),
			map : map,
			title : 'marker',
			visible : false,
			event : event
		};
		var marker = new google.maps.Marker(markerOpts);
		return arrayUtil.binarySearch(marker, mapsutil.markers, function(left, right) {
			if (left.event.id > right.event.id) {return -1;}
			if (left.event.id < right.event.id) {return 1;}
			return 0;
		});
	},
	updateNearByEvents : function() {
		angular.element('#nearByEventsId').scope().getNearByEvents();
	},

	updateEventsByPolygon : function() {
		angular.element('#nearByEventsId').scope().getEventsByPolygon();
	},

	openDetailedInfoWindow : function(eventName) {
		for (var i = 0; i < mapsutil.markers.length; i++) { 
			var target = mapsutil.markers[i]; 
			if (eventName.indexOf(target.event.name) >= 0) {
				var detailInfoWindow = mapsutil.makeDetailedInfoWindow(target.event);
    		// close already opened detailed info window.
		    mapsutil.detailedInfoWindows.map(function(detailedWindow) {detailedWindow.close();})
		    mapsutil.detailedInfoWindows = [];
		    
				detailInfoWindow.open(map, mapsutil.markers[i]);
		    mapsutil.detailedInfoWindows.push(detailInfoWindow);
		  }
	  }	
	},
	makeDetailedInfoWindow : function(event) {
		
		function formatDateAsYYYYMMDD(date) {
			return (date.getYear() + 1900) + ' / ' + (date.getMonth() + 1) + ' / ' + date.getDate();
		}
		var detailInfoWindow = new google.maps.InfoWindow({
			content : '<h4>' + event.name + '</h4>' +
			'<dl class="dl-horizontal detailedInfoWindow">' +
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
		return detailInfoWindow; 
	},
	putInfoWindow : function(marker) {
		var event = marker.event;
		var infoWindow = new google.maps.InfoWindow({
			content : '<div class="eventInfoWindowTitle">' + event.name.substr(0, 5) + "..."
					+ '</div> <img src="' + event.imageLarge.source + '" width="40" height="40" /> ',
      disableAutoPan : true
		});
		
		var detailInfoWindow = mapsutil.makeDetailedInfoWindow(event);
		infoWindow.open(map, marker);
		google.maps.event.addListener(marker, 'click', function() {
			infoWindow.close();
			detailInfoWindow.open(map, marker);
			mapsutil.detailedInfoWindows.push(detailInfoWindow);
		});

		google.maps.event.addListener(detailInfoWindow, 'closeclick', function() {
			infoWindow.open(map, marker);
		});
	},
	putMarker : function(event) {
		if (!event.latlng) {
			// TODO Get latlng from address
			return;
		}
		var markerOpts = {
			position : new google.maps.LatLng(event.latlng.latitude, event.latlng.longitude),
			map : map,
			animation : google.maps.Animation.DROP,
			title : event.name,
			event : event
		};
		var marker = new google.maps.Marker(markerOpts);

		// Keep markers sorted by the latitude (next longitude)
		arrayUtil.binaryInsert(marker, mapsutil.markers, function(left, right) {
			if (left.event.id > right.event.id) {return -1;}
			if (left.event.id < right.event.id) {return 1;}
			return 0;
		});

		return marker;
	},
	getCurrentLocation : function() {
		if (navigator.geolocation) {
      return navigator.geolocation.getCurrentPosition();
    } else {
    	// not supported by the browser.
    	return null;
    }
	},
	initialize : function() {
		
		//Disable the geo location API by default. 
    //var currentLocation = mapsutil.getCurrentLocation();
		var currentLocation  = currentLocation || {
			coords : {
			  latitude : 35.66158511497833,
			  longitude : 139.73045148651127
			}
		};
			
		var mapOptions = {
			zoom : 16,
			center : new google.maps.LatLng(currentLocation.coords.latitude, currentLocation.coords.longitude),
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
				mapsutil.updateEventsByPolygon();
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
