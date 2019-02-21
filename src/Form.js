import React, { Component } from 'react';
import {NotificationManager} from 'react-notifications';
import * as firebase from 'firebase';
import {storage} from './App'

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      web: '',
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
                        console.log(image, this.state)
                    })
                });
        }
    }




  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmission(event) {
    let data = this.props.data;
    data.properties = {
      name: this.state.name,
      url: this.state.web,
      address: this.state.address,
      purpose: this.state.purpose,
      action: this.state.action,
      area: this.state.area,
      enabler: this.state.enabler,
      description: this.state.description,
      image: this.state.image,
      creator: this.state.creator,
      group: this.state.group,
      twitter:this.state.twitter,
      facebook: this.state.facebook
    }
    firebase.firestore().collection(this.props.collection).doc(data.properties.name + '_' + data.geometry.coordinates[0].toFixed(2) + '_' + data.geometry.coordinates[1].toFixed(2)).set(data)
      .then(() => {
        this.props.handler(false, 'Iniciativa añadida con éxito. ¡Gracias por colaborar!', this.props.data.id);
      })
      .catch((error) => {
        NotificationManager.error('Ha ocurrido un error al crear la iniciativa.');
      });
    event.preventDefault();
  }

  render() {
    return (
      <form className='form' onSubmit={this.handleSubmission}>
        <div className='form-row'>
          <div className='form-group col-md-6'>
            <label htmlFor='name'>Nombre</label>
            <input type='text' className='form-control' id='name' placeholder='Nombre de la Iniciativa' value={this.state.name} onChange={this.handleChange} />
          </div>
          <div className='form-group col-md-6'>
            <label htmlFor='web'>Web</label>
            <input type='text' className='form-control' id='web' placeholder='https://example.com' value={this.state.web} onChange={this.handleChange} />
          </div>
        </div>
        <div className='form-row'>
        <div className='form-group col-md-6'>
          <label htmlFor='address'>Dirección</label>
          <input type='text' className='form-control' id='address' placeholder='Calle de la Piruleta 1, Bloque 2, Puerta 4' value={this.state.address} onChange={this.handleChange} />
        </div>
        <div className='form-group col-md-6'>
          <label htmlFor='address'>Grupo</label>
          <input type='text' className='form-control' id='group' placeholder='Cruz Roja' value={this.state.group} onChange={this.handleChange} />
        </div>
        </div>
        <div className='form-row'>
          <div className='form-group col-md-3'>
            <label htmlFor='initiative'>Temática</label>
            <select id='purpose' className='form-control' value={this.state.purpose} onChange={this.handleChange}>
              <option value='' disabled hidden>Elige una</option>
              <option value='Accesibilidad'>Accesibilidad</option>
              <option value='Arte urbano'>Arte urbano</option>
              <option value='Autogestión'>Autogestión</option>
              <option value='Cuidado'>Cuidado</option>
              <option value='Culto'>Culto</option>
              <option value='Cultura'>Cultura</option>
              <option value='Deporte'>Deporte</option>
              <option value='Derechos sociales'>Derechos sociales</option>
              <option value='Diversidad'>Diversidad</option>
              <option value='Educación'>Educación</option>
              <option value='Integración'>Integración</option>
              <option value='Igualdad'>Igualdad</option>
              <option value='Mediación'>Mediación</option>
              <option value='Medio ambiente'>Medio ambiente</option>
              <option value='Migración'>Migración</option>
              <option value='Movilidad sostenible'>Movilidad sostenible</option>
              <option value='Patrimonio sociocultural'>Patrimonio sociocultural</option>
              <option value='Política social'>Política social</option>
              <option value='Regeneración urbana'>Regeneración urbana</option>
              <option value='Salud'>Salud</option>
            </select>
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='action'>Acción</label>
            <select id='action' className='form-control' value={this.state.action} onChange={this.handleChange}>
              <option value='' disabled hidden>Elige una</option>
              <option value='Taller'>Taller: curso, workshop , seminario, jornadas...</option>
              <option value='Digital'>Digital: espacios virtuales, redes sociales... </option>
              <option value='Reunion'>Reunión: punto de encuentro, foro, asamblea... </option>
              <option value='Accion'>Acción: performance, acción, intervención...</option>
              <option value='Exposicion'>Exposición: muestra, evento, presentación...</option>
              <option value='Difusion'>Difusión: promoción, publicación, divulgación...</option>
            </select>
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='area'>Área</label>
            <select id='area' className='form-control' value={this.state.area} onChange={this.handleChange}>
              <option value='' disabled hidden>Elige una</option>
              <option value='Casa de la cultura'>Casa de la cultura</option>
              <option value='Espacios virtuales'>Espacios virtuales</option>
              <option value='Huerto urbano'>Huerto urbano</option>
              <option value='Solares vacios'>Solares vacíos</option>
              <option value='Itinerarios urbanos'>Itinerarios urbanos</option>
              <option value='Banco de recursos'>Banco de recursos</option>
              <option value='Escuela ciudadana'>Escuela ciudadana</option>
              <option value='Lugares de encuentro'>Lugares de encuentro</option>
              <option value='Coworking'>Coworking</option>
            </select>
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='enabler'>Facilitador</label>
            <select id='enabler' className='form-control' value={this.state.enabler} onChange={this.handleChange}>
              <option value='' disabled hidden>Elige uno</option>
              <option value='Administración pública'>Administración pública</option>
              <option value='Asociación de vecinos/as'>Asociación de vecinos/as</option>
              <option value='Asamblea local'>Asamblea local</option>
              <option value='Movimiento ciudadano'>Movimiento ciudadano</option>
              <option value='Colectivo tradicional'>Colectivo tradicional</option>
              <option value='Obra social'>Obra social</option>
            </select>
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
          <label htmlFor="file" class="btn" style={{ backgroundColor: '#Ff8326' }}>Select Image</label>
          <input type="file" id="file" style={{visibility:'hidden'}} accept=".png,.jpg" onChange={this.handleUpload}/>
        </div>
        <div className='modal-footer justify-content-center'>
          <input className='btn btn-primary-filters btn-sm' type='submit' value='Enviar' />
        </div>
      </form>
    );
  }
}

export default Form;
