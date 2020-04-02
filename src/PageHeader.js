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

    render(){
       return (
        <div>
        <div align='left'>
          <h1>Covid19 Status : USA</h1>
        </div>  
        <div align='left' className="StylesParagraph">
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