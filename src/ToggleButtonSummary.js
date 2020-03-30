import React from 'react'
import './styles.css';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {updateTests} from './USAMap.js'


function createButton(index,id, color, value,text){
    return (
        <ToggleButton key={index} value={id}>
        <div style = {{ width: '200px', height: '50px'}}>
        <center>
        <b><font size="6" color={color}>
        {Number(value).toLocaleString()}
        </font></b>
        <br/>
        <font color={color}>
           {text}
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
        createButton(1,"tests","gray",summary.tests,"Tests"),
        createButton(2,"positives","#cf7150",summary.positives,"Positives"),
        createButton(3,"hospitalized","#0000CC",summary.hospitalized,"Hospitalized"),
        createButton(4,"deaths","#832707",summary.deaths,"Deaths")
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
       <br/>
       <br/>
       </div>
     );
   
  }
 