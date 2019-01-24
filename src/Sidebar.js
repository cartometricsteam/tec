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
      const url = this.props.url == null ? null : <div><a href={this.props.url} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>link</i>Website</a></div>,
        twitter = this.props.twitter == null ? null : <div><a href={this.props.twitter} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>link</i>Twitter</a></div>,
        phone = this.props.phone == null ? null : <div><a href={'tel:' + this.props.phone} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>phone</i> {this.props.phone}</a></div>,
        facebook = this.props.facebook == null ? null : <div><a href={this.props.facebook} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>link</i>Facebook</a></div>,
        deletePoint = (this.props.creator === this.props.userEmail | this.props.creator == null) ? <input className='btn btn-primary justify-content-center' value='Eliminar' style={{ backgroundColor: '#Ff8326' }} /> : null,
        editPoint = (this.props.creator === this.props.userEmail | this.props.creator == null) ? <input className='btn btn-primary justify-content-center' value='Editar' style={{ backgroundColor: '#Ff8326' }} /> : null,
        img = this.props.img == null ? null : <img className='card-img-top' src={this.props.img} />;
      return (
        <div className='card card-sidebar' style={{ overflow: 'auto' }}>
          <div className='modal-header'> <h5 className='modal-title'>{this.props.title}</h5><button type='button' className='close' aria-label='Close' onClick={this.props.closeSidebar}><span aria-hidden='true'>&times;</span></button></div>
          {img}
          <div className='card-body'>

            <h5 class="text-muted">{this.props.address}</h5>

            <div class="blockquote undefined">  <p className=' text-justify'>{this.props.description}</p></div>
            <h6 class="text-muted">Contacto:</h6>

            {url}
            {twitter}
            {facebook}
            {phone}

            <h6 class="text-muted" >Compartir iniciativa en:</h6>
            <a target='_blank' href={"https://twitter.com/intent/tweet?url=" + encodeURIComponent("example.com/#14/" + this.props.location[1] + "/" + this.props.location[0])} className='card-link'><i class='fa fa-twitter'></i> </a>
            <a target='_blank' href={"https://facebook.com/sharer/sharer.php?u=" + encodeURIComponent("example.com/#14/" + this.props.location[1] + "/" + this.props.location[0])} className='card-link'><i class='fa fa-facebook-square'> </i></a>



            <div className='modal-body' style={{ textAlign: 'center' }}>
              {deletePoint}
              {editPoint}
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
