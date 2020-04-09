/**
 * Header section 
 *   
 * Author: lcucos
 * Date  : March 25 2020
 */

import React, { Component } from 'react'
import './styles.css';

class PageHeader extends Component{

    constructor(props) {
       super(props);
       this.summary = props.summary
    }
    onClick(){
      window.location.href = 'https://twitter.com/myroadtime?ref_src=twsrc%5Etfw'
     }
    render(){
       return (
        <div>
        <div className='center_right_left_container'> 
          <div style={{float:'right', marginRight:'150px'}}>
            <a href='https://twitter.com/myroadtime?ref_src=twsrc%5Etfw'> <img border="0"  style={{width:'30px', height:'30px'}} src={process.env.PUBLIC_URL +'/twitter.png'}/></a>
          </div>
          <div style={{float:'center',marginLeft:'180px'}}>
            <h1>Covid19 Status</h1>
          </div>  
        </div>
            <h1>USA</h1>
        <div align='center' className="StylesParagraph">
          Community project sponsored by <a href="https://www.myroadtime.com">MyRoadTime</a>  using data from <a href="https://covidtracking.com/">The COVID Tracking Project</a>. 
          Please click <a href="https://covidtracking.com/about-tracker/">here</a> for important information regarding data accuracy and recency.
          <p/>
          Last data update: {this.summary.lastUpdate} EST
        </div>

        <br/>
        <br/>
        </div>
       );
    }
 }
 
 export default  PageHeader;