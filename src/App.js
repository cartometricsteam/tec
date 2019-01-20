import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import * as turf from '@turf/turf';
import * as firebase from 'firebase';

import Header from './Header';
import Sidebar from './Sidebar';
import Modal from './Modal';
import district from './districts.json';
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
firebase.firestore().settings({ timestampsInSnapshots: true });
const data = {
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature", "properties": { "id": 1, related: [2,3,4,5,6,7,8,9,10,11,12,16,17,18,19,20,21,22,23,24 ], 'nexus': 'true', "name": "BOSQUE URBANO MALAGA", "caracter": "NO REGLADO", "date": "2016/01/23", "mail": "sergioreyes@uma.es", 'url': "http://bosqueurbanomalaga.org/", "address": "CL BODEGUEROS, 9", "facebook": "https://www.facebook.com/BosqueUrbanoMalaga/", "twitter": "https://twitter.com/BosqueUrbanoMA", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.444496325793976, 36.705108612290161] } },
    { "type": "Feature", "properties": { "id": 2, related:[1] , "name": "A.V. LA COOPERACION", "caracter": "REGLADO", "date": "1986/06/06", "mail": "vegarcia@telefonica.net", 'url': "http://www.cruzdehumilladero.org/", "address": "nCL ARA, 1", "phone": "952329332", "facebook": "https://www.facebook.com/lacooperacion/", "twitter": "https://twitter.com/lacooperacion", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.443624993818503, 36.709371880868453] } },
    { "type": "Feature", "properties": { "id": 3, related:[1] , "name": "MAS LIBROS VERDES", "caracter": "REGLADO", "date": "2013/02/01", "mail": "comunicacion@maslibroslibres.com; info@maslibroslibres.com", 'url': "http://maslibroslibres.com/", "address": "nCL ARA, 1", "phone": "635033746", "facebook": "https://www.facebook.com/maslibroslibres/", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.443570622540628, 36.709285175546668] } },
    { "type": "Feature", "properties": { "id": 4, related:[1] , "name": "A.V. EL DUENDE", "caracter": "REGLADO", "date": "2002/05/22", "address": "nCL  RODOLFO HALFFTER, 1", "phone": "952335746; 645252718", "facebook": "https://www.facebook.com/Lagunillas-El-futuro-est%C3%A1-muy-Grease-270520043111026/", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.455660443220408, 36.702655698390629] } },
    { "type": "Feature", "properties": { "id": 5, related:[1,9] , "name": "HUELIN TV", "caracter": "NO REGLADO", "mail": "huelinweb@gmail.com", 'url': "http://www.actiweb.es/huelin/", "address": "CL AYALA, 96", "phone": "687324502", "facebook": "https://www.facebook.com/HuelinTV/", "twitter": "https://twitter.com/HuelinTV?lang=es", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.437291768762851, 36.7043183051019] } },
    { "type": "Feature", "properties": { "id": 6, related:[1] , "name": "MERKAETICO EL CENACHO", "caracter": "NO REGLADO", "date": "2015/01/01", "mail": "merkaeticoelcenacho@gmail.com", 'url': "http://www.merkaeticoelcenacho.org/", "address": "CL REBOUL, 36", "phone": "951211542", "facebook": "https://www.facebook.com/merkaeticoelcenacho/", "twitter": "https://twitter.com/merkaetico", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.441305838454712, 36.709083491045583] } },
    { "type": "Feature", "properties": { "id": 7, related:[1] , "name": "A.V. EL TORCAL", "caracter": "REGLADO", "date": "1987/05/15", "mail": "aavveltorcal@gmail.com", "address": "CL NIDO DEL MUSEO, 12", "phone": "952360048", "twitter": "https://twitter.com/aveltorcal", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.448639494994418, 36.700038009581284] } },
    { "type": "Feature", "properties": { "id": 8, related:[1] , "name": "A.V. SANTA PAULA DE MALAGA", "caracter": "REGLADO", "date": "2004/07/14", "mail": "aavvsantapaula@hotmail.es", "address": "CL  FRANCISCO PADILLA , 13", "phone": "952172247; 652954389", "facebook": "https://www.facebook.com/aavvsantapaulamalaga29004/", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.448337367036948, 36.692890221267334] } },
    { "type": "Feature", "properties": { "id": 9, related:[1,5,14,15]
 , "name": "A.V. TORRIJOS", "caracter": "REGLADO", "date": "1986/02/07", "mail": "aavvtorrijos1979@gmail.com", 'url': "http://avvtorrijos.blogspot.com/", "address": "nCL EMILIO DE LA CERDA, 24", "phone": "952326246; 951326246", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.437759949570668, 36.702480151795321] } },
    { "type": "Feature", "properties": { "id": 10, related:[1,11] , "name": "ASOC. RUEDAS REDONDAS", "caracter": "REGLADO", "date": "2001/11/21", "mail": "hola@ruedasredondas.org; info@ruedasredondas.org", 'url': "www.ruedasredondas.org", "address": "CL POETA CONCHA MENDEZ, 3", "phone": "952254854; 744460809", "facebook": "https://www.facebook.com/ruedasredondas/", "twitter": "https://twitter.com/Ruedasredondas", "zone": "CENTRO" }, "geometry": { "type": "Point", "coordinates": [-4.41536721282954, 36.726747961782095] } },
    { "type": "Feature", "properties": { "id": 11, related:[1,10] , "name": "AGRUPACION DE DESARROLLO MÁLAGA ACCESIBLE", "caracter": "NO REGLADO", "mail": "ad.malagaaccesible@gmail.com", "address": "CL CORREGIDOR FRANCISCO DE MOLINA, 1", "facebook": "https://www.facebook.com/admalagaaccesi1/", "twitter": "https://twitter.com/admalagaaccesi1", "zone": null }, "geometry": { "type": "Point", "coordinates": [-4.44790432839606, 36.713618747380316] } },
    { "type": "Feature", "properties": { "id": 12, related:[1,11,13], "name": "RIZOMA date", "caracter": "NO REGLADO", "mail": "info@rizoma.org", 'url': "https://rizomafundacion.wordpress.com/; http://rizoma.org/rizoma_fundacion.html", "address": "CL CUEVA DE MENGA, 8", "phone": "952201520", "facebook": "https://www.facebook.com/RizomaFundaci%C3%B3n-145041939180024/", "twitter": "https://twitter.com/rizomaf", "zone": "ESTE" }, "geometry": { "type": "Point", "coordinates": [-4.347121562295649, 36.719517848604973] } },
    { "type": "Feature", "properties": { "id": 13, related:[12] , "name": "ASOC. ATOLMI TERAPIA OCUPACIONAL Y LABORAL DE MINUSVALIDOS", "caracter": "REGLADO", "date": "1985/10/18", "mail": "asociacionatolmi@gmail.com", 'url': "https://www.atolmi.org/", "address": "AV CARLOS HAYA, 29", "phone": "952613543; 952271383", "facebook": "https://www.facebook.com/Atolmi-469816123366962/", "twitter": "https://twitter.com/AsocATOLMI", "zone": "ESTE" }, "geometry": { "type": "Point", "coordinates": [-4.445329606806627, 36.721668202299441] } },
    { "type": "Feature", "properties": { "id": 14, related: [9] , "name": "nFEDERACION TERRITORIAL AA.VV. CC. Y UU. DEL MUNICIPIO DE MALAGA Y SU PROVINCIA 'UNIDAD'", "caracter": "REGLADO", "date": "1987/05/15", "mail": "conchaunidad@gmail.com; federacionunidad@gmail.com", "address": "nCL MERCED, 1 - LOC. 8", "phone": "952228702", "facebook": "https://www.facebook.com/federacion.aavvunidad/", "zone": "CENTRO" }, "geometry": { "type": "Point", "coordinates": [-4.417544103268098, 36.724396317359194] } },
    { "type": "Feature", "properties": { "id": 15, related: [9], "name": "PLATAFORMA 'SALVEMOS LA PLAYA DE SAN ANDRÉS'", "caracter": "NO REGLADO", "date": "2017/05/23", "address": "PSO MARITIMO ANTONIO MACHADO, 62", "facebook": "https://www.facebook.com/SalvemosLaPlayaDeSanAndres/", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.432670972162008, 36.702720412027325] } },
    { "type": "Feature", "properties": { "id": 16, related: [1], "name": "ASOC. DE CONSUMIDORES Y USUARIOS EN ACCION DE MALAGA - FACUA", "caracter": "REGLADO", "date": "1992/01/27", "mail": "malaga@facua.org", 'url': "https://www.facua.org/malaga", "address": "CL PEDRO DE TOLEDO, 1", "phone": "952276908; 952254607", "facebook": "https://www.facebook.com/consumidoresenaccion/", "twitter": "https://twitter.com/facua", "zone": "CENTRO" }, "geometry": { "type": "Point", "coordinates": [-4.418211290183656, 36.72080043415211] } },
    { "type": "Feature", "properties": { "id": 17, related: [1], "name": "FEDERACIÓN PROVINCIAL DE AA.VV. SOLIDARIDAD", "caracter": "REGLADO", "date": "1996/05/22", "mail": "fdsolidaridad@hotamil.com", "address": "CL SHERLOCK HOLMES, 3 LC", "phone": "952339481", "facebook": "https://www.facebook.com/SolidaridadMalaga/", "twitter": "https://twitter.com/fdsolidaridad", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.461290282139374, 36.710567772007167] } },
    { "type": "Feature", "properties": { "id": 18, related: [1], "name": "ASOCIACION VECINAL - LAGUNILLAS POR VENIR", "caracter": "REGLADO", "date": "2017/04/26", "mail": "rosasabina@hotmail.com", "address": "CL VITAL AZA, 18", "phone": "744463848", "zone": "CENTRO" }, "geometry": { "type": "Point", "coordinates": [-4.416064123305687, 36.725286602145445] } },
    { "type": "Feature", "properties": { "id": 19, related: [1], "name": "FEDERACION DE COMERCIO DE MALAGA - FECOMA", "caracter": "NO REGLADO", "mail": "sec@fecoma.com", 'url': "http://fecoma.com/", "address": "CL ALFONSO REYES, 1", "phone": "952228844", "facebook": "https://www.facebook.com/fecomamalaga/", "twitter": "https://twitter.com/FecomaMalaga", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.427106410033319, 36.711184702705836] } },
    { "type": "Feature", "properties": { "id": 20, related: [], "name": "A.V. MALAGA CENTRO", "caracter": "REGLADO", "date": "1998/03/30", "mail": "malagacentrovecinos@gmail.com; comunicacion@malagavecinos.es", "address": "CL CARRETERIA, 101 04 B", "phone": "605985951", "facebook": "https://www.facebook.com/MALAGA-CENTRO-VECINOS-282062268479431/", "twitter": "https://twitter.com/Malaga_Centro", "zone": "CENTRO" }, "geometry": { "type": "Point", "coordinates": [-4.421191832927384, 36.72434268071526] } },
    { "type": "Feature", "properties": { "id": 21, related: [1], "name": "ASOC. 'ECOLOGISTAS EN ACCION - CIUDAD DE MALAGA'", "caracter": "REGLADO", "date": "2001/10/08", "mail": "mmalaga@ecologistasenaccion.org; malaga.ciudad@ecologistasenaccion.org", "address": "CL LEOPOLDO ALAS CLARIN, 7", "phone": "952355383; 660227308", "facebook": "https://www.facebook.com/eeamalaga/", "twitter": "https://twitter.com/EeaMalaga", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.433661561610068, 36.707082759565466] } },
    { "type": "Feature", "properties": { "id": 22, related: [1], "name": "ECONOMIA DEL BIEN COMUN MALAGA", "caracter": "NO REGLADO", "mail": "ebcmalaga@gmail.com; malaga@economia-del-bien-comun.es", 'url': "https://ebcmalaga.wordpress.com/", "address": "AV ARROYO DE LOS ANGELES, 50", "facebook": "https://www.facebook.com/EBC-M%C3%A1laga-1604767003159608/", "twitter": "https://twitter.com/MalagaEBC", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.431876108385918, 36.730528328244375] } },
    { "type": "Feature", "properties": { "id": 23, related: [1], "name": "ASOC. DE CIENCIAS AMBIENTALES MALAKA AMBIENTAL", "caracter": "REGLADO", "mail": "malakaambiental@gmail.com", 'url': "http://malakaambiental.blogspot.com/", "address": "BL LOUIS PASTEUR, 31", "phone": "952131864", "facebook": "https://www.facebook.com/Malaka-Ambiental-Ciencias-Ambientales-157140480993268/", "twitter": "https://twitter.com/MalakaAmbiental", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.472552455325802, 36.715482140858477] } },
    { "type": "Feature", "properties": { "id": 24, related: [1], "name": "A.V. LA UNIDAD NUEVA MALAGA", "caracter": "REGLADO", "date": "1985/01/31", "mail": "av_unidad@hotmail.com", "address": "CMNO CASTILLEJOS, 6", "phone": "952306126", "facebook": "https://www.facebook.com/unidadnuevamalaga/", "twitter": "https://twitter.com/avv_unidad", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.445332683299543, 36.725561976717756] } },
    { "type": "Feature", "properties": { "id": 25, related: [26,27,28,29,30,31,32,33,34], 'nexus': 'true', "name": "J-AULAS ABIERTAS", "caracter": "REGLADO", "mail": "jaulasabiertasavolar@gmail.com", 'url': "http://www.j-aulasabiertas.com/", "address": "CL LEON TOLSTOI, 0", "phone": "666458021", "facebook": "https://www.facebook.com/jaulasabiertasumaentransicion/", "twitter": "https://twitter.com/J_AulasAbiertas", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.468137883503629, 36.715247318512411] } },
    { "type": "Feature", "properties": { "id": 26, related: [25], "name": "ASOC. PROVINCIAL SINDROME DE DOWN DE MALAGA", "caracter": "REGLADO", "date": "1992/02/22", "mail": "downmalaga@downmalaga.com", 'url': "http://www.downmalaga.com/", "address": "CL PIERROT, 27", "phone": "952274040; 665678204; 952274050", "facebook": "https://www.facebook.com/DownMalaga/", "twitter": "https://twitter.com/DownMalaga", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.465632817194586, 36.711950252748572] } },
    { "type": "Feature", "properties": { "id": 27, related: [25], "name": "ASOC. MUJERES EN zone DE CONFLICTO. MZC", "caracter": "REGLADO", "date": "2001/01/22", "mail": "malaga@mzc.es", 'url': "http://www.mzc.es/", "address": "AV JANE BOWLES, 0 2B", "phone": "957082000; 635661111", "facebook": "https://www.facebook.com/EducacionparaelDesarrollo/", "twitter": "https://twitter.com/ongdmzc", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.426358401367077, 36.743472471169724] } },
    { "type": "Feature", "properties": { "id": 28, related: [25], "name": "ASOC. EL CAMINITO", "caracter": "REGLADO", "date": "2012/03/08", "mail": "info@elcaminito.org", 'url': "http://www.elcaminito.org/", "address": "CL ZURBARAN, 3", "phone": "699010572", "facebook": "https://www.facebook.com/huertourbanoElCaminito/", "zone": "ESTE" }, "geometry": { "type": "Point", "coordinates": [-4.417441817537039, 36.733033079030967] } },
    { "type": "Feature", "properties": { "id": 29, related: [25], "name": "COMUNIDAD SALVAR ARRAIJANAL", "caracter": "NO REGLADO", 'url': "http://parquenaturalmalaga.com/", "facebook": "https://www.facebook.com/Salvarelarraijanal/", "twitter": "https://twitter.com/SalvaArraijanal", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.466620985066098, 36.661557633968734] } },
    { "type": "Feature", "properties": { "id": 30, related: [25], "name": "COLECTIVO CAFE FEMINISTA MALAGA", "caracter": "NO REGLADO", "mail": "cafefeministamalaga@gmail.com", "address": "BL LOUIS PASTEUR, 25", "facebook": "https://www.facebook.com/CafeFeministaMalaga/", "twitter": "https://twitter.com/MalagaCafe", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.469393844122569, 36.716217775662933] } },
    { "type": "Feature", "properties": { "id": 31, related: [25], "name": "ASOC. ECOLUCIONA", "caracter": "REGLADO", "date": "2013/12/04", "mail": "ecoluciona.malaga@gmall.com", 'url': "https://ecolucionamalaga.com/", "address": "CL COMANDANTE ROMAN, 6 04 D", "phone": "695011907; 626910321", "facebook": "https://www.facebook.com/EcolucionaMalaga/", "twitter": "https://twitter.com/ECOluCiona", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.440067544913511, 36.700969982675112] } },
    { "type": "Feature", "properties": { "id": 32, related: [25], "name": "ASOC. CULTURAL 'EL FUTURO ESTA MUY GREASE'", "caracter": 'NO REGLADO', "address": "CL AGUSTIN MORETO, 1", "facebook": "https://www.facebook.com/Lagunillas-El-futuro-est%C3%A1-muy-Grease-270520043111026/", "zone": "CENTRO" }, "geometry": { "type": "Point", "coordinates": [-4.415091757952935, 36.726012342773124] } },
    { "type": "Feature", "properties": { "id": 33, related: [25], "name": "PLATAFORMA DE COMUNICACION COMUNITARIA ONDA COLOR", "caracter": "NO REGLADO", "date": "2010/07/29", "mail": "participacion@ondacolor.org", 'url': "http://www.ondacolor.org/", "address": "CL DR. GALVEZ MOLL, 5", "phone": "952611567; 676590199", "facebook": "https://www.facebook.com/ondacolormlg/", "twitter": "https://twitter.com/ondacolor", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.427242052041144, 36.73903996550856] } },
    { "type": "Feature", "properties": { "id": 34, related: [25], "name": "COMUNIDAD YES WE TECH", "caracter": "NO REGLADO", "mail": "organiza@yeswetech.org;", 'url': "https://yeswetech.org/", "address": "BL LOUIS PASTEUR, 47", "facebook": "https://www.facebook.com/groups/yeswetech/", "twitter": "https://twitter.com/yeswetech_", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.497080463325609, 36.718700345639178] } },
    { "type": "Feature", "properties": { "id": 35, related: [36,37,38,39,40,41,42,43], 'nexus': 'true', "name": "ASOC. FANTASIA EN LAGUNILLAS", "caracter": "REGLADO", "mail": "fantasiaenlagunillas@gmail.com", "address": "CL ALTOZANO, 0", "phone": "653456963; 605180819", "facebook": "https://www.facebook.com/fantasiaenlagunillas/", "zone": "CENTRO" }, "geometry": { "type": "Point", "coordinates": [-4.415198817682583, 36.726825153373291] } },
    { "type": "Feature", "properties": { "id": 36, related: [35], "name": "ASOC. ACCEM", "caracter": "REGLADO", "mail": "malaga@accem.es", 'url': "https://www.accem.es/tag/malaga/", "address": "CJON PERICON, 1", "phone": "952224076; 687499067", "facebook": "https://www.facebook.com/accem/", "twitter": "https://twitter.com/Accem_ong", "zone": "CENTRO" }, "geometry": { "type": "Point", "coordinates": [-4.423525010480852, 36.722586625327494] } },
    { "type": "Feature", "properties": { "id": 37, related: [35], "name": "ASOC. GRUPO SCOUTS 124 MARISTAS - ABEL RELLOSO", "caracter": "REGLADO", "mail": "coordinador@gruposcout124.net; malaga@scoutsdeandalucia.org", 'url': "http://malaga.scoutsdeandalucia.org/", "address": "CL VICTORIA, 108", "phone": "659408447; 630454699", "facebook": "https://www.facebook.com/Delegaci%C3%B3n-Scout-de-M%C3%A1laga-ASDE-Scouts-de-Andaluc%C3%ADa-347392798800244/", "twitter": "https://twitter.com/GS124Maristas?lang=es", "zone": "CENTRO" }, "geometry": { "type": "Point", "coordinates": [-4.4139573000175, 36.726560740179266] } },
    { "type": "Feature", "properties": { "id": 38, related: [35], "name": "CLUB DE LEONES MALAGA ILUSION", "caracter": "REGLADO", "mail": "malagailusion.clubleones@gmail.com", 'url': "http://malagailusion-clubleones.blogspot.com.es", "address": "CL LA ERA, 18 A2 4 E", "phone": "633456856", "facebook": "https://www.facebook.com/malagailusion.clubleones/", "twitter": "https://twitter.com/IlusionMalaga", "zone": "CENTRO" }, "geometry": { "type": "Point", "coordinates": [-4.402009403379797, 36.733567555232987] } },
    { "type": "Feature", "properties": { "id": 39, related: [35], "name": "MAS MUSEO PICASSO", "caracter": "NO REGLADO", "mail": "info@museopicassomalaga.org", 'url': "http://www.masmuseopicasso.org/", "address": "CL SAN AGUSTIN, 8", "phone": "952127600", "facebook": "https://www.facebook.com/museopicassomalaga/", "twitter": "https://twitter.com/mPICASSOm", "zone": "CENTRO" }, "geometry": { "type": "Point", "coordinates": [-4.418444015074481, 36.721713586691983] } },
    { "type": "Feature", "properties": { "id": 40, related: [35], "name": "ASOC. DE MUJERES KARTIO", "caracter": "REGLADO", "mail": "mujereskartio@gmail.com; cbelmonteh@telefonica.net", 'url': "http://mujereskartio.blogspot.com/", "address": "PSO MIRAMAR 10 3 A", "phone": "952265215; 952220347; 630033167; 649048889", "zone": "ESTE" }, "geometry": { "type": "Point", "coordinates": [-4.39665490075942, 36.724386905382417] } },
    { "type": "Feature", "properties": { "id": 41, related: [35], "name": "FACULTAD CC. DE LA EDUCACION", "caracter": "NO REGLADO", "mail": "secretariofaceduma@gmail.com", 'url': "http://www.uma.es/facultad-de-ciencias-de-la-educacion", "address": "BL LOUIS PASTEUR, 25", "phone": "952131116", "facebook": "https://www.facebook.com/FacultadEducacionUMA/https://www.facebook.com/FacultadEducacionUMA/", "twitter": "https://twitter.com/Educacion_UMA", "zone": "OESTE" }, "geometry": { "type": "Point", "coordinates": [-4.469018365615561, 36.716429433658377] } },
    { "type": "Feature", "properties": { "id": 42, related: [35], "name": "AMPA FAMILIAS CON GRACIA DEL CENTRO NTRA. SRA. DE GRACIA", "caracter": "REGLADO", "mail": "carmenparedes81@gmail.com", 'url': "https://www.ceipelgracia.com/", "address": "CL FERRANDIZ, 2", "phone": "951298894; 687988943; 951298895", "facebook": "https://www.facebook.com/ColegioElGracia/", "twitter": "https://twitter.com/ColegioElGracia", "zone": "CENTRO" }, "geometry": { "type": "Point", "coordinates": [-4.413045867882194, 36.726839194524302] } },
    { "type": "Feature", "properties": { "id": 43, related: [35], "name": "CENTRO DE SALUD VICTORIA", "caracter": "NO REGLADO", 'url': "http://centrodesaludvictoria-malaga.blogspot.com/", "zone": "CENTRO" }, "geometry": { "type": "Point", "coordinates": [-4.415327619418009, 36.727062926461208] } }
  ]
};

class App extends Component {

  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this)
    this.userLog = this.userLog.bind(this)
    this.handleFilters = this.handleFilters.bind(this)
    this.composeFilters = this.composeFilters.bind(this)
    this.removeFilters = this.removeFilters.bind(this);
    localStorage.removeItem('checks');
    this.closeSidebar = this.closeSidebar.bind(this)

    this.state = {
      modal: {
        title: 'Plataforma de Iniciativas Ciudadanas',
        subtitle: '¿QUÉ INICIATIVAS CIUDADANAS HAY EN TU BARRIO?, ¿PARTICIPAS EN ALGUNA?, ¿QUIERES DARLA A CONOCER?',
        description: 'El objetivo de este proyecto es mostrar la ciudad de Málaga desde una perspectiva social de movimientos emergentes, iniciativas vecinales, nuevas tendencias urbanas dentro de sus barrios, dar a conocer esa realidad social -con poca visibilidad en la ciudad- además de crear una red de colectivos y asociaciones, y establecer posibles sinergias.',
        type: 'help',
        id: '',
        options: '',
      },

      data: data,

      site: {
        title: 'Iniciativas Ciudadanas',
        collection: 'initiatives',
        buttons: [{ name: 'Iniciativas', description: 'Visualiza en el mapa el tipo de iniciativa que ha sido llevada a cabo por los ciudadanos.', id: 'purpose', filters: ['Accesibilidad', 'Arte urbano', 'Autogestión', 'Cuidado', 'Culto', 'Cultura', 'Deporte', 'Derechos sociales', 'Diversidad', 'Educación', 'Integración', 'Igualdad', 'Mediación', 'Medio ambiente', 'Migración', 'Movilidad sostenible', 'Patrimonio sociocultural', 'Política social', 'Regeneración urbana', 'Salud'] }, { name: 'Área de actuación', description:'Este filtro te ayudará a poder diferenciar en el mapa las iniciativas dependiendo del espacio o entorno en las que han sido desarrolladas. ', id: 'area', filters: ["Casa de la cultura", "Espacios virtuales", "Huerto urbano", "Solares vacíos", "Itinerarios urbanos", "Banco de recursos", "Escuela ciudadana", "Lugares de encuentro", "Coworking"] }, { name: 'Barrio', description: 'Si quieres enterarte de las iniciativas que han surgido en tu distrito o en cualquier otro, haz uso de este filtro y las verás en el mapa.', id: 'district', filters: district.features.map((feature) => feature.properties.name)}]
      },
      user: {
        email:localStorage.getItem('email'),
          uid:localStorage.getItem('uid')
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

  closeSidebar() {
    this.setState({featureData: {show: false}})
  }

  toggleModal(options, notification, id) {
    // console.log('-------------Options-------------')
    // console.log(options);
    //   console.log('-------------Notification-------------')
    //   console.log(notification);
    //   console.log('-------------MODEL-------------')
      // console.log(this.state.modal.selected);

    this.setState({ modal: options, featureData: { show: false } })
    if (notification) {
      NotificationManager.info(notification)
      this.draw.delete(id)
    }
  }

  handleFilters(conditions) {
    const filters = this.state.map.filter;
    filters[Object.keys(conditions)[0]] = Object.values(conditions)[0];
    this.setState({map: { filter: filters } } )
  }

  userLog(userInfo) {
    this.setState({ user: userInfo })
  }

  removeFilters() {
    this.setState({map: {filter : {}}})
  }

  composeFilters(filterObject) {
    const matches =
      Object.entries(filterObject).filter((entry) => entry[0] !== 'district' ).map((filterComponent) => {
        if (filterComponent[1].length < 1) {
          return null
        }
        else {
          const filterField = filterComponent[0],
          filterTargets = filterComponent[1].map((target) => {
            return([target,true])
          }).reduce((a, b) => a.concat(b), []);
          return(['match',['get',filterField],...filterTargets,false])
        }
      }).filter( element => element !== undefined);
    return(['all',...matches])
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
    //   this.toggle(this.state.satelliteImage);
    //   this.map.on('style.load', () => {
    //     this.map.addLayer(data);
    //     this.map.setFilter('route', this.state.filter);
    //   });
    this.map.setFilter('pointActivities', this.composeFilters(this.state.map.filter));
    if(this.map.getSource('userSelected') !== undefined ) {
      this.map.setFilter('userSelected', this.composeFilters(this.state.map.filter));
      this.map.setFilter('selectedFeature', this.composeFilters(this.state.map.filter));
    }
  }

  componentDidMount() {

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v9',
      center: [-4.4214, 36.7213],
      zoom: 12,
      hash: true
    });

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

      this.map.addLayer({
        id: 'lineActivities',
        source: 'activities',
        type: 'line',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#AAA',
          'line-width': 2
        }
      });

      this.map.addLayer({
        id: 'pointActivities',
        source: 'activities',
        type: 'circle',
        paint: {
          'circle-radius': [
            "interpolate", ["linear"], ["zoom"],
            // zoom is 5 (or less) -> circle radius will be 1px
            4, ['match',
            ['get', 'nexus'],
            'true', 1.5,
            1
          ],
            // zoom is 10 (or greater) -> circle radius will be 5px
            12, ['match',
            ['get', 'nexus'],
            'true', 7.5,
            5
          ]
        ],

          'circle-color': [
            'match',
            ['get', 'name'],
            'bike', '#fbb03b',
            'parkour', '#223b53',
            'running', '#e55e5e',
            'yoga', '#3bb2d0',
            '#Ff8326'
          ]
        }
      });

      firebase.firestore().collection(this.state.site.collection).get().then(querySnapshot => {
        let template = {
          "type": "FeatureCollection",
          "features": []
        }
        querySnapshot.forEach(doc => {
          template.features.push(doc.data())
        });

        this.map.addLayer({
          id: 'userActivities',
          source: {
            type: 'geojson',
            data: template
          },
          type: 'circle',
          paint: {
            'circle-radius': [
              "interpolate", ["linear"], ["zoom"],
              // zoom is 5 (or less) -> circle radius will be 1px
              5, ['match',
              ['get', 'nexus'],
              'true', 2,
              1
            ],
              // zoom is 10 (or greater) -> circle radius will be 5px
              12, ['match',
              ['get', 'nexus'],
              'true', 10,
              5
            ]
          ],

            'circle-color': [
              'match',
              ['get', 'name'],
              'bike', '#fbb03b',
              'parkour', '#223b53',
              'running', '#e55e5e',
              'yoga', '#3bb2d0',
              '#Ff8326'
            ]
          }
        });

      });

      ['pointActivities', 'userActivities', 'lineActivities'].forEach(activityType => {
        this.map.on('mouseenter', activityType, () => {
          this.map.getCanvas().style.cursor = 'pointer';
        });

        this.map.on('mouseleave', activityType, () => {
          this.map.getCanvas().style.cursor = '';
        });

        this.map.on('click', activityType, e => {
          let featureProperties = e.features[0].properties,
          featureLocation = e.features[0].geometry.coordinates
          this.setState({ featureData: { title: featureProperties.name, location: featureLocation, show: true, img: featureProperties.image, description: featureProperties.description, url: featureProperties.url, twitter: featureProperties.twitter, facebook: featureProperties.facebook, phone: featureProperties.phone, address: featureProperties.address, creator: featureProperties.creator } })
        });
      })

      this.map.on('click', 'pointActivities' , e => {
        if(this.map.getSource('userSelected') !== undefined) {
          this.map.removeLayer('userSelected');
          this.map.removeSource('userSelected');
          this.map.removeLayer('selectedFeature');
          this.map.removeSource('selectedFeature');
        }

        let clickedFeature = e.features[0],
        related = clickedFeature.properties.related.slice(1,-1).split(',').map(str => parseInt(str));
        let lines = {
          "type": "FeatureCollection",
          "features": data.features.filter(feature => {
          return(related.includes(feature.properties.id))
        }).map(feature => {
          let featureObject = {
            "type": "Feature",
            "properties": feature.properties,
            "geometry": {
              "type": "LineString",
              "coordinates": [clickedFeature.geometry.coordinates,feature.geometry.coordinates]
            }
          }
          return(featureObject)
        })}

        this.map.addLayer({
          id: 'userSelected',
          source: {
            'type': 'geojson',
            'data': lines
          },
          type: 'line',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#AAA',
            'line-width': 1
          }
        });

        this.map.addLayer({
          id: 'selectedFeature',
          source: {
            type: 'geojson',
            data: clickedFeature
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
            'circle-stroke-color': '#AAA',
            'circle-color': '#Ff8326'
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

    return (
      <div style={style} ref={el => this.mapContainer = el} >
        <Header title={this.state.site.title} nameList={this.state.data.features.map((feature) => feature.properties.name)} buttons={this.state.site.buttons} handler={this.toggleModal} email={this.state.user.email} />
        <Modal type={this.state.modal.type} removeFilters={this.removeFilters} title={this.state.modal.title} id={this.state.modal.id} subtitle={this.state.modal.subtitle} description={this.state.modal.description} email={this.state.user.email} handler={this.toggleModal} handleFilters={this.handleFilters} userLog={this.userLog} options={this.state.modal.options} data={this.state.modal.data} collection={this.state.site.collection} />
        <Sidebar title={this.state.featureData.title} location={this.state.featureData.location} img={this.state.featureData.img} userEmail={this.state.user.email} creator={this.state.featureData.creator} description={this.state.featureData.description} address={this.state.featureData.address} email={this.state.featureData.email} url={this.state.featureData.url} twitter={this.state.featureData.twitter} facebook={this.state.featureData.facebook} phone={this.state.featureData.phone} show={this.state.featureData.show} closeSidebar={this.closeSidebar} />
        <NotificationContainer/>
      </div>
    );
  }
}
// IMPORTANTE, SON LOS FILTROS DE LOS BOTONES
// [{ name: 'Iniciativas', filters: ['Accesibilidad', 'Arte urbano', 'Autogestión', 'Cuidado', 'Culto', 'Cultura', 'Deporte', 'Derechos sociales', 'Diversidad', 'Educación', 'Integración', 'Igualdad', 'Mediación', 'Medio ambiente', 'Migración', 'Movilidad sostenible', 'Patrimonio sociocultural', 'Política social', 'Regeneración urbana', 'Salud'] }, { name: 'Acción', filters: ["Taller", "Digital", "Reunión", "Acción", "Exposición", "Difusión"] }, { name: 'Área de actuación', filters: ["Casa de la cultura", "Espacios virtuales", "Huerto urbano", "Solares vacíos", "Itinerarios urbanos", "Banco de recursos", "Escuela ciudadana", "Lugares de encuentro", "Coworking"] }, { name: 'Facilitador', filters: ["Administración pública", "Asociación de vecinos/as", "Asamblea local", "Movimiento ciudadano", "Colectivo tradicional", "Obra social"] }, { name: 'Distritos', filters: ['foo', 'bar'] }]

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

export default App;
