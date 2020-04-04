/**
 * States/Regions summary pie chart
 *   
 * Author: lcucos
 * Date  : March 30 2020
 */

import React, { Component } from 'react'
import {PieChart, Pie, Cell, Tooltip} from 'recharts';
import './styles.css';
import {exponentialClustering} from './Utils.js'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884bc', '#c9af95','#be4401','#7e793f','#f05bb5',];
const RADIAN = Math.PI / 180;    

function MyCustomTooltip (tooltipProps) {
    if(tooltipProps.payload.length ===0){
        return
    }
    var text = tooltipProps.payload[0].name + " : " + Number(tooltipProps.payload[0].value).toLocaleString()
    return <div className='recharts-cartesian-axis' style={{backgroundColor:'white',padding: '12px', borderColor: 'lightgray', borderStyle: 'solid',borderWidth: '1px'}} >
        {text}
        </div>
}

class SimplePieChart extends Component{
    renderedLabel=false

    constructor(props) {
        super(props);
        this.state = {
            data:props.data,
            key:props.dataKey
        }
    }

    renderCenterLabel(cx, cy){
        if(this.renderedLabel){
            return
        }
        this.renderedLabel = true
        return(
        <text x={cx} y={cy} dominantBaseline="central" textAnchor="middle">
            {this.state.key}
        </text>
        )            
    }
    renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
        const x  = cx + radius * Math.cos(-midAngle * RADIAN);
        
        const radius2 = outerRadius + (outerRadius - innerRadius) * 0.5;
        const x2  = cx + radius2 * Math.cos(-midAngle * RADIAN);
        const y2 = cy  + radius2 * Math.sin(-midAngle * RADIAN);
        
        return (
        <g className='recharts-cartesian-axis'>
        {this.renderCenterLabel(cx,cy)}
        <text x={x2} y={y2} fill="black" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
            {`${(percent * 100).toFixed(1)}% : ` + this.state.data[index].name}
        </text>
        </g>
        );
    };
        
    render () {
        return (
           <PieChart width={640} height={350} onMouseEnter={this.onPieEnter}>
            <Pie
            data={this.state.data} 
            cx={320} 
            cy={150}             
            dataKey={"value"}
            labelLine={true}
            label={this.renderCustomizedLabel}
            outerRadius={100} 
            fill="#8884d8"
            innerRadius={50}          
            isAnimationActive={false}  
            >
            {
                this.state.data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} key={"key:"+this.state.key}/>)
            }              
            </Pie>
            <Tooltip content={MyCustomTooltip} cursor={{ fill: 'rgba(206, 206, 206, 0.2)' }}/>
        </PieChart>
        );
  }
}

class PieChartSummary extends Component{

    constructor(props) {
        super(props);
        var totDeaths=props.summary.deaths
        var arrStateGroups=exponentialClustering(props.prepData,"deaths")
        var dataDeaths=[]
        var dataPositives=[]
        var cumSum = 0 
        var i = 0
        // compute pie data
        for(i=0;i<arrStateGroups.length;i++){
            var stateArr=arrStateGroups[i].arrData
            var totalD=0
            var totalP=0
            for(var j=0;j<stateArr.length;j++){
                totalD+=props.mapStateData[stateArr[j]].deaths
                totalP+=props.mapStateData[stateArr[j]].positive
            }
            cumSum+=totalD
            if(cumSum/totDeaths > .9){
                break // add the rest all in one bucket called Other
            }
            var combinedName = stateArr.join(" / ")//(stateArr.map(item=>(props.mapStateData[item].stateName)).join(" / "))
            dataDeaths.push({
                value:totalD,
                name:combinedName
            })
            dataPositives.push({
                value:totalP,
                name:combinedName
            })

        }
        if(i<arrStateGroups.length){
            totalD=0
            totalP=0
            for(;i<arrStateGroups.length;i++){
                var stateArr=arrStateGroups[i].arrData
                for(var j=0;j<stateArr.length;j++){
                    totalD+=props.mapStateData[stateArr[j]].deaths
                    totalP+=props.mapStateData[stateArr[j]].positive
                }
            }             
            dataDeaths.push({
                value:totalD,
                name:"Other"
            })
            dataPositives.push({
                value:totalP,
                name:"Other"
            })
        }

        this.state = {
            statesSummary:props.prepData,
            statesGroups:arrStateGroups,
            dataDeaths:dataDeaths,
            dataPositives:dataPositives,
        }        
    }

    render () {
        return (
            <div>                
                <p style={{paddingBottom:'10px'}}/>
                <b>Current Distribution by State</b>
            <div className='row-components'> 
            
            <SimplePieChart data={this.state.dataPositives } dataKey={'Positive'}/>
            <SimplePieChart data={this.state.dataDeaths} dataKey={'Deaths'}/>
            </div>
            </div>
        );
    }
}

export default  PieChartSummary

