import React, { Component } from 'react';
import * as firebase from 'firebase';
import { NotificationContainer, NotificationManager } from 'react-notifications';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      forgot: false,
      terms: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleLogin(event) {
    if (this.state.forgot) {
      firebase.auth().sendPasswordResetEmail(this.state.email).then(() => {
        this.props.handler(false);
        NotificationManager.info('Te hemos enviado instrucciones de cómo restablecer tu contraseña a la cuenta de correo indicada.')
      })
    }
    else {
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(response => {
              localStorage.setItem('uid', response.user.uid);
              localStorage.setItem('email', response.user.email);
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
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
              .then(response => {
                this.props.userLog({ email: response.user.email, uid: response.user.uid });
                localStorage.setItem('uid', response.user.uid);
                localStorage.setItem('email', response.user.email);
                this.props.handler(false);
                NotificationManager.success('¡Autenticación correcta!')
              })
              .catch(error => {
                NotificationManager.error('La contraseña no es correcta')
              })
          }
          else {
            NotificationManager.error('No se ha podido crear la cuenta');
          }
        });
    }
    event.preventDefault();
  }

  handleLogout(event) {
    firebase.auth().signOut().then(() => {
      this.props.userLog({ email: null, uid: null });
      localStorage.setItem('uid', null);
      localStorage.setItem('email', null);
      this.props.handler(false);
    }).catch((error) => {
      NotificationManager.error('Algo salió mal...')
    });
    NotificationManager.success('Desconectado. ¡Vuelve pronto!');
    event.preventDefault();
  }

  render() {
    const modalHeader = <div className='modal-header'> <h5 className='modal-title'>{this.props.title}</h5><button type='button' className='close' aria-label='Close' onClick={() => this.props.handler(false)}><span aria-hidden='true'>&times;</span></button></div>;

    if (this.props.email != 'null' && this.props.email != undefined) {
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
                    <input className='btn btn-primary-filters btn-sm' type='submit' value='Desconectar' />
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
                    <div className='backtittle'><h6 style={{ padding: '5px' }}>Introduce tu correo y tu contraseña para acceder. Si no tienes una cuenta, se creara automáticamente.</h6></div>
                    <div className='form-row'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='email'>Email</label>
                        <input type='text' className='form-control' id='email' placeholder='hola@example.com' value={this.state.email} onChange={this.handleChange} />
                      </div>
                      <div className='form-group col-md-6'>
                        <label htmlFor='password'>Contraseña</label>
                        <input type='password' className='form-control' id='password' placeholder='Introduce tu contraseña' value={this.state.password} onChange={this.handleChange} />
                      </div>
                    </div>
                    <div className='form-check'>
                      <label className='form-check-label'>
                        <input className='form-check-input' type='checkbox' id='forgot' value={this.state.forgot} onChange={this.handleChange} /> Si has olvidado tu contraseña, introduce tu e-mail, marca esta casilla y pulsa "Acceder" para recuperarla
            <span className='form-check-sign'>
                          <span className='check'></span>
                        </span>
                      </label>
                    </div>
                    <div className='form-check'>
                      <label className='form-check-label'>
                        <input className='form-check-input' type='checkbox' id='terms' value={this.state.terms} onChange={this.handleChange} />He leído y acepto los <a target="_blank" href="https://www.uma.es/secretariageneral/newsecgen/index.php?option=com_content&view=article&id=259:reglamento-de-proteccion-de-datos-de-caracter-personal-de-la-universidad-de-malaga&catid=13&Itemid=124">términos y condiciones</a>
                        <span className='form-check-sign'>
                          <span className='check'></span>
                        </span>
                      </label>
                    </div>
                    <p></p>
                    <div className='modal-footer justify-content-center'>
                      <input className='btn btn-primary-filters btn-sm' type='submit' value='Acceder' />
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
