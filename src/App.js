import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import * as turf from '@turf/turf';
import * as firebase from 'firebase';
import Header from './Header';
import Sidebar from './Sidebar';
import Modal from './Modal';
import district from './districts.json';
import introJs from 'intro.js';

import { Steps, Hints } from 'intro.js-react';

import 'intro.js/introjs.css';
require('dotenv').config();


mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

firebase.initializeApp({
    apiKey: 'AIzaSyAPcJPwwsRESS3m5NNvA5PaXTNRkSo3_AM',
    authDomain: 'catedras-uma.firebaseapp.com',
    databaseURL: 'https://catedras-uma.firebaseio.com',
    projectId: 'catedras-uma',
    storageBucket: 'catedras-uma.appspot.com',
    messagingSenderId: '657639469404'
});
const storage = firebase.storage();

class App extends Component {

    constructor(props) {
        super(props);
        this.toggleModal = this.toggleModal.bind(this)
        this.userLog = this.userLog.bind(this)
        this.handleFilters = this.handleFilters.bind(this)
        this.composeFilters = this.composeFilters.bind(this)
        this.removeFilters = this.removeFilters.bind(this);
        localStorage.removeItem('checks');
        this.closeSidebar = this.closeSidebar.bind(this);
        this.printData = this.printData.bind(this);
        this.gotoselected = this.gotoselected.bind(this);

        this.state = {
            modal: {
                title: 'Plataforma de Iniciativas Ciudadanas 🙌',
                subtitle: '¿QUÉ INICIATIVAS CIUDADANAS HAY EN TU BARRIO?, ¿PARTICIPAS EN ALGUNA?, ¿QUIERES DARLA A CONOCER?',
                description: 'El objetivo de este proyecto es mostrar la ciudad de Málaga desde una perspectiva social de movimientos emergentes, iniciativas vecinales y nuevas tendencias urbanas dentro de sus barrios. Dar a conocer esa realidad social  -con poca visibilidad en la ciudad- además de crear una red de colectivos y asociaciones, y establecer posibles sinergias.',
                type: 'help',
                id: '',
                options: '',
            },
            stepsEnabled: false,
            again: true,
            data: {
                "type": "FeatureCollection",
                "features": []
            },
            tempData: {
                "type": "FeatureCollection",
                "features": []
            },
            site: {
                title: 'Iniciativas Ciudadanas',
                collection: 'initiatives',
                buttons: [{ name: 'Temática', description: 'Visualiza en el mapa el tipo de iniciativa por temática que ha sido llevada a cabo por l@s ciudadan@s.', id: 'purpose', filters: ['Accesibilidad', 'Arte urbano', 'Arquitectura', 'Autogestión', 'Cuidado', 'Culto', 'Cultura', 'Deporte', 'Derechos sociales', 'Diversidad', 'Educación', 'Integración', 'Igualdad', 'Mediación', 'Medio ambiente', 'Movilidad sostenible', 'Participación ciudadana', 'Patrimonio material', 'Patrimonio cultural inmaterial', 'Personas mayores', 'Política social',  'Urbanismo', 'Salud'] }, { name: 'Zonas', description: 'Si quieres enterarte de las iniciativas que han surgido en tu distrito o en cualquier otro, haz uso de este filtro y las verás en el mapa.', id: 'district', filters: district.features.map((feature) => feature.properties.name) }]
            },
            user: {
                email: localStorage.getItem('email'),
                uid: localStorage.getItem('uid')
            },
            satelliteImage: false,
            featureData: {
                show: false
            },
            map: {
                filter: {}
            }
        }
    }

    gotoselected(name) {
        for (var i = 0; i < this.state.data.features.length; i++) {
            if (this.state.data.features[i].properties.name === name) {
                this.map.setCenter(this.state.data.features[i].geometry.coordinates);
                this.map.setZoom(20);
            }
        }
    }

    closeSidebar() {
        this.setState({ featureData: { show: false } })
    }

    toggleModal(options, notification, id, help) {
        this.setState({ modal: options, featureData: { show: false } })
        if (notification) {
            NotificationManager.info(notification)
            if (id != undefined) {
                this.draw.delete(id)
            }
            firebase.firestore().collection(this.state.site.collection).get().then(querySnapshot => {
                let template = {
                    "type": "FeatureCollection",
                    "features": []
                }
                querySnapshot.forEach(doc => {
                    template.features.push(doc.data())
                });

                this.setState({ data: template })
                this.map.getSource('userActivities').setData(this.state.data)

                this.map.removeLayer('userSelected');
                this.map.removeLayer('selectedFeature');

            })
        }

        if(this.state.again) {
            this.setState(() => ({ stepsEnabled: true}));
        }
    }
    printData(selectedLayers) {
        return this.map.queryRenderedFeatures({ layers: selectedLayers });
    }
    handleFilters(conditions) {
        const filters = this.state.map.filter;
        filters[Object.keys(conditions)[0]] = Object.values(conditions)[0];
        if (filters.purpose !== undefined) {
            filters.purpose = filters.purpose.filter(purpose => district.features.map((feature) => feature.properties.name).includes(purpose) === false)
        }
        this.setState({ map: { filter: filters } })
        this.map.removeLayer('userSelected');
        this.map.removeLayer('selectedFeature');
    }

    userLog(userInfo) {
        this.setState({ user: userInfo })
    }

    removeFilters(filterstoremove,t) {
        if(this.state.map.filter.purpose != undefined)
        {
          if(t == true) {
                  delete this.state.map.filter['purpose'];
          }
          else {
            var purpose = filterstoremove;
            if(filterstoremove.length>0)
              this.setState({ map: { filter: {purpose} } });
            else
                this.setState({ map: { filter: {} } });
          }
        }
        else if(t==false) {
            this.setState({ map: { filter: {} } });
        }
    }

    onExit = () => {
        this.setState(() => ({ stepsEnabled: false, again: false }));
    };

    composeFilters(filterObject) {
        let empty = {
            "type": "FeatureCollection",
            "features": []
        }
        let selected = Object.entries(filterObject).filter((entry) => entry[0] === 'district')
        selected = selected[0] == undefined ? [] : (selected[0][1].length > 0 ? selected : [])
        if (selected.length > 0) {
            let template = {
                "type": "FeatureCollection",
                "features": []
            }
            let newDistricts = district.features.filter(district => selected[0][1].includes(district.properties.name))
            template.features = newDistricts;
            let pointsWithin = turf.pointsWithinPolygon(this.state.data, template);
            this.map.getSource('districtPolygons').setData(template);
            this.map.getSource('userActivitiesSource').setData(pointsWithin);
        }
        else {
            if (this.map.getSource('userActivitiesSource') !== undefined) {
                this.map.getSource('userActivitiesSource').setData(this.state.data)
                this.map.getSource('districtPolygons').setData(empty)
            }
        }

        const matches =
            Object.entries(filterObject).filter((entry) => entry[0] !== 'district').map((filterComponent) => {
                if (filterComponent[1].length < 1) {
                    return null
                }
                else {
                    const filterField = filterComponent[0],
                        filterTargets = filterComponent[1];
                    let filterArray = [];
                    Array.from(Array(20).keys()).forEach(x => {
                        filterArray.push(['match', ['at',x,['get', filterField]], filterTargets, true, false])
                    })
                    return filterArray;
                    // return filterTargets.map(target => {
                    //   return (['match', target, ['get', filterField], true, false])
                    // })
                }
            }).filter(element => element !== undefined);
        // console.log(['all', ...matches.flat()])
        // return (['all', ...matches.flat()])
        let result;
        if(['any',...matches.flat()][1] === null || ['any',...matches.flat()][1] === undefined) {
            result = ['all', null]
        }
        else {
            result = (['any',...matches.flat()])
        }
        return result
    }

    // _toggle(satelliteImage) {
    //   if (satelliteImage) {
    //     this.map.setStyle('mapbox://styles/mapbox/satellite-v9');
    //   }
    //     this.map.setStyle('mapbox://styles/mapbox/light-v9');
    //   else {
    //   }
    // }

    componentDidUpdate() {
        let unfilteredFilters = this.composeFilters(this.state.map.filter),
            filters;
        if (unfilteredFilters[1] === null) {
            filters = [unfilteredFilters[0]]
        }
        else {
            filters = unfilteredFilters
        }
        this.map.setFilter('userActivities', filters);
        if (this.map.getSource('userSelected') !== undefined) {
            this.map.setFilter('userSelected', filters);
            this.map.setFilter('selectedFeature', filters);
        }
    }

    componentDidMount() {

        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/light-v9',
            center: [-4.4214, 36.7213],
            zoom: 12,
            hash: true,
            attributionControl: false
        });

        this.map.addControl(new mapboxgl.AttributionControl({ customAttribution: ['Developed by <a href="https://cartometrics.com" target="_blank"><strong>Cartometrics</strong></a>'] }), 'bottom-right');

        this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        this.draw = new MapboxDraw({
            controls: {
                combine_features: false,
                uncombine_features: false,
                trash: false,
                line_string: false,
                polygon: false
            }
        })

        this.map.addControl(this.draw, 'bottom-right');

        this.map.on('load', () => {

            let layers = this.map.getStyle().layers;
            let labelLayerId;
            for (let i = 0; i < layers.length; i++) {
                if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                    labelLayerId = layers[i].id;
                    break;
                }
            }

            this.map.addLayer({
                'id': '3d-buildings',
                'source': 'composite',
                'source-layer': 'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 15,
                'paint': {
                    'fill-extrusion-color': '#aaa',
                    'fill-extrusion-height': [
                        'interpolate', ['linear'], ['zoom'],
                        15, 0,
                        15.05, ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                        'interpolate', ['linear'], ['zoom'],
                        15, 0,
                        15.05, ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': .6
                }
            }, labelLayerId);

            this.map.addSource('activities', {
                type: 'geojson',
                data: this.state.data
            });

            this.map.addSource('districtPolygons', {
                type: 'geojson',
                data: district
            });
            let empty = {
                "type": "FeatureCollection",
                "features": []
            }
            this.map.getSource('districtPolygons').setData(empty)


            firebase.firestore().collection(this.state.site.collection).get().then(querySnapshot => {
                let template = {
                    "type": "FeatureCollection",
                    "features": []
                }
                querySnapshot.forEach(doc => {
                    template.features.push(doc.data())
                });

                this.setState({ data: template })

                this.map.addLayer({
                    id: 'district',
                    source: 'districtPolygons',
                    type: 'fill',
                    'paint': {
                        'fill-color': '#d75d00',
                        'fill-opacity': 0.2
                    }
                });

                this.map.addSource('userActivitiesSource', {
                    type: 'geojson',
                    data: this.state.data
                })

                this.map.addLayer({
                    id: 'userActivities',
                    source: 'userActivitiesSource',
                    type: 'circle',
                    paint: {
                        'circle-radius': [
                            "interpolate", ["linear"], ["zoom"],
                            // zoom is 5 (or less) -> circle radius will be 1px
                            5, ['match',
                                ['get', 'nexus'],
                                'true', 5,
                                3
                            ],
                            // zoom is 10 (or greater) -> circle radius will be 5px
                            12, ['match',
                                ['get', 'nexus'],
                                'true', 12,
                                10
                            ]
                        ],

                        'circle-color': [
                            'match',
                            ['get', 'name'],
                            'bike', '#fbb03b',
                            'parkour', '#223b53',
                            'running', '#e55e5e',
                            'yoga', '#3bb2d0',
                            'rgba(215, 93, 0, 0.8)'
                        ]
                    }
                });

            });



            ['userActivities', 'selectedFeature'].forEach(activityType => {
                this.map.on('mouseenter', activityType, () => {
                    this.map.getCanvas().style.cursor = 'pointer';
                });

                this.map.on('mouseleave', activityType, () => {
                    this.map.getCanvas().style.cursor = '';
                });

                this.map.on('click', activityType, e => {
                    let featureProperties = e.features[0].properties,
                        featureLocation = e.features[0].geometry.coordinates
                    this.setState({ featureData: {featureProperties, featureLocation, show: true}})
                });

                this.map.on('touchend', activityType, e => {
                    let featureProperties = e.features[0].properties,
                        featureLocation = e.features[0].geometry.coordinates
                        this.setState({ featureData: {featureProperties, featureLocation, show: true}})
                    });
            })

            this.map.on('click', 'userActivities', e => {
                if (this.map.getSource('userSelected') !== undefined) {
                    this.map.removeLayer('userSelected');
                    this.map.removeSource('userSelected');
                    this.map.removeLayer('selectedFeature');
                    this.map.removeSource('selectedFeature');
                }

                let clickedFeature = e.features[0];

                let lines;
                let relatedPoints;

                if (clickedFeature.properties.related !== undefined) {
                    let related = clickedFeature.properties.related.slice(1, -1).split(',').map(str => parseInt(str));
                    relatedPoints = this.state.data.features.filter(feature => {
                        return (related.includes(feature.properties.id))
                    })


                    lines = {
                        "type": "FeatureCollection",
                        "features": relatedPoints.map(feature => {
                            let featureObject = {
                                "type": "Feature",
                                "properties": feature.properties,
                                "geometry": {
                                    "type": "LineString",
                                    "coordinates": [clickedFeature.geometry.coordinates, feature.geometry.coordinates]
                                }
                            }
                            return (featureObject)
                        })
                    }
                }

                else {
                    lines = {
                        "type": "FeatureCollection",
                        "features": []
                    };
                    relatedPoints = [];
                }

                this.map.addLayer({
                    id: 'userSelected',
                    source: {
                        'type': 'geojson',
                        'data': lines,
                        lineMetrics: true,
                    },
                    type: 'line',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {

                        'line-width': 2,
                        'line-gradient': [
                            'interpolate',
                            ['linear'],
                            ['line-progress'],
                            0, "#d75d00",
                            0.1, "#ea6400",
                            0.3, "#ff8326",
                            0.5, "#ff9b51",
                            0.7, "#ffa867",
                            1, "#ffbb88"
                        ]
                    }
                });



                this.map.addLayer({
                    id: 'selectedFeature',
                    source: {
                        type: 'geojson',
                        data: turf.featureCollection([...relatedPoints, clickedFeature])
                    },
                    type: 'circle',
                    paint: {

                        'circle-radius': [
                            "interpolate", ["linear"], ["zoom"],
                            // zoom is 5 (or less) -> circle radius will be 1px
                            5, 1,
                            // zoom is 10 (or greater) -> circle radius will be 5px
                            12, 4
                        ],
                        'circle-stroke-width': [
                            "interpolate", ["linear"], ["zoom"],
                            // zoom is 5 (or less) -> circle radius will be 1px
                            5, 3,
                            // zoom is 10 (or greater) -> circle radius will be 5px
                            12, 8
                        ],

                        'circle-color': '#d75d00',
                        'circle-stroke-color': '#d75d00'

                    }
                });

            })

            this.map.on('click', 'selectedFeature', e => {
                if (this.map.getSource('userSelected') !== undefined) {
                    this.map.removeLayer('userSelected');
                    this.map.removeSource('userSelected');
                    this.map.removeLayer('selectedFeature');
                    this.map.removeSource('selectedFeature');
                }

                let clickedFeature = e.features[0];

                let lines;
                let relatedPoints;

                if (clickedFeature.properties.related !== undefined) {
                    let related = clickedFeature.properties.related.slice(1, -1).split(',').map(str => parseInt(str));
                    relatedPoints = this.state.data.features.filter(feature => {
                        return (related.includes(feature.properties.id))
                    })


                    lines = {
                        "type": "FeatureCollection",
                        "features": relatedPoints.map(feature => {
                            let featureObject = {
                                "type": "Feature",
                                "properties": feature.properties,
                                "geometry": {
                                    "type": "LineString",
                                    "coordinates": [clickedFeature.geometry.coordinates, feature.geometry.coordinates]
                                }
                            }
                            return (featureObject)
                        })
                    }
                }

                else {
                    lines = {
                        "type": "FeatureCollection",
                        "features": []
                    };
                    relatedPoints = [];
                }

                this.map.addLayer({
                    id: 'userSelected',
                    source: {
                        'type': 'geojson',
                        'data': lines,
                        lineMetrics: true,
                    },
                    type: 'line',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {

                        'line-width': 2,
                        'line-gradient': [
                            'interpolate',
                            ['linear'],
                            ['line-progress'],
                            0, "#d75d00",
                            0.1, "#ea6400",
                            0.3, "#ff8326",
                            0.5, "#ff9b51",
                            0.7, "#ffa867",
                            1, "#ffbb88"
                        ]
                    }
                });



                this.map.addLayer({
                    id: 'selectedFeature',
                    source: {
                        type: 'geojson',
                        data: turf.featureCollection([...relatedPoints, clickedFeature])
                    },
                    type: 'circle',
                    paint: {

                        'circle-radius': [
                            "interpolate", ["linear"], ["zoom"],
                            // zoom is 5 (or less) -> circle radius will be 1px
                            5, 1,
                            // zoom is 10 (or greater) -> circle radius will be 5px
                            12, 4
                        ],
                        'circle-stroke-width': [
                            "interpolate", ["linear"], ["zoom"],
                            // zoom is 5 (or less) -> circle radius will be 1px
                            5, 1,
                            // zoom is 10 (or greater) -> circle radius will be 5px
                            12, 6
                        ],

                        'circle-color': '#d75d00',
                        'circle-stroke-color': '#d75d00'

                    }
                });

            })

            this.map.on('click', 'selectedFeature', e => {
                if (this.map.getSource('userSelected') !== undefined) {
                    this.map.removeLayer('userSelected');
                    this.map.removeSource('userSelected');
                    this.map.removeLayer('selectedFeature');
                    this.map.removeSource('selectedFeature');
                }

                let clickedFeature = e.features[0];

                let lines;
                let relatedPoints;

                if (clickedFeature.properties.related !== undefined) {
                    let related = clickedFeature.properties.related.slice(1, -1).split(',').map(str => parseInt(str));
                    relatedPoints = this.state.data.features.filter(feature => {
                        return (related.includes(feature.properties.id))
                    })


                    lines = {
                        "type": "FeatureCollection",
                        "features": relatedPoints.map(feature => {
                            let featureObject = {
                                "type": "Feature",
                                "properties": feature.properties,
                                "geometry": {
                                    "type": "LineString",
                                    "coordinates": [clickedFeature.geometry.coordinates, feature.geometry.coordinates]
                                }
                            }
                            return (featureObject)
                        })
                    }
                }

                else {
                    lines = {
                        "type": "FeatureCollection",
                        "features": []
                    };
                    relatedPoints = [];
                }

                this.map.addLayer({
                    id: 'userSelected',
                    source: {
                        'type': 'geojson',
                        'data': lines,
                        lineMetrics: true,
                    },
                    type: 'line',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {

                        'line-width': 2,
                        'line-gradient': [
                            'interpolate',
                            ['linear'],
                            ['line-progress'],
                            0, "#d75d00",
                            0.1, "#ea6400",
                            0.3, "#ff8326",
                            0.5, "#ff9b51",
                            0.7, "#ffa867",
                            1, "#ffbb88"
                        ]
                    }
                });



                this.map.addLayer({
                    id: 'selectedFeature',
                    source: {
                        type: 'geojson',
                        data: turf.featureCollection([...relatedPoints, clickedFeature])
                    },
                    type: 'circle',
                    paint: {

                        'circle-radius': [
                            "interpolate", ["linear"], ["zoom"],
                            // zoom is 5 (or less) -> circle radius will be 1px
                            5, 1,
                            // zoom is 10 (or greater) -> circle radius will be 5px
                            12, 4
                        ],
                        'circle-stroke-width': [
                            "interpolate", ["linear"], ["zoom"],
                            // zoom is 5 (or less) -> circle radius will be 1px
                            5, 1,
                            // zoom is 10 (or greater) -> circle radius will be 5px
                            12, 6
                        ],

                        'circle-color': '#d75d00',
                        'circle-stroke-color': '#d75d00'

                    }
                });

            })

            this.map.on('touchend', 'userActivities', e => {
                if (this.map.getSource('userSelected') !== undefined) {
                    this.map.removeLayer('userSelected');
                    this.map.removeSource('userSelected');
                    this.map.removeLayer('selectedFeature');
                    this.map.removeSource('selectedFeature');
                }

                let clickedFeature = e.features[0];

                let lines;
                let relatedPoints;

                if (clickedFeature.properties.related !== undefined) {
                    let related = clickedFeature.properties.related.slice(1, -1).split(',').map(str => parseInt(str));
                    relatedPoints = this.state.data.features.filter(feature => {
                        return (related.includes(feature.properties.id))
                    })


                    lines = {
                        "type": "FeatureCollection",
                        "features": relatedPoints.map(feature => {
                            let featureObject = {
                                "type": "Feature",
                                "properties": feature.properties,
                                "geometry": {
                                    "type": "LineString",
                                    "coordinates": [clickedFeature.geometry.coordinates, feature.geometry.coordinates]
                                }
                            }
                            return (featureObject)
                        })
                    }
                }

                else {
                    lines = {
                        "type": "FeatureCollection",
                        "features": []
                    };
                    relatedPoints = [];
                }

                this.map.addLayer({
                    id: 'userSelected',
                    source: {
                        'type': 'geojson',
                        'data': lines,
                        lineMetrics: true,
                    },
                    type: 'line',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {

                        'line-width': 2,
                        'line-gradient': [
                            'interpolate',
                            ['linear'],
                            ['line-progress'],
                            0, "#d75d00",
                            0.1, "#ea6400",
                            0.3, "#ff8326",
                            0.5, "#ff9b51",
                            0.7, "#ffa867",
                            1, "#ffbb88"
                        ]
                    }
                });



                this.map.addLayer({
                    id: 'selectedFeature',
                    source: {
                        type: 'geojson',
                        data: turf.featureCollection([...relatedPoints, clickedFeature])
                    },
                    type: 'circle',
                    paint: {

                        'circle-radius': [
                            "interpolate", ["linear"], ["zoom"],
                            // zoom is 5 (or less) -> circle radius will be 1px
                            5, 1,
                            // zoom is 10 (or greater) -> circle radius will be 5px
                            12, 4
                        ],
                        'circle-stroke-width': [
                            "interpolate", ["linear"], ["zoom"],
                            // zoom is 5 (or less) -> circle radius will be 1px
                            5, 1,
                            // zoom is 10 (or greater) -> circle radius will be 5px
                            12, 6
                        ],

                        'circle-color': '#000',
                        'circle-stroke-color': '#d75d00'

                    }
                });

            })

            this.map.on('draw.create', e => {
                let newPoint = e.features[0];
                this.toggleModal({ type: 'edit', title: 'Añade una iniciativa', data: newPoint });

            });
        });
    }

    componentWillUnmount() {
        this.map.remove();
    }

    render() {
        const style = {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '100%'
        };
        const initialStep = 0,
            steps = [
                {
                    element: '.navbar-color-on-scroll',
                    intro: 'Bienvenido a PIC Málaga. En esta barra encontrarás los filtros necesarios para buscar las iniciativas creadas en la ciudad.',
                },
                {
                    element: '.mapbox-gl-draw_point',
                    intro: 'Utiliza el lápiz para añadir la iniciativa al mapa. Antes deberás estar registrado en la plataforma.',
                },

            ];

        return (
            <div style={style} ref={el => this.mapContainer = el} >
            <Header title={this.state.site.title} nameList={this.state.data.features.map((feature) => feature.properties.name)} buttons={this.state.site.buttons} handler={this.toggleModal} email={this.state.user.email} printData={this.printData} gotoselected={this.gotoselected} mapData={[["Name", "Description", "Website", "Lat", "Long"]]} close={this.closeSidebar} />
            <Modal type={this.state.modal.type} removeFilters={this.removeFilters} title={this.state.modal.title} id={this.state.modal.id} subtitle={this.state.modal.subtitle} description={this.state.modal.description} email={this.state.user.email} handler={this.toggleModal} handleFilters={this.handleFilters} userLog={this.userLog} options={this.state.modal.options} data={this.state.modal.data} collection={this.state.site.collection} points={this.state.data.features}/>
            <Sidebar handler={this.toggleModal} featureData={this.state.featureData} collection={this.state.site.collection} userEmail={this.state.user.email} show={this.state.featureData.show} closeSidebar={this.closeSidebar} />
            <NotificationContainer />
            <Steps
                enabled={this.state.stepsEnabled}
                steps={steps}
                initialStep={initialStep}
                onExit={this.onExit}
                options={{
                    nextLabel: 'Siguiente',
                    prevLabel: 'Anterior',
                    skipLabel: 'Saltar',
                    doneLabel: 'Hecho'
                }}
            />
            </div>
        );
    }
}

export {
    App as default, storage
}
