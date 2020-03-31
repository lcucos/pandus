/**
 * Summary info and visualization toggle buttons 
 *   
 * Author: lcucos
 * Date  : March 25 2020
 */

import React from 'react'
import './styles.css';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {updateTests} from './MapChart.js'
import {Colors} from './Colors.js'


function createButton(index,id, color, value, percent, text, precentText){
    return (
        <ToggleButton key={index} value={id} >
        <div style = {{ width: '200px', height: '50px'}}>
        <center>
        <b><font size="6" color={color}>
        {Number(value).toLocaleString()}
        </font></b>
        <br/>
        <font color={color}>
           {text}
        </font>
        <br/>    
        {percent>=0?(percent*100).toFixed(2)+" % ":""}
        <font size='1'>
        <div style={{height:'1px', background: 'transparent'}}>
    
</div>
        {percent>=0?precentText:""}
        </font>
        </center>
        </div>
        </ToggleButton>
    );
}

export default function ToggleButtonSummary(data) {  
    const summary  = data.summary
    const [alignment, setAlignment] = React.useState(data.showFlags);
    const handleChange = (event, newAlignment) => {
       setAlignment(newAlignment);
       updateTests(newAlignment)
    };
    const children = [
        createButton(1,"tests",Colors.test,summary.tests,-1,"Tests", ""),
        createButton(2,"positives",Colors.positive,summary.positives,summary.positives/summary.tests,"Positives","of tests"),
        createButton(3,"hospitalized",Colors.hospitalized,summary.hospitalized,summary.hospitalized/summary.positives,"Hospitalized", "of positives"),
        createButton(4,"deaths",Colors.death,summary.deaths,summary.deaths/summary.positives,"Deaths", "of positives")
    ];
    return (
      <div>
       <Grid container spacing={4} direction="column" alignItems="center">
         <Grid item>
           <ToggleButtonGroup size="large" value={alignment} onChange={handleChange}>
             {children}
           </ToggleButtonGroup>
         </Grid>
       </Grid>
       </div>
     );
   
  }
 