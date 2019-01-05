import React, { Component } from 'react';

class Sidebar extends Component {
  render() {
    if (this.props.show) {
      const url = this.props.url == null ? null : <a href={this.props.url} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>link</i>Website</a>,
        twitter = this.props.twitter == null ? null : <a href={this.props.twitter} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>link</i>Twitter</a>,
        phone = this.props.phone == null ? null : <a href={'tel:' + this.props.phone} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>phone</i> {this.props.phone}</a>,
        facebook = this.props.facebook == null ? null : <a href={this.props.facebook} target='_blank' rel="noopener noreferrer" className='card-link'><i className='material-icons'>link</i>Facebook</a>;

      return (
        <div className='card card-sidebar' style={{ overflow: 'auto' }}>
        <div className='modal-header'> <h5 className='modal-title'>{this.props.title}</h5><button type='button' className='close' aria-label='Close' onClick={this.props.closeSidebar}><span aria-hidden='true'>&times;</span></button></div>;
          <img className='card-img-top' src={this.props.img} />
          <div className='card-body'>
            <h4 className='card-title'>{this.props.title}</h4>
            <h6 className='card-subtitle mb-2 text-muted'>{this.props.address}</h6>
            <p className='card-text'>{this.props.description}</p>
            <div>{url}</div>
            <div>{twitter}</div>
            <div>{facebook}</div>
            <div>{phone}</div>
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