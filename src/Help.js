import React, { Component } from 'react';

class Help extends Component {
  render() {
    const modalHeader = <div className='modal-header'> <h5 className='modal-title'>{this.props.title}</h5><button type='button' className='close' aria-label='Close' onClick={() => this.props.handler(false)}><span aria-hidden='true'>&times;</span></button></div>;
    return (
      <div className='modal fade show' style={{ display: 'block', overflow: 'auto' }} tabIndex='-1' role='dialog' aria-labelledby='ModalLabel' aria-hidden='true'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            {modalHeader}

            <div className='modal-body'>
              <div className='backtittle'><h6 style={{padding:'5px'}}>{this.props.subtitle}</h6></div>
              <p className='text-justify'>{this.props.description}</p>


              <div className='row'>
                  <div className='col-md-12 col-lg-12 col-sm-12 text-center'>

                    <button type='button' className='btn btn-primary-filters btn-sm' onClick={() => this.props.handler(false)}>¡Comenzar!</button>

                  </div>
                </div>

              <a class='portada'><img class='portada' src='/assets/img/city.png'></img></a>


              <div className='container'>

                <div className='row'>
                  <div className='col-md-12 col-lg-12 col-sm-12 text-center'>
                    <p className='text'>Contáctanos:</p>

                  <a href='mailto:info@teciudadania.uma.es' style={{paddingRight:'20px'}}><img class='' src='/assets/img/mail.png'></img></a>
                  <a href='https://twitter.com/teciudadania?lang=es' target='_blank' rel='noopener noreferrer' style={{paddingRight:'20px'}}><img class='' src='/assets/img/twitter.png'></img></a>
                  <a href='https://www.facebook.com/teciudadania.ciudadania.1' target='_blank' rel='noopener noreferrer' style={{paddingRight:'20px'}}><img class='' src='/assets/img/facebook.png'></img></a>
                  <a href='https://www.instagram.com/teciudadania/?hl=es' target='_blank' rel='noopener noreferrer'><img class='' src='/assets/img/instagram.png'></img></a>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-12 col-lg-12 col-sm-12 text-center'>

                  <a target="_blank" href="https://www.uma.es/secretariageneral/newsecgen/index.php?option=com_content&view=article&id=259:reglamento-de-proteccion-de-datos-de-caracter-personal-de-la-universidad-de-malaga&catid=13&Itemid=124" >Términos y condiciones</a>
                  </div>
                </div>

                <div className='row' style={{ marginTop: '5px', justifyContent: 'center' }}>
                  <div className='col-md-4 col-lg-4 col-sm-12 text-center'>
                    <a href='https://www.uma.es/rce/' target='_blank' rel='noopener noreferrer'><img className='sponsor' src='/assets/img/rce.png' /></a>
                  </div>
                  <div className='col-md-6 col-lg-6 col-sm-12 text-center'>
                    <a href='https://www.uma.es/vicerrectorado-de-proyectos-estrategicos/' target='_blank' rel='noopener noreferrer'><img className='sponsorVice' src='/assets/img/vice.png' /></a>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-4 col-lg-4 col-sm-12 text-center'>
                    <a href='https://www.uma.es/rce/' target='_blank' rel='noopener noreferrer'><img className='sponsorGeo' src='/assets/img/tec.png'/></a>
                  </div>
                  <div className='col-md-4 col-lg-4 col-sm-12 text-center'>
                    <a href='http://geotecnologias.uma.es/' target='_blank' rel='noopener noreferrer'><img className='sponsorGeo' src='/assets/img/rges.png' /></a>
                  </div>
                  <div className='col-md-4 col-lg-4 col-sm-12 text-center'>
                    <a href='https://www.uma.es/rce/' target='_blank' rel='noopener noreferrer'><img className='sponsorGeo' src='/assets/img/interactividad.png' /></a>
                  </div>
                </div>
                <div className='row' style={{ justifyContent: 'center' }}>
                  <div className='col-md-4 col-lg-4 col-sm-12 text-center'>
                    <a href='http://www.andaluciatech.org/' target='_blank' rel='noopener noreferrer'><img className='sponsor' src='/assets/img/andtech.png' /></a>
                  </div>
                  <div className='col-md-5 col-lg-5 col-sm-12 text-center'>
                    <a href='https://cartometrics.com/' target='_blank' rel='noopener noreferrer'><img className='cartometrics' src='/assets/img/cartometrics.png' /></a>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-4 col-lg-4 col-sm-12 text-center'>
                    <a href='https://www.polodigital.eu/' target='_blank' rel='noopener noreferrer'><img className='img-responsivePolo' src='/assets/img/polo.png' /></a>
                  </div>
                  <div className='col-md-4 col-lg-4 col-sm-12 text-center'>
                    <a href='http://www.malaga.eu/' target='_blank' rel='noopener noreferrer'><img className='img-responsive' src='/assets/img/ayunt.png' /></a>
                  </div>
                  <div className='col-md-4 col-lg-4 col-sm-12 text-center'>
                    <a href='https://www.promalaga.es/' target='_blank' rel='noopener noreferrer'><img className='img-responsive' src='/assets/img/promalaga.png' /></a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Help;
