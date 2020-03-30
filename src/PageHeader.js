import React, { Component } from 'react'
import './styles.css';

 class PageHeader extends Component{

    constructor(props) {
       super(props);
       this.summary = props.lastUpdate
    }

    render(){
       return (
        <div>
        <div align='left'>
          <h1>Covid19 status in U.S.</h1>
        </div>  
        <div align='left' className="StylesParagraph">
          Community project sponsored by <a href="https://www.myroadtime.com">MyRoadTime</a>  using data from <a href="https://covidtracking.com/about-tracker/">The COVID Tracking Project</a>
          <p/>
          Last update: {this.summary.lastUpdate} EST
        </div>
        <br/>
        <br/>
        </div>
       );
    }
 }
 
 export default  PageHeader;