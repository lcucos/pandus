/**
 * Header section 
 *   
 * Author: lcucos
 * Date  : March 25 2020
 */

import React, { Component } from 'react'
import './styles.css';
import {TwitterShareButton,TwitterIcon} from "react-share";
import ReactFBLike from './FBReactLike.js';



class PageHeader extends Component{

    constructor(props) {
       super(props);
       this.summary = props.summary
    }

    render(){
      
       return (
        <div>

        <table width="1000">
        <tbody>
          <tr>
            <td> 
              <a href="https://www.myroadtime.com" className='text_align_vmiddle' style={{padding:'7px',backgroundColor:"#310884", color:'white'}}><b><i>MYROADTIME</i></b></a>
            </td>
            <td><center><h1 style={{marginTop:'10px'}}>Covid19 Status</h1></center></td>
            <td>
            <TwitterShareButton url='https://twitter.com/myroadtime?ref_src=twsrc%5Etfw'><TwitterIcon size={36} round/></TwitterShareButton>
            </td>

            <td>
              <div>
            <div style={{width:"55px"}} >
                  <ReactFBLike href="https://cvd19.info.myroadtime.com/"/>            
            </div>
          </div>
            </td>

          </tr>
          </tbody>
        </table>

        <h1 style={{marginTop:'0px'}}>USA</h1>
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