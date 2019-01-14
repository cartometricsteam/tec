import React, { Component } from 'react';
import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  RedditShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  WorkplaceShareButton,
  LineShareButton,
  EmailShareButton,
} from 'react-share';

class Sidebar extends Component {
  render() {
    if (this.props.show) {
      const url = this.props.url == null ? null :<div><a href={this.props.url} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>link</i>Website</a></div>,
        twitter = this.props.twitter == null ? null : <div><a href={this.props.twitter} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>link</i>Twitter</a></div>,
        phone = this.props.phone == null ? null : <div><a href={'tel:' + this.props.phone} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>phone</i> {this.props.phone}</a></div>,
        facebook = this.props.facebook == null ? null : <div><a href={this.props.facebook} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>link</i>Facebook</a></div>,
        pointLocation = <input className='btn btn-primary justify-content-center' value='Compartir' style={{ backgroundColor: '#Ff8326' }} />,
        deletePoint = this.props.creator === this.props.userEmail ? <input className='btn btn-primary justify-content-center' type='submit' value='Eliminar' style={{ backgroundColor: '#Ff8326' }} /> : null,
        editPoint = this.props.creator === this.props.userEmail ? <input className='btn btn-primary justify-content-center' type='submit' value='Editar' style={{ backgroundColor: '#Ff8326' }} /> : null; 
    
      return (
        <div className='card card-sidebar' style={{ overflow: 'auto' }}>
        <div className='modal-header'> <h5 className='modal-title'>{this.props.title}</h5><button type='button' className='close' aria-label='Close' onClick={this.props.closeSidebar}><span aria-hidden='true'>&times;</span></button></div>
          <img className='card-img-top' src={this.props.img} />
          <div className='card-body'>
            <h4 className='card-title'>{this.props.title}</h4>
            <h6 className='card-subtitle mb-2 text-muted'>{this.props.address}</h6>
            <p className='card-text'>{this.props.description}</p>
            {url}
            {twitter}
            {facebook}
            {phone}
            <div className='modal-body' style={{ textAlign: 'center' }}>
            {deletePoint}
            {editPoint}
            {pointLocation}
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