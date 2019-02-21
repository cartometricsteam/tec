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
                  <div className='col-md-4 col-lg-4 col-sm-12 text-center'>

                    <a href='https://www.uma.es/rce/'><img className='sponsor' src='/assets/img/rce.png' /></a>

                  </div>

                  <div className='col-md-4 col-lg-4 col-sm-12 text-center'>

                      <a href='https://www.uma.es/rce/'><img className='sponsorTec' src='/assets/img/tec.png'/></a>

                  </div>

                  <div className='col-md-4 col-lg-4 col-sm-12 text-center'>

                    <a href='http://geotecnologias.uma.es/'><img className='sponsorGeo' src='/assets/img/rges.png' /></a>

                  </div>

                <div className='row'>

                <div className='col-md-3 col-lg-3 col-sm-12 text-center'>
                  <a href='http://www.malaga.eu/'><img className='img-responsive' src='/assets/img/ayunt.png' /></a>
                </div>


                    <div className='col-md-3 col-lg-3 col-sm-12 text-center'>
                      <a href='http://www.andaluciatech.org/'><img className='img-responsive' src='/assets/img/andtech.png' /></a>
                    </div>

                    <div className='col-md-3 col-lg-3 col-sm-12 text-center'>
                      <a href='https://www.promalaga.es/'><img className='img-responsive' src='/assets/img/promalaga.png' /></a>
                    </div>

                    <div className='col-md-3 col-lg-3 col-sm-12 text-center'>
                      <a href='https://www.polodigital.eu/'><img className='img-responsivePolo' src='/assets/img/polo.png' /></a>
                    </div>

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
