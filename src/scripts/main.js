'use strict';

var currentRoute = routes[47];

var seasons = [
	'summer',
	'winter'
];
var days = [
	'sunday',
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
];

var today = {
	season: 'winter',
	dayOfWeek: days[new Date().getDay()]
};

function initRouteTimes(currentRoute) {
	var times = currentRoute.data.times;
	var template = times.template;
	var toReturn = {};

	for (var s in seasons) {
		var seasonString = seasons[s];
		var currentSeason = times[seasonString];
		toReturn[seasonString] = {};
		for (var d in days) {
			var dayString = days[d];
			var currentSchedule = template[currentSeason[dayString]];
			toReturn[seasonString][dayString] = [];
			for (var c in currentSchedule) {
				var currentTime = currentSchedule[c];
				var tmpEnd = currentTime.end.split(':');
					tmpEnd[0] = parseInt(tmpEnd[0]);
					tmpEnd[1] = parseInt(tmpEnd[1]);
				var tmpStart = currentTime.start.split(':');
					tmpStart[0] = parseInt(tmpStart[0]);
					tmpStart[1] = parseInt(tmpStart[1]);
				var currentHours = 1 - (tmpEnd[1] - tmpStart[1]) / 60;
				    currentHours += (tmpEnd[0] - tmpStart[0]);
				var currentFrequency = 60 / currentTime.frequency; //assuming tha busses run at least 1 time per hour
				var totalTrips = currentHours * currentFrequency;
				var schedule = [
					tmpEnd[0] - Math.ceil(currentHours),
					tmpEnd[1]
				];
				for (var t = 0; t < totalTrips; t++) {
					schedule[1] += currentTime.frequency;
					if (schedule[1] > 59) {
						schedule[1] -= 60;
						schedule[0]++;
					}
					var currentDeparture = schedule.join(':');
					var a = {
						day: dayString,
						season: seasonString,
						departure: currentDeparture,
						model: currentTime
					};
					toReturn[seasonString][dayString].push(a);
				}
			}
		}
	}
	return toReturn;
}

function changeRoute(routeData, newRoute) {
	var currentRoute = routes[newRoute];
	var route = currentRoute.data.route;
	routeData.title(currentRoute.en.title);
	routeData.desc(currentRoute.en.desc);
	routeData.currentSchedule = initRouteTimes(currentRoute);
	routeData.route.removeAll();
	for (var i in route) {
		routeData.route.push(route[i]);
	}
	return filterSchedule(routeData);
}

function filterSchedule(routeData) {
	routeData.times.removeAll();
	var season = routeData.season()[0] || 'winter';
	var selectedDay = routeData.currentSchedule[season][routeData.day()];
	for (var i in selectedDay) {
		routeData.times.push(selectedDay[i]);
	}
	return routeData;
}

function scheduleStatus(data) {
	if ((data.day === today.dayOfWeek) && //filter out 6/7 of list
		(data.season === today.season)) { //filter out 1/2 of list
		var now = new Date();
		now = now.getHours()*60 + now.getMinutes();
		var departure = data.departure.split(':');
		departure = parseInt(departure[0]*60) + parseInt(departure[1]);
		var difference = departure - now;
		if (difference > 0) {
			if (difference < data.model.frequency) {
				return 'next';
			} else {
				return 'scheduled';
			}
		} else {
			return 'departed';
		}
	}
	return 'none';
}

function BusRouteViewModel() {
	var self = this;

	self.routeData = {
		currentSchedule: {}, //data reference
		title: ko.observable(''),
		desc: ko.observable(''),
		route: ko.observableArray([]), //route, automatic
		times: ko.observableArray([]), //route times, automatic
		routeId: ko.observable(''), //route id, user editable
		day: ko.observable(today.dayOfWeek), //today, user editable
		season: ko.observableArray([]), //winter, user editable
	};

	self.days = days;

	self.changeDay = function(newDay) {
		self.routeData.day(newDay);
	};
	self.isRunning = function(data) {
		return 'bus-' + scheduleStatus(data);
	};

	self.routeData.routeId.subscribe(function(newRoute) {
		changeRoute(self.routeData, newRoute);
	});
	self.routeData.day.subscribe(function() {
		filterSchedule(self.routeData);
	});
	self.routeData.season.subscribe(function() {
		filterSchedule(self.routeData);
	});

	self.routeData.routeId('47');

	return false;
}

var busRouteViewModel = new BusRouteViewModel();
ko.applyBindings(busRouteViewModel);
