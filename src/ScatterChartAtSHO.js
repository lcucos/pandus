import React, { Component} from 'react'
import {Tooltip, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Legend, CartesianGrid, Dot} from 'recharts'
import './ScatterChartAtSHO.css';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Divider from '@material-ui/core/Divider';


// max radius    
const maxRadius = 80
export default class ScatterChartAtSHO extends Component{
    maxRange = 0
    axesSetup = [1,0,2]

    axes=[
        {
           name:   "Discovery Rate",
           label:  "Discovery Rate %",
           dataKey:"discovery_sho"
        },
        {
            name: "Growth Factor",
            label:"Growth Factor",
            dataKey:"positivegrowthrate_sho"
        },
        {
            name: "Positives @ 1 Mil",
            label:"Positives @ 1 Mil",
            dataKey:"positives_pm_sho"
        }
    ]
    measurements=[
        {
            name: "Positives",
            label:"Positives",
            dataKey:"positives_sho"
        },
        {
            name: "Positives @ 1 Mil",
            label:"Positives @ 1 Mil",
            dataKey:"positives_pm_sho"
        },
        {
            name: "Deaths",
            label:"Deaths",
            dataKey:"deaths_sho"
        },
        {
            name: "Deaths @ 1 Mil",
            label:"Deaths @ 1 Mil",
            dataKey:"deaths_pm_sho"
        }
    ]
    toggleButtonDefaultValue = 1

    constructor(props){
        super(props)
        this.state={
            toggleButtonValue:this.toggleButtonDefaultValue,
            data:props.data.slice(),
            mapStates:props.mapStates
        }
        this.customizedShape = this.customizedShape.bind(this)
        this.sortData = this.sortData.bind(this)
        this.renderTooltipChart = this.renderTooltipChart.bind(this)
        this.handleChange = this.handleChange.bind(this)
        
        this.prepData(this.toggleButtonDefaultValue)
    }

    sortData(a,b){
        var key= this.axes[this.axesSetup[2]].dataKey
        var a1 = !!a[key] ? a[key] : -1
        var b1 = !!b[key] ? b[key]:-1
        return a1 < b1? 1 : -1
    }


    prepData(val){
        this.axes[2]= this.measurements[val]
        this.axes[1].dataKey=val<2?"positivegrowthrate_sho":"deathgrowthrate_sho"
        // sort the array according to the zAxis increasing        
        this.state.data.sort(this.sortData)
        // find maxValue
        this.maxRange = 1
        this.state.data.forEach((item) =>{
            if(isNaN(item[this.axes[this.axesSetup[2]].dataKey])==false &&
                item[this.axes[this.axesSetup[2]].dataKey] > this.maxRange){
                this.maxRange = item[this.axes[this.axesSetup[2]].dataKey]
            }
        })
    }

    customizedShape(props){
        const {cx, cy, cz} = props; 
        if(!! cx ===false || !! cy === false){
            return 
        }

        var stateObj = this.state.mapStates[props.stateCode]
        var r = props[this.axes[this.axesSetup[2]].dataKey] * maxRadius/this.maxRange

        if(isNaN(r) || r==0){
            return 
        }

        var x=0//r < 5 ? 5: 0 
        var y=r < 5 ? -4: -r-4  
        return (
          <g>
            <Dot cx={cx} cy={cy} r={r} fillOpacity={0.3} fill={stateObj.color} stroke={stateObj.color}/>
            <g transform={`translate(${cx},${cy})`}>
            <text x={x} y={y} dy={0} textAnchor="middle" color='gray'>{props.stateCode}</text>
            </g>
          </g>
         );
      };

    addTooltipItem(name, value, color,digit, postfix){
        if(value===undefined){
            return ("")
        }
        return(
        <>
        <div key={1} align='left'  style={{color:color}}>{name}</div>
        <div key={2} align='center' style={{color:color}}>:</div>
        <div key={3} align='right' style={{color:color}}>{digit > 0?(value).toFixed(digit):Number(value).toLocaleString()}</div> 
        <div key={4} align='left'  style={{color:color, marginLeft:'5px'}}>{postfix}</div>
        </>
        )
    }

    renderTooltipChart(props){
        if(props.payload.length == 0){
            return
        }
        if(!! props.payload[this.axesSetup[0]] === false || !!props.payload[this.axesSetup[1]] === false || !!props.payload[this.axesSetup[2]]===false){
            return 
        }
        var stateObj = props.payload[0].payload
        
        var label = this.state.mapStates[stateObj.stateCode].stateName
        var rate = props.payload[this.axesSetup[1]].value

        var daysToDouble = rate > 0 ? " = " +  (1/rate).toFixed(2) + " days to double" : ""
        return (
            <div className="grid_container_tooltip" >
            <div style={{textAlign:"center"}}>{label}</div>
            <div className="grid_chart_growth_tooltip">
            {this.addTooltipItem(props.payload[this.axesSetup[0]].name, props.payload[this.axesSetup[0]].value, 'black', 2,"%")}
            {this.addTooltipItem(props.payload[this.axesSetup[1]].name, props.payload[this.axesSetup[1]].value, 'black', 3,daysToDouble)}
            {this.addTooltipItem(props.payload[this.axesSetup[2]].name, props.payload[this.axesSetup[2]].value, 'black', 0,"")}
            </div>
            <div align="left" style={{paddingLeft:'20px'}}><i>
            Stay at Home Order : {this.state.mapStates[stateObj.stateCode].stayhomeorder}
            </i></div>
            </div>
        )

    }

    handleChange(props){
        this.prepData(props)
        this.setState({toggleButtonValue:props})
    }

    renderToogleButton(){
        return (
            <div>
            <Grid style={{marginLeft:'10px'}} container spacing={4} direction="column" alignItems="center">
            <Grid item>
                <ToggleButtonGroup size="small" value={this.state.toggleButtonValue} exclusive onChange={(e, nV)=>{var n= nV !== null?this.handleChange(nV):null}}>
                    <ToggleButton key={0} value={0} aria-label="left aligned">
                        <font color='black'> Positives Total </font>
                    </ToggleButton>
                    <ToggleButton key={1} value={1} aria-label="left aligned">
                    <font color='black'>Positives @ 1 Mil</font>
                    </ToggleButton>
                    <Divider orientation="vertical" style={{marginLeft: '340px',marginRight: '340px'}} />
                    </ToggleButtonGroup>
                    <ToggleButtonGroup size="small" value={this.state.toggleButtonValue} exclusive onChange={(e, nV)=>{var n= nV !== null?this.handleChange(nV):null}}>
                    <ToggleButton key={2} value={2} aria-label="left aligned">
                    <font color='black'>Deaths Total</font>
                    </ToggleButton>
                    <ToggleButton key={3} value={3} aria-label="left aligned">
                    <font color='black'>Deaths @ 1 Mil</font>
                    </ToggleButton>

                </ToggleButtonGroup>
            </Grid>
            </Grid>

            </div>
        );
    }

    render(){
        //<ZAxis type="number" dataKey={'positives_sho'} range={[40, 17000]} name='Positive @ Mil' label = 'Positive'/>
        const axes = this.axes
        return (
            <div>
                <div align="center">
                    <p style={{paddingBottom:'10px'}}/>
                    <b>{axes[this.axesSetup[0]].name}, {axes[this.axesSetup[1]].name} and {axes[this.axesSetup[2]].name} when Stay-At-Home Order (SHO) was issued</b>
                    <br/>
                </div>
            <p style={{marginTop:'10px'}}/>
            {this.renderToogleButton()}
            <ScatterChart 
               className='recharts-cartesian-axis'
                width={1280}           
                height={450} 
                margin={{top: 10, right: 10, bottom: 30, left: 10}}
            >
                <XAxis type="number" dataKey={axes[this.axesSetup[0]].dataKey} 
                    name={axes[this.axesSetup[0]].name}
                    label={{ value: axes[this.axesSetup[0]].label, position: 'insideBottomRight', offset: -3 }}
                />
                <YAxis type="number" dataKey={axes[this.axesSetup[1]].dataKey}  
                    name={axes[this.axesSetup[1]].name}
                    label={{ value: axes[this.axesSetup[1]].label, position: 'insideTopLeft', offset: 17 }}
                />
                <ZAxis type="number" dataKey={axes[this.axesSetup[2]].dataKey} 
                    name={axes[this.axesSetup[2]].name} 
                    label ={axes[this.axesSetup[2]].label}
                />
            <CartesianGrid />
                <Tooltip content={this.renderTooltipChart} cursor={{ strokeDasharray: '5 5' }}/>
            <Legend />
                <Scatter 
                    name={axes[this.axesSetup[2]].label}
                    data={this.state.data} 
                    fill='lightgray' 
                    shape={this.customizedShape}  />
            </ScatterChart>


            </div>
        );
    }
}