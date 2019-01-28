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

   let deleteFeature = {

    };
    let editFeature = {

    };
    if (this.props.show) {
      const url = this.props.url == null ? null :<div><a href={this.props.url} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>link</i>Website</a></div>,
        twitter = this.props.twitter == null ? null : <div><a href={this.props.twitter} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>link</i>Twitter</a></div>,
        phone = this.props.phone == null ? null : <div><a href={'tel:' + this.props.phone} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>phone</i> {this.props.phone}</a></div>,
        facebook = this.props.facebook == null ? null : <div><a href={this.props.facebook} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>link</i>Facebook</a></div>,
        pointLocation = <input className='btn btn-primary justify-content-center' value='Compartir' style={{ backgroundColor: '#Ff8326' }} />,
        deletePoint = (this.props.creator === this.props.userEmail) ? <button className='btn btn-primary justify-content-center' style={{ backgroundColor: '#Ff8326' }} onClick={deleteFeature} >Eliminar </button> : null,
        editPoint = (this.props.creator === this.props.userEmail) ? <button className='btn btn-primary justify-content-center' style={{ backgroundColor: '#Ff8326' }} onClick={editFeature} > Mover </button>: null,
        img = this.props.img == null ? null : <img className='card-img-top' src={this.props.img} />;
    
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
            {phone}

            <h6 class="text-muted" >Compartir iniciativa en:</h6>
            <a  target='_blank' href={"https://twitter.com/home?status=" + encodeURI('localhost.com/#15/' + this.props.location[1] + '/' + this.props.location[0] ) } className='card-link'><i class='fa fa-twitter'></i> </a>
            <a target='_blank' href={"https://facebook.com/sharer/sharer.php?u=" + encodeURI('localhost.com/#15/' + this.props.location[1] + '/' + this.props.location[0] ) } className='card-link'><i class='fa fa-facebook-square'> </i></a>

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
