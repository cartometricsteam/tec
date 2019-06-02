import React, { Component } from 'react';

// import { fromJS } from 'immutable';
import zipcelx from 'zipcelx';

class Header extends Component {

  constructor(props) {
    super(props);
    this.printCSV = this.printCSV.bind(this);
    this.state = {
      isToggleOn: false
     };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
    this.handlechange = this.handlechange.bind(this);
    this.noSubmit = this.noSubmit.bind(this);
    this.printCSV = this.printCSV.bind(this);
    this.cleanData = this.cleanData.bind(this);
    this.handleOutside = this.handleOutside.bind(this)

  }

  componentDidMount() {
  document.addEventListener('mousedown', this.handleOutside, false)
  document.addEventListener('touchend', this.handleOutside, false)

  }

  handleOutside (e) {
    if(!this.node.contains(e.target)) {
      this.setState(state => ({
        isToggleOn: false
      }))
    }
  }

  handleClick() {
    this.props.close()
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

cleanData(data) {
  let cleanedData = {}
  if (data === undefined) {
    cleanedData.value = ''
    cleanedData.type = 'string'
  }
  else {
    cleanedData.value = data
    cleanedData.type = typeof data
  }
  return cleanedData
}

  printCSV() {
  const headers = ['Nombre', 'Descripción', 'Twitter', 'Facebook', 'URL', 'email', 'Teléfono', 'Latitud','Longitud'].map(header => {
    return {value: header, type: 'string'}
  })
  const config = {
    filename: 'test',
    sheet: {
      data: [headers,...this.props.printData(['userActivities']).map(point => {
        return [this.cleanData(point.properties.name), this.cleanData(point.properties.description), this.cleanData(point.properties.twitter), this.cleanData(point.properties.facebook), this.cleanData(point.properties.url), this.cleanData(point.properties.mail), this.cleanData(point.properties.phone), this.cleanData(point.geometry.coordinates[0]), this.cleanData(point.geometry.coordinates[1])]
      })]
    }
  };

  zipcelx(config)
  }

  handlechange(event){
   this.props.gotoselected(event.target.value);
       event.preventDefault();
   }

   noSubmit(event){
     event.preventDefault()
   }


  render() {
    let logged;
    if (this.props.email != 'null' && this.props.email != undefined) {
      logged = <span>{this.props.email} </span>;
    }
    else {
      logged = <span> Inicia sesión</span>;
    }

    const buttons = this.props.buttons.map((button, key) => {
      return (
        <li className='nav-item'>
          <button type='button' className='btn btn-primary' style={{ backgroundColor: '#Ff8326' }} key={key} onClick={() => this.props.handler({ type: 'filter', title: button.name, description: button.description, id: button.id, options: button.filters })}>{button.name}</button>
        </li>
      );
    });

    const associationNames = this.props.nameList.map((name) => {
      return (
        <option value={name} />
      )
    })

    return (
      <header ref={node => this.node = node}>
        <nav className='navbar navbar-color-on-scroll fixed-top navbar-expand-lg'  style={{ backgroundColor: '#Ff8326' }}>
          {/*<div className='container' style={{ backgroundColor: '#Ff8326' }}>*/}
          <div className='navbar-translate'>
            <a className='navbar-brand' href='/'>
              <img class='logoImg' src={process.env.PUBLIC_URL + 'assets/img/logo.png'} />
            </a>
            <button onClick={this.handleClick} className='navbar-toggler' type='button' aria-expanded='false' aria-label='Toggle navigation'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='navbar-toggler-icon'></span>
              <span className='navbar-toggler-icon1'></span>
              <span className='navbar-toggler-icon2'></span>
            </button>

          </div>
          <div className={this.state.isToggleOn ? 'navbar-collapse' : 'collapse navbar-collapse'}>
            <ul className='navbar-nav ml-auto'>
              {buttons}
              <li className='nav-item'>
                <form onSubmit={this.noSubmit} className="form-inline ml-auto nav-item"  style={{ justifyContent: 'center' }}>
                  <div className="form-group has-black">
                  <input onChange={this.handlechange} type="list" className="form-control" list="activities" placeholder="Buscar por colectivo" />
                    <datalist id="activities">
                    {associationNames}
                    </datalist>
                  </div>
                </form>
              </li>

            <li className='nav-item'>
                <a className='nav-link' title='Ayuda' onClick={() => this.props.handler({ type: 'help', title: 'Plataforma de Iniciativas Ciudadanas', subtitle: '¿QUÉ INICIATIVAS CIUDADANAS HAY EN TU BARRIO?, ¿PARTICIPAS EN ALGUNA?, ¿QUIERES DARLA A CONOCER?', description: 'El objetivo de este proyecto es mostrar la ciudad de Málaga desde una perspectiva social de movimientos emergentes,iniciativas vecinales, nuevas tendencias urbanas dentro de sus barrios, dar a conocer esa realidad social -con poca visibilidad en la ciudad- además de crear una red de colectivos y asociaciones,y establecer posibles sinergias.' })}>
                  <i className='material-icons'>help</i>
                </a>
              </li>

              <li className='nav-item'>
              <a className='nav-link' title='Descargar' onClick={() => this.printCSV()}>
                  <i className='material-icons'>save</i>
                </a>
              </li>

              <li className='nav-item' ><a className='nav-link' onClick={() => this.props.handler({ type: 'login', title: 'Panel de usuario' })}><i className='material-icons'>person</i>{logged}</a></li>
            </ul>
            {/*</div>*/}
          </div>
        </nav>
      </header>
    )
  }
}

export default Header;
