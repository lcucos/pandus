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


function createButton(index,id, color, value, precentText, text, percent){
    return (
        <ToggleButton key={index} value={id} >
        <div style = {{ width: '200px', height: '50px'}}>
        <center>
          <div className='recharts-cartesian-axis'>
        <b><font size="6" color={color}>
        {Number(value).toLocaleString()}
        </font></b>
        <br/>
        <font color={color}>
           {text}
        </font>
        </div>
        <font color='gray'>
        {percent}
        </font>
        <font size='2' color='gray'>
        <div style={{height:'1px', background: 'transparent'}}>
       </div>
        {precentText}
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
        createButton(1,"tests",Colors.test,summary.tests,
            (summary.tests*100/summary.totPopulation).toFixed(2) + " % (of population)",
            "Tests", 
            Number(Math.ceil(summary.tests*1000000/summary.totPopulation)).toLocaleString() + " @ 1 Mil"),
        createButton(2,"positives",Colors.positive,summary.positives,
            (summary.positives/summary.tests*100).toFixed(2) + " % (of tests)",
            "Positives",
            Number(Math.ceil(summary.positives*1000000/summary.totPopulation)).toLocaleString() + " @ 1 Mil"),
        createButton(3,"hospitalized",Colors.hospitalized,summary.hospitalized,
            (summary.hospitalized/summary.positives*100).toFixed(2) + " % (of positives)",
            "Hospitalized", Math.ceil(summary.hospitalized*1000000/summary.totPopulation) + " @ 1 Mil"),
        createButton(4,"deaths",Colors.death,summary.deaths,
            (summary.deaths/summary.positives*100).toFixed(2) + " % (of positives)",
            "Deaths", 
            Math.ceil(summary.deaths*1000000/summary.totPopulation) + "  @ 1 Mil")
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
 