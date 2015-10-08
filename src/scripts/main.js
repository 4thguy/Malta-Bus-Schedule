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
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
	'sunday'
];

function initRouteTimes(currentRoute) {
	var times = currentRoute.data.times;
	var template = times.template;
	var toReturn = [];

	for (var s in seasons) {
		var seasonString = seasons[s];
		var currentSeason = times[seasonString];
		for (var d in days) {
			var dayString = days[d];
			var currentSchedule = template[currentSeason[dayString]];
			for (var c in currentSchedule) {
				var currentTime = currentSchedule[c];
				var a = {
					day: dayString,
					season: seasonString,
					start: currentTime.start,
					end: currentTime.end,
					frequency: currentTime.frequency
				};
				toReturn.push(a);
			}
		}
	}
	return toReturn;
}

function BusRouteViewModel() {
	var self = this;

	self.route = currentRoute.data.route;
	self.times = initRouteTimes(currentRoute);
};

ko.applyBindings(new BusRouteViewModel());
