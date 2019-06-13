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
                buttons: [{ name: 'Temática', description: 'Visualiza en el mapa el tipo de iniciativa por temática que ha sido llevada a cabo por los ciudadanos.', id: 'purpose', filters: ['Accesibilidad', 'Arte urbano', 'Arquitectura', 'Autogestión', 'Cuidado', 'Culto', 'Cultura', 'Deporte', 'Derechos sociales', 'Diversidad', 'Educación', 'Integración', 'Igualdad', 'Mediación', 'Medio ambiente', 'Movilidad sostenible', 'Participación ciudadana', 'Patrimonio material', 'Patrimonio cultural inmaterial', 'Personas mayores', 'Política social',  'Urbanismo', 'Salud'] }, { name: 'Zonas', description: 'Si quieres enterarte de las iniciativas que han surgido en tu distrito o en cualquier otro, haz uso de este filtro y las verás en el mapa.', id: 'district', filters: district.features.map((feature) => feature.properties.name) }]
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

// const data_sport = {
//   "type": "FeatureCollection",
//   "features": [
//   { "type": "Feature", "properties": { "id": 21, "name":"bike" }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ -4.445852597663771, 36.711033630771375 ], [ -4.445135690452562, 36.70989852768696 ], [ -4.44442834200417, 36.708866181302831 ], [ -4.444179814170952, 36.708482337233505 ], [ -4.443037542014427, 36.706907531059549 ], [ -4.441785344085517, 36.704990999114919 ], [ -4.441159245121063, 36.704025564070498 ], [ -4.440767335845603, 36.703523729022649 ], [ -4.440442337909856, 36.703275201189435 ], [ -4.439405212144308, 36.70218072284699 ], [ -4.438635731737612, 36.701425580584512 ], [ -4.436222144126545, 36.70028808780939 ], [ -4.436226923507953, 36.700283308428006 ], [ -4.436226923507953, 36.700283308428006 ] ] ] } },
//   { "type": "Feature", "properties": { "id": 22, "name":"bike" }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ -4.436375084331603, 36.700359778530533 ], [ -4.436293834847666, 36.700531836261227 ], [ -4.436150453405424, 36.700543784714746 ], [ -4.436045307014447, 36.700574850693897 ], [ -4.43598795443755, 36.700615475435868 ], [ -4.435861300830237, 36.700586799147416 ], [ -4.435777661655596, 36.700586799147416 ], [ -4.435737036913627, 36.700589188838123 ], [ -4.435679684336731, 36.700617865126567 ], [ -4.435455053410553, 36.700472093993625 ], [ -4.434974725579043, 36.700916576464572 ], [ -4.434975293102768, 36.700916304027999 ] ] ] } },
//   { "type": "Feature", "properties": { "id": 25, "name":"bike" }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ -4.419635257898319, 36.717488975711646 ], [ -4.418508275974476, 36.717327978293959 ], [ -4.413819226184201, 36.718615957635492 ], [ -4.4131148624818, 36.717871344578668 ], [ -4.413094737804588, 36.717569474420493 ], [ -4.415227953589005, 36.71396715719964 ], [ -4.415187704234582, 36.714027531231274 ] ] ] } },
//   { "type": "Feature", "properties": { "id": 6, "name": "parkour" }, "geometry": { "type": "Point", "coordinates": [ -4.444313611851205, 36.692268466360197 ] } },
//   { "type": "Feature", "properties": { "id": 7 , "name": "parkour"}, "geometry": { "type": "Point", "coordinates": [ -4.42565667861847, 36.716594997677795 ] } },
//   { "type": "Feature", "properties": { "id": 8, "name": "parkour" }, "geometry": { "type": "Point", "coordinates": [ -4.426302749097907, 36.716551047305046 ] } },
//   { "type": "Feature", "properties": { "id": 12, "name": "parkour" }, "geometry": { "type": "Point", "coordinates": [ -4.415655762280471, 36.718832696936552 ] } },
//   { "type": "Feature", "properties": { "id": 23, "name": "running"}, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ -4.445560873316006, 36.684192697265239 ], [ -4.445037631708508, 36.685118432416971 ], [ -4.444886696629421, 36.685198931125818 ], [ -4.444474140746586, 36.685923419505428 ], [ -4.444494265423797, 36.685943544182642 ], [ -4.444031397847933, 36.686818967641337 ], [ -4.443860338091636, 36.68688940401158 ], [ -4.443427657531589, 36.687684328761435 ], [ -4.443437719870195, 36.687815139163305 ], [ -4.442914478262696, 36.688740874315037 ], [ -4.442713231490582, 36.688841497701091 ], [ -4.442159802867266, 36.68979741986864 ], [ -4.442159802867266, 36.689908105593304 ], [ -4.441988743110969, 36.690230100428685 ], [ -4.441797558677459, 36.690350848491953 ], [ -4.44167177944489, 36.690612469295708 ], [ -4.441691904122102, 36.690778497882704 ], [ -4.441224005376935, 36.691573422632551 ], [ -4.441068039128546, 36.691628765494883 ], [ -4.440650452076408, 36.692363316213104 ], [ -4.440675607922922, 36.692519282461497 ], [ -4.440509579335928, 36.692780903265245 ], [ -4.440353613087539, 36.692841277296878 ], [ -4.439915901358189, 36.693590921523004 ], [ -4.439714654586073, 36.694053789098867 ], [ -4.439538563660473, 36.694114163130507 ], [ -4.439105883100426, 36.694778277478484 ], [ -4.439105883100426, 36.694959399573385 ], [ -4.4388845116511, 36.69526126973156 ], [ -4.438703389556196, 36.695331706101797 ], [ -4.438230459641727, 36.696015945126987 ], [ -4.438230459641727, 36.696176942544675 ], [ -4.437687093357018, 36.696981929633139 ], [ -4.437505971262114, 36.697022178987559 ], [ -4.436962604977404, 36.697766792044384 ], [ -4.435574002249814, 36.699678636379474 ], [ -4.435332506123276, 36.699598137670627 ], [ -4.435030635965103, 36.699598137670627 ], [ -4.434889763224623, 36.699759135088321 ], [ -4.434809264515777, 36.699960381860436 ], [ -4.434869638547411, 36.700222002664184 ], [ -4.433320038402128, 36.702435717157449 ], [ -4.431126448586077, 36.705373920030326 ], [ -4.429466162716129, 36.70727570202682 ], [ -4.426477648150224, 36.710606336105322 ], [ -4.42648771048883, 36.710626460782528 ] ] ] } },
//   { "type": "Feature", "properties": { "id": 30, "name": "running"}, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ -4.4264273364572, 36.710646585459735 ], [ -4.426296526055325, 36.715979624920777 ], [ -4.426205965007876, 36.717851219901434 ], [ -4.426165715653453, 36.718153090059609 ], [ -4.425873907833886, 36.718917827793646 ], [ -4.425733035093406, 36.719581942141623 ], [ -4.425622349368743, 36.720286305844027 ], [ -4.425672661061771, 36.720950420192004 ], [ -4.425823596140858, 36.721845968327912 ], [ -4.426477648150231, 36.725971527156283 ] ] ] } },
//   { "type": "Feature", "properties": { "id": 31, "name": "running" }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ -4.42565253638456, 36.711713193351962 ], [ -4.425783346786434, 36.714591022193197 ], [ -4.425753159770617, 36.715738128794257 ], [ -4.425682723400377, 36.716683988623195 ], [ -4.425607255860834, 36.717740534176791 ], [ -4.425521725982685, 36.718465022556408 ], [ -4.425320479210571, 36.719204604443931 ], [ -4.425129294777061, 36.720095121410537 ], [ -4.425229918163119, 36.721121479948323 ], [ -4.425642474045953, 36.726041963526527 ] ] ] } },
//   { "type": "Feature", "properties": { "id": 33, "name": "running" }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ -4.419601725065577, 36.717632737370501 ], [ -4.418882293083513, 36.717288661205167 ], [ -4.413658591300696, 36.718649326040811 ], [ -4.413017358447117, 36.717804775453168 ], [ -4.41300171862142, 36.717742216150384 ], [ -4.415206934044705, 36.714223255368545 ], [ -4.414534421539732, 36.713691501294846 ], [ -4.413032998272812, 36.710188180338697 ], [ -4.413001718621418, 36.709586047049356 ], [ -4.413181576616934, 36.708905714631534 ], [ -4.413650771387846, 36.708100263608138 ] ] ] } },
//   { "type": "Feature", "properties": { "id": null, "name": "yoga" }, "geometry": { "type": "Point", "coordinates": [ -4.413995311857809, 36.712571574445178 ] } },
//   { "type": "Feature", "properties": { "id": null, "name": "yoga" }, "geometry": { "type": "Point", "coordinates": [ -4.432187840371991, 36.706106176787976 ] } },
//   { "type": "Feature", "properties": { "id": null, "name": "yoga" }, "geometry": { "type": "Point", "coordinates": [ -4.435970785809722, 36.699692364750348 ] } }
//   ]
//   }

export {
    App as default, storage
}
