import * as React from 'react';

//Todo: move the styles file loaded in html to here...

class HTMLCommentBox extends React.Component {

  componentWillMount() {
    let script = document.createElement('script');
    let hcb_user = {}
    if(!window.hcb_user){
        hcb_user={};
     } 
     
    script.setAttribute('id', 'HCB_comment_box_script');
    //console.log("about to setup Html Comment Box script")

    script.onload = function(){
        //console.log("Loaded Html Comment Box script")
     }

    var l=hcb_user.PAGE || (""+window.location).replace(/'/g,"%27");

    const h="https://www.htmlcommentbox.com";
    script.src = h+"/jread?page="+encodeURIComponent(l).replace("+","%2B")+process.env.REACT_APP_HCB_SEC
    
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  componentWillUnmount () {
   
   let embededhcb = document.getElementById('HCB_comment_box_script');
   if (embededhcb) {
      embededhcb.remove();
   }
  }

  render() {
    return (
        <div id ='HCB_comment_box' style={{textAlign:"left"}}>      
        </div>
    );
  }

}

export default HTMLCommentBox;