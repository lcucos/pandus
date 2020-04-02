/**
 * States/Regions summary pie chart
 *   
 * Author: lcucos
 * Date  : March 30 2020
 */

import React, { Component } from 'react'
import {PieChart, Pie, Cell} from 'recharts';
import './styles.css';
import {exponentialClustering} from './Utils.js'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884bc', '#c9af95','#be4401','#7e793f','#f05bb5',];
const RADIAN = Math.PI / 180;    

class SimplePieChart extends Component{

    constructor(props) {
        super(props);
        this.state = {
            data:props.data,
            key:props.key
        }
    }

    renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
        const x  = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy  + radius * Math.sin(-midAngle * RADIAN);
        
        const radius2 = outerRadius + (outerRadius - innerRadius) * 0.3;
        const x2  = cx + radius2 * Math.cos(-midAngle * RADIAN);
        const y2 = cy  + radius2 * Math.sin(-midAngle * RADIAN);
    
        return (
        <g className='recharts-cartesian-axis'>            
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
            >
            {
                this.state.data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} key={"key:"+this.state.key}/>)
            }
            </Pie>
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
            <div className='row-components'> 
            
            <div className='recharts-cartesian-axis'>
                Positive
                <p/>
            <SimplePieChart data={this.state.dataPositives} dataKey={'1'}/>
            </div>
            <div className='recharts-cartesian-axis'>
                Deaths
                <p/>
            <SimplePieChart data={this.state.dataDeaths} dataKey={'2'}/>
            </div>
            </div>
            </div>
        );
    }
}

export default  PieChartSummary

