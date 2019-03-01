import React, { Component } from 'react';
import {NotificationManager} from 'react-notifications';
import * as firebase from 'firebase';
import {storage} from './App';
import Select from 'react-select';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      web: '',
      phone: '',
      address: '',
      purpose: '',
      action: '',
      area: '',
      enabler: '',
      description: '',
      image: '',
      creator: this.props.email,
      twitter: '',
      facebook: '',
      group: '',
      file: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleMulti = this.handleMulti.bind(this);
    this.handleMulti_2 = this.handleMulti_2.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);
      this.handleUpload = this.handleUpload.bind(this);
  }
    handleUpload = e => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            this.setState(() => ({file}));


            const uploadTask = storage.ref(`images/${file.name}`).put(file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    // progrss function ....
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    this.setState({progress});
                },
                (error) => {
                    // error function ....
                    console.log(error);
                },
                () => {
                    // complete function ....
                    storage.ref('images').child(file.name).getDownloadURL().then(image => {
                        this.setState({image});
                        // console.log(image, this.state)
                    })
                });
        }
    }




  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }
  handleMulti (selectedOption) {
    this.setState({ purpose: selectedOption });
  }

  handleMulti_2 (selectedOption) {
    this.setState({ area: selectedOption });
  }

  handleSubmission(event) {
    let data = this.props.data;
    console.log(this.props.data)
    data.properties = {
      name: this.state.name,
      url: this.state.web.startsWith('http') ? this.state.web : 'https://' + this.state.web,
      address: this.state.address,
      purpose:  this.state.purpose,
      action: this.state.action,
      area: this.state.area,
      enabler: this.state.enabler,
      description: this.state.description,
      image: this.state.image,
      mail: this.state.email,
      creator: this.state.creator,
      group: this.state.group,
      twitter:this.state.twitter,
      facebook: this.state.facebook,
      phone: this.state.phone
    }

    console.log(data)

    firebase.firestore().collection(this.props.collection).doc(data.properties.name + '_' + data.geometry.coordinates[0].toFixed(2) + '_' + data.geometry.coordinates[1].toFixed(2)).set(data)
      .then(() => {
        this.props.handler(false, 'Iniciativa añadida con éxito. ¡Gracias por colaborar!', this.props.data.id);
      })
      .catch((error) => {
        NotificationManager.error('Ha ocurrido un error al crear la iniciativa.');
      });
    event.preventDefault();
  }

  componentDidMount () {
    if (this.props.data.properties.featureLocation !== undefined){
    if (this.props.data.properties.featureLocation.length > 0) {
      this.setState({
        email: this.props.data.properties.featureProperties.mail,
        address: this.props.data.properties.featureProperties.address,
        name: this.props.data.properties.featureProperties.name,
        web: this.props.data.properties.featureProperties.url,
        phone: this.props.data.properties.featureProperties.phone,
        purpose: JSON.parse(this.props.data.properties.featureProperties.purpose),
        action: '',
        area: JSON.parse(this.props.data.properties.featureProperties.purpose),
        enabler: '',
        description: this.props.data.properties.featureProperties.description,
        image: this.props.data.properties.featureProperties.image,
        creator: this.props.data.properties.featureProperties.creator,
        twitter: this.props.data.properties.featureProperties.twitter,
        facebook: this.props.data.properties.featureProperties.facebook,
        group: '',
        file: null
      })
    }}
  }

  render() {
    const purpose = [
      { value: 'Accesibilidad', label: 'Accesibilidad: eliminación de barreras, diseño universal..' },
      { value: 'Arte urbano', label: 'Arte urbano: educación artística, graffiti..' },
      { value: 'Arquitectura', label: 'Arquitectura: patrimonio industrial, bien de interés cultural..' },
      { value: 'Autogestión', label: 'Autogestión: gobernanza urbana, participación urbana..' },
      { value: 'Cuidado', label: 'Cuidado: salud, alimentación, calidad de vida..' },
      { value: 'Culto', label: 'Culto: religión, creencias, rito..' },
      { value: 'Cultura', label: 'Cultura: educación libre, aprendizaje colaborativo..' },
      { value: 'Deporte', label: 'Deporte: actividad física y/o lúdica, gamificación..' },
      { value: 'Derechos sociales', label: 'Derechos sociales: derechos Humanos, igualdad de derechos y deberes..' },
      { value: 'Diversidad', label: 'Diversidad: apoyo a la integración, atención a la diversidad..' },
      { value: 'Educación', label: 'Educación: aprendizaje basado en proyectos, comunidades de aprendizaje, AMPA..' },
      { value: 'Integración', label: 'Integración: interculturalidad, inmersión cultural..' },
      { value: 'Igualdad', label: 'Igualdad: perspectiva de género, feminismo..' },
      { value: 'Mediación', label: 'Mediación: intermediación, facilitación..' },
      { value: 'Medio ambiente', label: 'Medio ambiente: ecología, permacultura, huertos urbanos..' },
      { value: 'Movilidad sostenible', label: 'Movilidad sostenible: transporte público, espacios tranquilos y saludables..' },
      { value: 'Patrimonio material', label: 'Patrimonio material: arqueología, preexistencias, vestigios..' },
      { value: 'Patrimonio cultural inmaterial', label: 'Patrimonio cultural inmaterial:  tradiciones, costumbres, oficios..' },
      { value: 'Política social', label: 'Política social: banco de tiempo, crowfunding (economía colaborativa), cooperativas vecinales..' },
      { value: 'Urbanismo', label: 'Urbanismo: regeneración urbana, rutas urbanas, estrategias urbanas..' },
      { value: 'Salud', label: 'Salud: bienestar, vida saludable..' }
    ]

    const area = [
      {value: 'Espacios culturales', label: 'Espacios culturales: Centro cultural, bibliotecas, museos, universidad..' },
      {value: 'Sedes ciudadanas', label: 'Sedes ciudadanas: Sede de asociaciones, coworking(espacios de trabajo colaborativo), talleres...' },
      {value: 'Espacio público', label: 'Espacio público: Plazas, parques, calles, vacíos urbanos...' },
      {value: 'Espacios virtuales', label: 'Espacios virtuales: Redes sociales, plataformas, blogs..' },
    ]

    let imageOk = this.state.image.length > 0 ? <span>¡Imagen subida con éxito!</span> : null
    return (
      <form className='form' onSubmit={this.handleSubmission}>
        <div className='form-row'>
          <div className='form-group col-md-4'>
            <label htmlFor='name'>Nombre del colectivo</label>
            <input type='text' className='form-control' id='name' placeholder='Nombre de la Iniciativa' value={this.state.name} onChange={this.handleChange} />
          </div>
          <div className='form-group col-md-4'>
            <label htmlFor='web'>Web</label>
            <input type='text' className='form-control' id='web' placeholder='https://example.com' value={this.state.web} onChange={this.handleChange} />
          </div>

        <div className='form-group col-md-4'>
            <label htmlFor='phone'>Teléfono</label>
            <input type='text' className='form-control' id='phone' placeholder='+34 629118190' value={this.state.phone} onChange={this.handleChange} />
          </div>
          </div>
        <div className='form-row'>
        <div className='form-group col-md-6'>
          <label htmlFor='address'>Dirección</label>
          <input type='text' className='form-control' id='address' placeholder='Calle de la Piruleta 1, Bloque 2, Puerta 4' value={this.state.address} onChange={this.handleChange} />
        </div>
        <div className='form-group col-md-6'>
          <label htmlFor='email'>Email</label>
          <input type='text' className='form-control' id='email' placeholder='tec@gmail.es' value={this.state.email} onChange={this.handleChange} />
        </div>
        </div>
        <div className='form-row'>
          <div className='form-group col-md-12'>
            <label htmlFor='initiative'>Temática</label>
            <Select
        value={this.state.purpose}
        onChange={this.handleMulti}
        isMulti={true}
        isSearchable={true}
        options={purpose}
      />
          </div>
          </div>
          <div className='form-row'>
          <div className='form-group col-md-12'>
            <label htmlFor='area'>Ámbito</label>
          <Select
        value={this.state.area}
        onChange={this.handleMulti_2}
        isMulti={true}
        isSearchable={true}
        options={area}
      />
      </div>

        </div>
        <div className='form-row'>
        <div className='form-group col-md-6'>
          <label htmlFor='description'>Descripción</label>
          <textarea className='form-control' placeholder='Describe aqui la iniciativa' id='description' rows='3' value={this.state.description} onChange={this.handleChange} />
        </div>
        <div className='form-group col-md-6'>
          <div className='form-row'>
            <label htmlFor='twitter' style={{marginBottom: '5px'}}>Twitter</label>
            <input type='text' className='form-control' id='twitter' placeholder='https://twitter.com/devtwitter' value={this.state.twitter} onChange={this.handleChange} />
          </div>
          <div className='form-row'>
            <label htmlFor='facebook' style={{marginTop: '5px', marginBottom: '3px'}}>Facebook</label>
            <input type='text' className='form-control' id='facebook' placeholder='https://facebook.com/devfacebook/' value={this.state.facebook} onChange={this.handleChange} />
          </div>
        </div>
        <div>
          </div>
          <label htmlFor="file" class="btn btn-primary-filters btn-sm" >Seleccionar imagen</label>
          <input type="file" id="file" style={{visibility:'hidden'}} accept=".png,.jpg" onChange={this.handleUpload}/>
          {imageOk}
        </div>
        <div className='modal-footer justify-content-center'>
          <input className='btn btn-primary-filters btn-sm' type='submit' value='Enviar' />
        </div>
      </form>
    );
  }
}

export default Form;
