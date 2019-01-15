import React, { Component } from 'react';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {isToggleOn: false};

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

  render() {
    const logged = this.props.email ? <span>{this.props.email} </span> : <span> Inicia sesión</span> ;
    const buttons = this.props.buttons.map((button, key) => {
      return (
        <li className='nav-item'>
          <button type='button' className='btn btn-primary' style={{ backgroundColor: '#Ff8326' }} key={key} onClick={() => this.props.handler({ type: 'filter', title: button.name, id: button.id, options: button.filters })}>{button.name}</button>
        </li>
      );
    });

    return (
      <header>
        <nav className='navbar navbar-color-on-scroll fixed-top navbar-expand-lg' style={{ backgroundColor: '#Ff8326' }}>
          {/*<div className='container' style={{ backgroundColor: '#Ff8326' }}>*/}
            <div className='navbar-translate'>
              <a className='navbar-brand' href='/'>
              <img class='logoImg' src={process.env.PUBLIC_URL + 'assets/img/logo.png'} />
                {this.props.title}
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
                  <form className="form-inline ml-auto nav-item" style={{justifyContent:'center'}}>
                    <div className="form-group has-black">
                      <input type="text" className="form-control" placeholder="Buscar por asociación" />
                    </div>

                  </form>
                </li>
                <li className='nav-item'>
                  <a className='nav-link-help' title='Ayuda' onClick={() => this.props.handler({ type: 'help', title: 'Plataforma de Iniciativas Ciudadanas', subtitle: '¿QUÉ INICIATIVAS CIUDADANAS HAY EN TU BARRIO?, ¿PARTICIPAS EN ALGUNA?, ¿QUIERES DARLA A CONOCER?', description: 'El objetivo de este proyecto es mostrar la ciudad de Málaga desde una perspectiva social de movimientos emergentes,iniciativas vecinales, nuevas tendencias urbanas dentro de sus barrios, dar a conocer esa realidad social -con poca visibilidad en la ciudad- además de crear una red de colectivos y asociaciones,y establecer posibles sinergias.' })}>
                    <i className='material-icons'>help</i>
                  </a>
                </li>
                <li className='nav-item'><a className='nav-link' onClick={() => this.props.handler({ type: 'login', title: 'Accede o crea tu cuenta' })}><i className='material-icons'>person</i>{logged}</a></li>
              </ul>
            {/*</div>*/}
          </div>
        </nav>
      </header>
    )
  }
}

export default Header;
