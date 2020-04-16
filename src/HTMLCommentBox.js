import * as React from 'react';

class HTMLCommentBox extends React.Component {

    componentDidUpdate() {
    let script = document.createElement('script');
    let hcb_user = {}
    if(!window.hcb_user){
        hcb_user={};
     } 
     
    script.setAttribute('id', 'HCB_comment_box');

    script.onload = function(){
        //var s=document.createElement("script"),
        //var l=hcb_user.PAGE || (""+window.location).replace(/'/g,"%27"), 
     }

    var l=hcb_user.PAGE || (""+window.location).replace(/'/g,"%27");

    const h="https://www.htmlcommentbox.com";
    script.src = h+"/jread?page="+encodeURIComponent(l).replace("+","%2B")+process.env.REACT_APP_HCB_SEC
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  componentWillUnmount () {
   /*
   let klipfolioEmbed = document.getElementById('klipfolioEmbed');
   let klipfolioDashboard = document.getElementById('klipfolioDashboard');
   if (klipfolioEmbed && klipfolioDashboard) {
      klipfolioEmbed.remove(); 
      klipfolioDashboard.remove();
   }
   */
  }
  render() {
    return (
        <div style="text-align:left"  id="HCB_comment_box">
        
        </div>
    );
  }

}

export default HTMLCommentBox;