import React, { Component } from 'react';
import * as firebase from 'firebase';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    // this.checkifuserexist = this.checkifuserexist.bind(this);
    // this.checkifuserexist();
  }
    // checkifuserexist(){
    //     console.log('check in locastorage');
    //     // this.userLog({ email: localStorage.getItem('email'), uid: localStorage.getItem('uid') });
    //     console.log('uid from local storage'+localStorage.getItem('uid'));
    //     console.log('email from local storage'+localStorage.getItem('email'));
    //     this.props.userLog({ email: localStorage.getItem('email'), uid: localStorage.getItem('uid') });
    // }
  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleLogin(event) {
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
          .then(response => {
              console.log('created and logged in');
              console.log('Email: '+response.user.email);
              console.log('Password:'+response.user.uid);
              localStorage.setItem('uid', response.user.uid);
              localStorage.setItem('email', response.user.email);
              console.log('uid from local storage'+localStorage.getItem('uid'));
              console.log('email from local storage'+localStorage.getItem('email'));

            this.props.userLog({ email: response.user.email, uid: response.user.uid });
            this.props.handler(false);
            NotificationManager.success('¡Cuenta creada!')
          })
          .catch(error => {
            NotificationManager.error('Ha habido un error al acceder. Comprueba tu conexión e intenta acceder de nuevo')
          })
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          // console.log('if already exist');
          // console.log('Email: '+this.state.email);
          // console.log('Password:'+this.state.password);
          firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(response => {
              this.props.userLog({ email: response.user.email, uid: response.user.uid });
                localStorage.setItem('uid', response.user.uid);
                localStorage.setItem('email', response.user.email);
                // console.log('uid from local storage'+localStorage.getItem('uid'));
                // console.log('email from local storage'+localStorage.getItem('email'));
              this.props.handler(false);
              NotificationManager.success('¡Autenticación correcta!')
            })
            .catch (error => {
              NotificationManager.error('La contraseña no es correcta')
            })
        }
        else {
          NotificationManager.error('No se ha podido crear la cuenta');
        }
      });
    event.preventDefault();
  }

  handleLogout(event) {
    firebase.auth().signOut().then(() => {
      this.props.userLog({ email: null, uid: null });
        localStorage.setItem('uid', null);
        localStorage.setItem('email',null);
      this.props.handler(false);
    }).catch((error) => {
      NotificationManager.error('Algo salió mal...')
    });
    NotificationManager.success('Desconectado. ¡Vuelve pronto!');
    event.preventDefault();
  }

  render() {
    const modalHeader = <div className='modal-header'> <h5 className='modal-title'>{this.props.title}</h5><button type='button' className='close' aria-label='Close' onClick={() => this.props.handler(false)}><span aria-hidden='true'>&times;</span></button></div>;

    if (this.props.email!='null' && this.props.email!= undefined) {
      return (
        <form onSubmit={this.handleLogout}>
          <div className='modal fade show' style={{ display: 'block', overflow: 'auto' }} tabIndex='-1'>
            <div className='modal-dialog modal-login' role='document'>
              <div className='modal-content'>
                <div className='card card-signup card-plain'>
                  {modalHeader}
                  <div className='modal-body' style={{ textAlign: 'center' }}>
                    <h4 style={{ fontWeight: 'bold' }}>¡Hola!</h4>
                    <h6>Estas registrado cómo {this.props.email}</h6>
                    <input className='btn btn-primary-filters btn-sm' type='submit' value='Desconectar'  />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )
    }
    else {
      return (
        <form onSubmit={this.handleLogin}>
          <div className='modal fade show' style={{ display: 'block', overflow: 'auto' }} tabIndex='-1'>
            <div className='modal-dialog modal-login' role='document'>
              <div className='modal-content'>
                <div className='card card-signup card-plain'>
                  {modalHeader}
                  <div className='modal-body'>
                    <h6>Introduce tu correo y tu contraseña para acceder. Si no tienes una cuenta, se creara automáticamente.</h6>
                    <div className='form-row'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='email'>Email</label>
                        <input type='text' className='form-control' id='email' placeholder='hola@example.com' value={this.state.email} onChange={this.handleChange} />
                      </div>
                      <div className='form-group col-md-6'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' className='form-control' id='password' placeholder='Introduce tu contraseña' value={this.state.password} onChange={this.handleChange} />
                      </div>
                    </div>
                    {/* <div className='form-row'>
            <div className='form-group col-md-12'>
              <label for='email4'>Nombre</label>
              <input type='text' className='form-control' id='email4' placeholder='Arbolitos Unidos' />
            </div>
        </div> */}
                    {/* <div className='form-row'>
            <div className='form-group col-md-8'>
            <label for='address'>Dirección</label>
            <input type='text' className='form-control' id='address' placeholder='Calle de la Piruleta 1, Bloque 2, Puerta 4' />
          </div>
          <div className='form-group col-md-4'>
              <label for='password4'>CP</label>
              <input type='text' className='form-control' id='password4' placeholder='https://test.com' />
            </div>
        </div> */}
                    {/* <div className='form-row'>
          <div className='form-group col-md-3'>
              <label for='password4'>CIF</label>
              <input type='text' className='form-control' id='password4' placeholder='https://test.com' />
            </div>
            <div className='form-group col-md-3'>
              <label for='inputState'>Télefono</label>
              <input type='text' className='form-control' id='password4' placeholder='https://test.com' />
            </div>
            <div className='form-group col-md-3'>
              <label for='inputState'>Web</label>
              <input type='text' className='form-control' id='password4' placeholder='https://test.com' />
            </div>
            <div className='form-group col-md-3'>
              <label for='inputState'>Ámbito</label>
              <select id='inputState' className='form-control'>
                <option selected>Elige una</option>
                <option>...</option>
              </select>
            </div>
          </div> */}
                    {/* <div className='form-group'>
            <label for='exampleFormControlTextarea1'>Hoja de ruta</label>
            <textarea className='form-control' id='exampleFormControlTextarea1' rows='3'></textarea>
          </div> */}
                    <div className='modal-footer justify-content-center'>
                      <input className='btn btn-primary-filters btn-sm' type='submit' value='Acceder'  />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )
    }
  }
}

export default Dashboard;
