import React, { Component } from 'react';
import * as firebase from 'firebase';
import {NotificationManager} from 'react-notifications';

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.deleteFeature = this.deleteFeature.bind(this)
  }

  deleteFeature(name, coordinates) {
    firebase.firestore().collection(this.props.collection).doc(name + '_' + coordinates[0].toFixed(2) + '_' + coordinates[1].toFixed(2)).delete()
    .then(response => {
      this.props.handler(false, 'Iniciativa eliminada con éxito. ¡Sentimos que te vayas! :( ');
  }).catch(error => {
      NotificationManager.error('Ha ocurrido un error al eliminar la iniciativa.');

  });
  };

  render() {

    if (this.props.show) {
      let additionalInfo = [this.props.action,this.props.enabler,this.props.area,this.props.purpose].filter(info => (info !== undefined && info.length > 1 ));
      const url = this.props.url == null ? null :<div><a href={this.props.url} target='_blank' rel="noopener noreferrer" className='card-link'><i className='fa fa-link' style={{marginLeft: '8px' }}></i> Website</a></div>,
        twitter = this.props.twitter == null ? null : <div><a href={this.props.twitter} target='_blank' rel="noopener noreferrer" className='card-link'><i className='fa fa-twitter' style={{marginLeft: '8px' }}></i> Twitter</a></div>,
        email = (this.props.mail == null || this.props.mail == '') ? null : <div><a href={'mailto:' + this.props.mail} target='_blank' rel="noopener noreferrer" className='card-link'><i className='fa fa-envelope' style={{marginLeft: '8px' }}>email</i> {this.props.mail}</a></div>,
        phone = (this.props.phone == null || this.props.phone == '') ? null : <div><a href={'tel:' + this.props.phone} target='_blank' rel="noopener noreferrer" className='card-link'><i className='fa fa-phone' style={{marginLeft: '8px' }} ></i> {this.props.phone}</a></div>,
        facebook = this.props.facebook == null ? null : <div><a href={this.props.facebook} target='_blank' rel="noopener noreferrer" className='card-link'><i className='fa fa-facebook-square' style={{marginLeft: '8px' }}></i> Facebook</a></div>,
        deletePoint = (this.props.creator === this.props.userEmail) ? <button className='btn btn-primary-filters btn-sm' style={{ backgroundColor: '#AF2828' }} onClick={() => this.deleteFeature(this.props.title, this.props.location)} >Eliminar </button> : null,
        img = this.props.img == null ? null : <img className='card-img-top' src={this.props.img} />,
        tags = additionalInfo.length > 0 ? '#' + additionalInfo.map(text => text.replace(/\s/g,'')).join(' #') : <a href="mailto:info@teciudadania.uma.es">Ningún tag. ¡Contacta con nosotros y ayúdanos a mejorarla!</a>;

      return (
        <div className='card card-sidebar' style={{ overflow: 'auto' }}>
        <div className='modal-header'> <h5 className='modal-title'>{this.props.title}</h5><button type='button' className='close' aria-label='Close' onClick={this.props.closeSidebar}><span aria-hidden='true'>&times;</span></button></div>
          {img}
          <div className='card-body'>

            <h6 class="text-muted">{this.props.address}</h6>

          <div class="blockquote undefined">  <p className=' text-justify'>{this.props.description}</p></div>
          <div className='backtittleTwo'>
            <div className='backtittleThree'>
            <h6 class="text-muted" style={{padding:'5px' }}>Contacto:</h6></div>

            {url}
            {twitter}
            {facebook}
            {email}
            {phone}

            <h6 class="text-muted" style={{marginLeft: '8px' }}>Compartir iniciativa en:</h6>
            <a  target='_blank' href={"https://twitter.com/home?status=" + encodeURIComponent('localhost.com/#15/' + this.props.location[1] + '/' + this.props.location[0] ) } className='card-link'><i class='fa fa-twitter' style={{marginLeft: '8px' }}></i> </a>
            <a target='_blank' href={"https://facebook.com/sharer/sharer.php?u=" + encodeURIComponent('localhost.com/#15/' + this.props.location[1] + '/' + this.props.location[0] ) } className='card-link'><i class='fa fa-facebook-square'> </i></a>

             <div style={{marginLeft: '8px' }}>
               <span>Esta iniciativa contiene los tags: {tags}</span>
             </div>

            <div className='modal-body' style={{ textAlign: 'center' }}>
              {deletePoint}
              {/* {editPoint} */}
            </div>
          </div>
        </div>
        </div>
      )
    }
    else {
      return null;
    }
  }
}

export default Sidebar;
