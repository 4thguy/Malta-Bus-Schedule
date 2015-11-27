'use strict';

var currentRoute = {
	mt: {
		title: 'ROTTA ĠDIDA',
		desc: 'Iż-żona ta’ Santa Margerita fil-Mosta issa se jkollha konnessjoni diretta għal Birkirkara u għall-Belt.'
	},
	en: {
		title: 'A NEW ROUTE',
		desc: 'Santa Margerita in Mosta will have a direct link for Birkirkara and Valletta.'
	},
	data: {
		route: [{
			location: 'Il-Mosta',
			area: 'Santa Margerita'
		},{
			location: 'Il-Mosta',
			area: 'Ċentru'
		},{
			location: 'Il-Mosta',
			area: 'Technopark'
		},{
			location: 'Ħal-Lija',
			area: 'Roundabout'
		},{
			location: 'Birkirkara',
			area: 'Psila Street'
		},{
			location: 'Santa Venera',
			area: 'Ferrovija'
		},{
			location: 'Il-Pieta\'',
			area: 'G\'Mangia'
		},{
			location: 'Il-Ħamrun',
			area: 'Mile End'
		},{
			location: 'Valletta',
			area: ''
		}],
		times: {
			template: {
				type1: [{
					start: '5:20',
					end: '7:50',
					frequency: 30
				},{
					start: '7:51',
					end: '22:15',
					frequency: 60
				}],
				type2: [{
					start: '5:30',
					end: '22:30',
					frequency: 60
				}]
			},
			summer: {
				monday: 'type1',
				tuesday: 'type1',
				wednesday: 'type1',
				thursday: 'type1',
				friday: 'type1',
				saturday: 'type2',
				sunday: 'type2'
			},
			winter: {
				monday: 'type1',
				tuesday: 'type1',
				wednesday: 'type1',
				thursday: 'type1',
				friday: 'type1',
				saturday: 'type2',
				sunday: 'type2'
			}
		}
	}
};

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

function filterSchedule(currentSchedule, data) {
	data.times.removeAll();
	var selectedDay = currentSchedule[data.season][data.day];
	for (var i in selectedDay) {
		data.times.push(selectedDay[i]);
	}
	return data;
}

function BusRouteViewModel() {
	var self = this;
	var routeTimes = initRouteTimes(currentRoute);

	self.day = ko.observable(today.dayOfWeek);
	self.days = days;

	self.changeDay = function(data) {
		self.day(data);
	};

	var packageDataForSchduleFilter = function() {
		return {
			season: self.season()[0] || 'winter',
			day: self.day(),
			times: self.times
		};
	};

	self.day.subscribe(function() {
		filterSchedule(routeTimes, packageDataForSchduleFilter());
	});

	self.season = ko.observableArray([]); //winter

	self.season.subscribe(function() {
		filterSchedule(routeTimes, packageDataForSchduleFilter());
	});

	self.route = currentRoute.data.route;
	self.times = ko.observableArray([]);

	self.isRunning = function(data) {
		if ((data.day === today.dayOfWeek) && //filter out 6/7 of list
			(data.season === today.season)) { //filter out 1/2 of list
			var now = new Date();
			now = now.getHours()*60 + now.getMinutes();
			var departure = data.departure.split(':');
			departure = parseInt(departure[0]*60) + parseInt(departure[1]);
			var difference = departure - now;
			if (difference > 0) {
				if (difference < data.model.frequency) {
					return 'bus-next';
				} else {
					return 'bus-scheduled';
				}
			} else {
				return 'bus-departed';
			}
		}
		return 'bus-none';
	};

	filterSchedule(routeTimes, packageDataForSchduleFilter());

	return false;
}

ko.applyBindings(new BusRouteViewModel());
