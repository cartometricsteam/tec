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
              <h6>{this.props.subtitle}</h6>
              <p className='text-justify'>{this.props.description}</p>
              <div className='container'>
                <div className='row'>
                  <div className='col-lg-12 col-md-6 col-sm-3'>
                    <div align='center'>
                      <a href='https://www.uma.es/rce/info/107549/catedra-de-tecnologias-emergentes-para-la-ciudadania/' target="_blank"><img className='img-responsive' src='/assets/img/tec.png' /></a>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-6 col-lg-6 col-sm-6 text-center'>
                    <a href='https://www.polodigital.eu/' target="_blank"><img className='img-responsive' src='/assets/img/polo.png' /></a>
                  </div>
                  <div className='col-md-6 col-lg-6 col-sm-6 text-center'>
                    <a href='http://www.andaluciatech.org/' target="_blank"><img className='img-responsive' src='/assets/img/andtech.png' /></a>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-6 col-lg-6 col-sm-6 text-center'>
                    <a href='https://www.uma.es/rce/' target="_blank"><img className='img-responsive' src='/assets/img/rce.png' /></a>
                  </div>
                  <div className='col-md-6 col-lg-6 col-sm-6 text-center'>
                    <a href='https://www.promalaga.es/' target="_blank"><img className='img-responsive' src='/assets/img/promalaga.png' /></a>
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