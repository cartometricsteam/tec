import React, { Component } from 'react';
import Dashboard from './Dashboard';
import Help from './Help';
import FilterPanel from './FilterPanel';
import Form from './Form';

class Modal extends Component {
  render() {

    const modalHeader = <div className='modal-header'> <h5 className='modal-title'>{this.props.title}</h5><button type='button' className='close' aria-label='Close' onClick={() => this.props.handler(false, 'Tu iniciativa NO ha sido registrada. Creala de nuevo si quieres añadirla a nuestra base de datos', this.props.data.id)}><span aria-hidden='true'>&times;</span></button></div>;

    if (this.props.type === 'help') {
      return (
        <Help title={this.props.title} subtitle={this.props.subtitle} description={this.props.description} handler={this.props.handler} />
      )
    }
    else if (this.props.type === 'login') {
      return (
        <Dashboard title={this.props.title} handler={this.props.handler} userLog={this.props.userLog} email={this.props.email} />
      )
    }

    else if (this.props.type === 'filter') {
      return (
        <FilterPanel title={this.props.title} description={this.props.description} removeFilters={this.props.removeFilters} id={this.props.id} handleFilters={this.props.handleFilters} handler={this.props.handler} options={this.props.options} />
      )
    }

    else if (this.props.type === 'edit') {
      if (this.props.email) {
        return (
          <div className='modal fade show' style={{ display: 'block', overflow: 'auto' }} tabIndex='-1' role='dialog' aria-labelledby='ModalLabel' aria-hidden='true'>
            <div className='modal-dialog' role='document'>
              <div className='modal-content'>
                {modalHeader}
                <div className='modal-body'>
                  <h6>Rellena todos los campos para añadir tu iniciativa.</h6>
                  <Form collection={this.props.collection} handler={this.props.handler} data={this.props.data} email={this.props.email} />
                </div>
              </div>
            </div>
          </div>
        )
      }
      else {
        return (
          <div className='modal fade show' style={{ display: 'block', overflow: 'auto' }} tabIndex='-1' role='dialog' aria-labelledby='ModalLabel' aria-hidden='true'>
            <div className='modal-dialog' role='document'>
              <div className='modal-content'>
                {modalHeader}
                <div className='modal-body'>
                  <h6>Tienes que estar registrado para añadir iniciativas</h6>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    else {
      return null;
    }
  }
}

export default Modal;