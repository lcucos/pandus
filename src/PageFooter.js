/**
 * Summary info and visualization toggle buttons 
 *   
 * Author: lcucos
 * Date  : March 30 2020
 */

import React, { Component } from 'react'
import './styles.css';

export default  class PageFooter extends Component{

    constructor(props) {
       super(props);
       this.summary = props.lastUpdate
    }

    render(){
       return (
        <div>
        </div>
       );
    }
    /*<hr/><p>
    Project available on github : <a href="https://github.com/lcucos/pandus">https://github.com/lcucos/pandus</a>
    </p>
    */
 }
