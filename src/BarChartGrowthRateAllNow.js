import React, { Component, PureComponent } from 'react'
import {Tooltip, BarChart,Bar, XAxis, YAxis, Legend} from 'recharts'
import {Colors} from './Colors.js'
import './styles.css';
import './BarChartGrowthRateAllNow.css';

class CustomizedAxisTick extends PureComponent {
    render() {
      const {
        x, y, payload,
      } = this.props;
  
      return (
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={10} textAnchor="end" fill="#666" transform="rotate(-40)" fontSize={12}>{payload.value}</text>
        </g>
      );
    }
  }

const mapStates={}

export default class BarChartGrowthRateAllNow extends Component{
    constructor(props){
        super(props)
        
        if(props.data === undefined){
            return
        }        

        this.state = {
            data:props.data,
            averageDays:props.averageDays
        }
        // create a shalow copy
        Object.keys(props.mapStates).forEach(function(key){
            mapStates[key]=props.mapStates[key].stateName
        })

    }

    sortbyBoth(a,b){
        return a["positivegrowthrate"]+a["deathgrowthrate"] < b["positivegrowthrate"] + b["deathgrowthrate"]? -1 : 1
    }
    sortbyPositive(a,b){
        return a["positivegrowthrate"] < b["positivegrowthrate"]? -1 : 1
    }
    sortbyDeath(a,b){
        return a["deathgrowthrate"] < b["deathgrowthrate"]? -1 : 1
    }

    renderTooltipBarChart(props) {
        if(props.payload.length==0){
            return ("")
        }
        const label = mapStates[props.label]

        return (
            <div className="grid_container_tooltip" >
            <div style={{textAlign:"center"}}>{label}</div>
            <div className="grid_bar_chart_growth_tooltip">
            {props.payload.map(item=>(
                         <>
                             <div align='left'  style={{color:item.color}}>{item.name}</div>
                             <div align='center' style={{color:item.color}}>:</div>
                             <div align='right' style={{color:item.color}}>{item.value.toFixed(4)}</div> 
                             <div align='left'   style={{color:item.color, marginLeft:'8px'}}> {item.value!=0 ? " = "+(1/item.value).toFixed(2) + " days to double": ""}</div>
                         </>
                 ))}
            </div>
            </div>
        )
      }

    render(){     
        if(this.state == null)   {
            return ("")
        }
        const xLabel = "stateCode"
        this.state.data.sort(this.sortbyPositive)
        
        const yKeyP_T  = "positivegrowthrate"
        const legP_T   = "Positives"
        const colorP_T = Colors.positive//"#1e6b38"

        const yKeyD_T  = "deathgrowthrate"
        const legD_T   = "Deaths"
        const colorD_T = Colors.death//"#24964a"

        return(
            <div align="center">
            <b>Current Exponential Growth Rate</b>
            <br/>
            <div className='recharts-cartesian-axis'>(based on the last {this.state.averageDays} days average)</div>
           <BarChart
           className='recharts-cartesian-axis'
           width={1280}           
           height={250}
           data={this.state.data}
           isAnimationActive={false}  
           margin={{top: 10, right: 5, left: 0, bottom: 5}}
       >
           <XAxis dataKey={xLabel} tick={<CustomizedAxisTick/>} minTickGap={-5}/>
           <YAxis/>
           <Tooltip content={this.renderTooltipBarChart}/>
           <Legend />
           <Bar dataKey={yKeyP_T} stackId="a" name={legP_T} stroke={colorP_T} fill={colorP_T}/>
           <Bar dataKey={yKeyD_T} stackId="a" name={legD_T} stroke={colorD_T} fill={colorD_T}/>
          </BarChart>
          </div>
        )
    }    

}