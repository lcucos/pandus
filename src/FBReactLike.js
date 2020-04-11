import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ReactFBLike extends Component {

  componentDidMount() {
    if (document && typeof document !== 'undefined') {
      ((d, s, id) => {
        const fjs = d.getElementsByTagName(s)[d.getElementsByTagName(s).length - 1];
        if (d.getElementById(id)) return;
        const js = d.createElement(s);
        js.id = id;
        js.src = `//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v6.0`;
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    }
  }

  render() {
    return (
        <div className="fb-like" colorscheme='dark' data-href="https://cvd19.info.myroadtime.com/" data-width="" data-layout="button_count" data-action="like" data-size="large" data-share="true"></div>
    );
  }
}

export default ReactFBLike;