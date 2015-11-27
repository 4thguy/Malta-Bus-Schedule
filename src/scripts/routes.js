var routeList = [
	'58',
	'47'
];

var routes = {
	'58': {
		mt: {
			title: 'SERVIZZ AĦJAR GĦAL BIRKIRKARA',
			desc: 'Il-Karkariżi issa se jkollhom ir-rotta tagħhom.'
		},
		en: {
			title: 'A BETTER SERVICE FOR BIRKIRKARA',
			desc: 'Birkirkara residents will now have their own route.'
		},
		data: {
			id: '58',
			route: [{
				location: 'Birkirkara',
				area: 'Stazzjon'
			},{
				location: 'Fleur de lys',
				area: ''
			},{
				location: 'Santa Venera',
				area: ''
			},{
				location: 'Il-Ħamrun',
				area: ''
			},{
				location: 'Il-Furjana',
				area: ''
			},{
				location: 'Valletta',
				area: ''
			}],
			times: {
				template: {
					type1: [{
						start: '5:30',
						end: '10:05',
						frequency: 20
					},{
						start: '10:06',
						end: '22:35',
						frequency: 30
					}],
					type2: [{
						start: '5:30',
						end: '22:50',
						frequency: 30
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
	},
	'47': {
		mt: {
			title: 'ROTTA ĠDIDA',
			desc: 'Iż-żona ta’ Santa Margerita fil-Mosta issa se jkollha konnessjoni diretta għal Birkirkara u għall-Belt.'
		},
		en: {
			title: 'A NEW ROUTE',
			desc: 'Santa Margerita in Mosta will have a direct link for Birkirkara and Valletta.'
		},
		data: {
			id: '47',
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
	}
};
