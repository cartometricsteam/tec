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

  editFeature() {
    let data = this.props.featureData;
    console.log(data)
    this.props.handler({ type: 'edit', title: 'Añade una iniciativa', data: {properties: this.props.featureData, geometry: {coordinates: this.props.featureData.featureLocation, type: "Point"}}});
  }
  
  render() {
    if (this.props.show) {
      let additionalInfo = [this.props.action,this.props.enabler,this.props.area,this.props.purpose].filter(info => (info !== undefined && info.length > 1 ));      
      const url = (this.props.featureData.featureProperties.url == null || this.props.featureData.featureProperties.url == '' ) ? null :<div><a href={this.props.featureData.featureProperties.url} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>link</i>Website</a></div>,
        twitter = (this.props.featureData.featureProperties.twitter == null || this.props.featureData.featureProperties.twitter == '') ? null : <div><a href={this.props.featureData.featureProperties.twitter} target='_blank' rel="noopener noreferrer" className='card-link'><i class='fa fa-twitter'></i> Twitter</a></div>,
        email = (this.props.featureData.featureProperties.mail == null || this.props.featureData.featureProperties.mail == '') ? null : <div><a href={'mailto:' + this.props.featureData.featureProperties.mail} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>email</i> {this.props.featureData.featureProperties.mail} </a></div>,
        phone = (this.props.featureData.featureProperties.phone == null || this.props.featureData.featureProperties.phone == '') ? null : <div><a href={'tel:' + this.props.featureData.featureProperties.phone} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>phone</i> {this.props.featureData.featureProperties.phone}</a></div>,
        facebook = (this.props.featureData.featureProperties.facebook == null || this.props.featureData.featureProperties.facebook == '') ? null : <div><a href={this.props.featureData.featureProperties.facebook} target='_blank' rel="noopener noreferrer" className='card-link'><i class='fa fa-facebook-square'></i> Facebook</a></div>,
        deletePoint = (this.props.featureData.featureProperties.creator === this.props.userEmail || this.props.userEmail === 'info.teciudadania@uma.es') ? <button className='btn btn-primary-filters btn-sm' style={{ backgroundColor: '#AF2828' }} onClick={() => this.deleteFeature(this.props.featureData.featureProperties.name, this.props.featureData.featureLocation)} >Eliminar </button> : null,
        editPoint = (this.props.featureData.featureProperties.creator === this.props.userEmail || this.props.userEmail === 'info.teciudadania@uma.es' ) ? <button className='btn btn-primary-filters btn-sm' style={{ backgroundColor: '#FF8326' }} onClick={() => this.editFeature()} >Editar </button> : null,
        img = this.props.featureData.featureProperties.image == null ? null : <img className='card-img-top' src={this.props.featureData.featureProperties.image} />,
        tags = additionalInfo.length > 0 ? '#' + additionalInfo.map(text => text.replace(/\s/g,'')).join(' #') : <a href="mailto:info@teciudadania.uma.es">Ningún tag. ¡Contacta con nosotros y ayúdanos a mejorarla!</a>;

      return (
        <div className='card card-sidebar' style={{ overflow: 'auto' }}>
        <div className='modal-header'> <h5 className='modal-title'>{this.props.featureData.featureProperties.name}</h5><button type='button' className='close' aria-label='Close' onClick={this.props.closeSidebar}><span aria-hidden='true'>&times;</span></button></div>
          {img}
          <div className='card-body'>

            <h6 class="text-muted">{this.props.featureData.featureProperties.address}</h6>

          <div class="blockquote undefined">  <p className=' text-justify'>{this.props.featureData.featureProperties.description}</p></div>
          <div className='backtittleTwo'>
            <div className='backtittleThree'>
            <h6 class="text-muted" style={{padding:'5px' }}>Contacto:</h6></div>

            {url}
            {twitter}
            {facebook}
            {email}
            {phone}

            <h6 class="text-muted" >Compartir iniciativa en:</h6>
            <a  target='_blank' href={"https://twitter.com/home?status=" + encodeURIComponent('localhost.com/#15/' + this.props.featureData.featureLocation[1] + '/' + this.props.featureData.featureLocation[0] ) } className='card-link'><i class='fa fa-twitter'></i> </a>
            <a target='_blank' href={"https://facebook.com/sharer/sharer.php?u=" + encodeURIComponent('localhost.com/#15/' + this.props.featureData.featureLocation[1] + '/' + this.props.featureData.featureLocation[0] ) } className='card-link'><i class='fa fa-facebook-square'> </i></a>

             <div>
               <span>Esta iniciativa contiene los tags: {tags}</span>
             </div>

            <div className='modal-body' style={{ textAlign: 'center' }}>
              {deletePoint}
              {editPoint}
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
