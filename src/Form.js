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
      image: null,
      creator: this.props.email,
        url: '',
        progress: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);
      this.handleUpload = this.handleUpload.bind(this);
  }
    handleUpload = e => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            this.setState(() => ({image}));


            const uploadTask = storage.ref(`images/${image.name}`).put(image);
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
                    storage.ref('images').child(image.name).getDownloadURL().then(url => {
                        console.log(url);
                        this.setState({url});
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
      url: (this.state.web.toLocaleLowerCase().startsWith('http') ? this.state.web : 'https://' + this.state.web),
      address: this.state.address,
      initiative: this.state.purpose,
      action: this.state.action,
      area: this.state.area,
      enabler: this.state.enabler,
      description: this.state.description,
      image: this.state.image,
      creator: this.state.creator
    }
    firebase.firestore().collection(this.props.collection).add(data)
      .then(() => {
        this.props.handler(false);
        NotificationManager.success('Iniciativa añadida con éxito. ¡Gracias por colaborar!');
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
        <div className='form-group'>
          <label htmlFor='address'>Dirección</label>
          <input type='text' className='form-control' id='address' placeholder='Calle de la Piruleta 1, Bloque 2, Puerta 4' value={this.state.address} onChange={this.handleChange} />
        </div>
        <div className='form-row'>
          <div className='form-group col-md-3'>
            <label htmlFor='initiative'>Iniciativa</label>
            <select id='purpose' className='form-control' value={this.state.purpose} onChange={this.handleChange}>
              <option value='' disabled hidden>Elige una</option>
              <option value='accesibilidad'>Accesibilidad</option>
              <option value='arte urbano'>Arte urbano</option>
              <option value='autogestión'>Autogestión</option>
              <option value='cuidado'>Cuidado</option>
              <option value='culto'>Culto</option>
              <option value='cultura'>Cultura</option>
              <option value='deporte'>Deporte</option>
              <option value='derechos sociales'>Derechos sociales</option>
              <option value='diversidad'>Diversidad</option>
              <option value='educación'>Educación</option>
              <option value='integracion'>Integración</option>
              <option value='igualdad'>Igualdad</option>
              <option value='mediacion'>Mediación</option>
              <option value='medio ambiente'>Medio ambiente</option>
              <option value='migracion'>Migración</option>
              <option value='movilidad sostenible'>Movilidad sostenible</option>
              <option value='patrimonio sociocultural'>Patrimonio sociocultural</option>
              <option value='politica social'>Política social</option>
              <option value='regeneración urbana'>Regeneración urbana</option>
              <option value='salud'>Salud</option>
            </select>
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='action'>Acción</label>
            <select id='action' className='form-control' value={this.state.action} onChange={this.handleChange}>
              <option value='' disabled hidden>Elige una</option>
              <option value='taller'>Taller: curso, workshop , seminario, jornadas...</option>
              <option value='digital'>Digital: espacios virtuales, redes sociales... </option>
              <option value='reunion'>Reunión: punto de encuentro, foro, asamblea... </option>
              <option value='accion'>Acción: performance, acción, intervención...</option>
              <option value='exposicion'>Exposición: muestra, evento, presentación...</option>
              <option value='difusion'>Difusión: promoción, publicación, divulgación...</option>
            </select>
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='area'>Área</label>
            <select id='area' className='form-control' value={this.state.area} onChange={this.handleChange}>
              <option value='' disabled hidden>Elige una</option>
              <option value='casa de la cultura'>Casa de la cultura</option>
              <option value='espacios virtuales'>Espacios virtuales</option>
              <option value='huerto urbano'>Huerto urbano</option>
              <option value='solares vacios'>Solares vacíos</option>
              <option value='itinerarios urbanos'>Itinerarios urbanos</option>
              <option value='banco de recursos'>Banco de recursos</option>
              <option value='escuela ciudadana'>Escuela ciudadana</option>
              <option value='lugares de encuentro'>Lugares de encuentro</option>
              <option value='coworking'>Coworking</option>
            </select>
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='enabler'>Facilitador</label>
            <select id='enabler' className='form-control' value={this.state.enabler} onChange={this.handleChange}>
              <option value='' disabled hidden>Elige uno</option>
              <option value='administración pública'>Administración pública</option>
              <option value='asociación de vecinos/as'>Asociación de vecinos/as</option>
              <option value='asamblea local'>Asamblea local</option>
              <option value='movimiento ciudadano'>Movimiento ciudadano</option>
              <option value='colectivo tradicional'>Colectivo tradicional</option>
              <option value='obra social'>Obra social</option>
            </select>
          </div>
        </div>
        <div className='form-group'>
          <label htmlFor='description'>Descripción</label>
          <textarea className='form-control' placeholder='Describe aqui la iniciativa' id='description' rows='3' value={this.state.description} onChange={this.handleChange} />
        </div>
        <div className='form-group'>
          <label htmlFor='image'>¿Alguna imagen?</label>
          <input type='text' className='form-control' id='image' placeholder='Pon el enlace a la imagen de tu iniciativa.' value={this.state.url} onChange={this.handleChange} />
        </div>
        <div>
          <input type="file" accept=".png,.jpg" onChange={this.handleUpload}/>
        </div>
        <div className='modal-footer justify-content-center'>
          <input className='btn btn-primary justify-content-center' type='submit' value='Enviar' style={{ backgroundColor: '#Ff8326' }} />
        </div>
      </form>

    );
  }
}

export default Form;