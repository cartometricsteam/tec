import React, { Component } from 'react';

class FilterPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);
    this.restoreFilters = this.restoreFilters.bind(this);


  }

  restoreFilters() {
    this.props.handler(false);
    this.props.removeFilters();
  }

  handleChange(event) {
    this.setState({ [event.target.id]: (this.state[event.target.id] === null || this.state[event.target.id] === undefined) ? true : !this.state[event.target.id] });
  }

  handleSubmission(event) {
    this.props.handleFilters({[this.props.id]: Object.keys(this.state)})
    this.props.handler(false);
    event.preventDefault();
  }

  render() {
    const header = <div className='modal-header'> <h5 className='modal-title'>{this.props.title}</h5><button type='button' className='close' aria-label='Close' onClick={() => this.props.handler(false)}><span aria-hidden='true'>&times;</span></button></div>;
    const options = this.props.options.map(option => {
      return (
        <div className='form-check'>
          <label className='form-check-label'>
            <input className='form-check-input' type='checkbox' id={option} value={option} onChange={this.handleChange}/> {option}
            <span className='form-check-sign'>
              <span className='check'></span>
            </span>
          </label>
        </div>
      )
    });

    return (
      <form onSubmit={this.handleSubmission}>
        <div className='modal fade show' style={{ display: 'block', overflow: 'auto' }} tabIndex='-1' role='dialog' aria-labelledby='ModalLabel' aria-hidden='true'>
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              {header}
              <div className='modal-body'>
                <h6>Selecciona que quieres visualizar</h6>
                {options}
              </div>
              <div className='modal-footer justify-content-center'>
                <input className='btn btn-primary justify-content-center' type='submit' value='Filtrar' style={{ backgroundColor: '#Ff8326' }} />
                <button type='button' className='btn btn-primary' style={{ backgroundColor: '#Ff8326' }} onClick={() => this.restoreFilters()}>Eliminar TODOS los filtros</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}
export default FilterPanel;