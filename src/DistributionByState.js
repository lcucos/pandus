/**
 * States/Regions summary pie chart
 *   
 * Author: lcucos
 * Date  : March 30 2020
 */

import React, { Component, PureComponent } from 'react'
import {PieChart, Pie, Cell, Tooltip, BarChart,Bar, XAxis, YAxis, Legend, ReferenceLine} from 'recharts'
import './styles.css'
import DefaultTooltipContent from 'recharts/lib/component/DefaultTooltipContent';
import {exponentialClustering} from './Utils.js'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884bc', '#c9af95','#be4401','#7e793f','#f05bb5',];
const RADIAN = Math.PI / 180;    


function CustomTooltipPie (tooltipProps) {
    if(tooltipProps.payload.length ===0){
        return
    }
    var text = tooltipProps.payload[0].name + " : " + Number(tooltipProps.payload[0].value).toLocaleString()
    return <div className='recharts-cartesian-axis' style={{backgroundColor:'white',padding: '12px', borderColor: 'lightgray', borderStyle: 'solid',borderWidth: '1px'}} >
        {text}
        </div>
}
const mapStateCodeToName={}


function CustomTooltipBar (props) {
    if(props.payload.length ===0){
        return
    }
    const label = mapStateCodeToName[props.label]
    const newPayload = []
    for(var i=0;i<props.payload.length;i++){
        if(props.payload[i].stroke === undefined){
            continue
        }
        newPayload.push({
            name : props.payload[i].name,
            value: props.payload[i].value.toFixed(2) + " %", 
            color: props.payload[i].color
        })
    }
    //console.dir(props.payload)
    // we render the default, but with our overridden payload
    return <DefaultTooltipContent {...props} payload={newPayload} label={label}/>;

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
            <Tooltip content={CustomTooltipPie} cursor={{ fill: 'rgba(206, 206, 206, 0.2)' }}/>
        </PieChart>
        );
  }
}

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

class PieChartSummary extends Component{
    constructor(props) {
        super(props);
        var totDeaths=props.summary.deaths
        var arrStateGroups=exponentialClustering(props.prepData,"deaths")
        var dataDeaths=[]
        var dataPositives=[]
        var cumSum = 0 
        var i = 0
        var j = 0
        var stateArr = null
        var combinedName = null
        // compute pie data
        for(i=0;i<arrStateGroups.length;i++){
            stateArr=arrStateGroups[i].arrData
            var totalD=0
            var totalP=0
            for(j=0;j<stateArr.length;j++){
                totalD+=props.mapStateData[stateArr[j]].deaths
                totalP+=props.mapStateData[stateArr[j]].positive
            }
            cumSum+=totalD
            combinedName = stateArr.join(" / ")//(stateArr.map(item=>(props.mapStateData[item].stateName)).join(" / "))
            //console.log(i+" : " + combinedName + " : " +(totalD/totDeaths).toFixed(2)+" "+ cumSum  +" " + totalD  + " totDeaths = " + totDeaths + " tmp="+(tmp).toFixed(2))
            dataDeaths.push({
                value:totalD,
                name:combinedName
            })
            dataPositives.push({
                value:totalP,
                name:combinedName
            })
            if(cumSum/totDeaths > .9){
                break // add the rest all in one bucket called Other
            }
        }
        if(i<arrStateGroups.length){
            totalD=0
            totalP=0
            for(++i;i<arrStateGroups.length;i++){
                stateArr=arrStateGroups[i].arrData
                combinedName = stateArr.join(" / ")
                for(j=0;j<stateArr.length;j++){
                    totalD+=props.mapStateData[stateArr[j]].deaths
                    totalP+=props.mapStateData[stateArr[j]].positive
                }
            }             
            cumSum+=totalD
            dataDeaths.push({
                value:totalD,
                name:"Other"
            })
            dataPositives.push({
                value:totalP,
                name:"Other"
            })
        }        
        var arrPerc=[]
        for(var m in props.mapStateData){
            mapStateCodeToName[props.mapStateData[m].stateCode] = props.mapStateData[m].stateName
            arrPerc.push({
                stateCode:props.mapStateData[m].stateCode,
                "percentPositiveFromTests": props.mapStateData[m].percentPositiveFromTests,
                "percentTestsFromAll":props.mapStateData[m].tested/props.summary.tests*100,
                "percentPopulation":props.mapStateData[m].population/props.summary.totPopulation*100
            })
        }
        arrPerc.sort((a, b) => (a["percentPositiveFromTests"] > b["percentPositiveFromTests"]) ? 1 : -1)
        this.state = {
            statesSummary:props.prepData,
            statesGroups:arrStateGroups,
            dataDeaths:dataDeaths,
            dataPositives:dataPositives,
            arrPerc: arrPerc,
            refLine:(props.summary.positives/props.summary.tests*100).toFixed(2)
        }        
    }
    formatYAxis(tickItem) {
        return tickItem.toFixed(2)
    }
      

    ReferenceLabel(props) {
        const { 
            fill, value, textAnchor, 
            fontSize, viewBox, dy, dx,
        } = props;
        const x = viewBox.width + viewBox.x + 20;
        const y = viewBox.y - 6;
        return (
            <text 
                x={x} y={y}
                dy={dy}
                dx={dx}
                fill={fill}
                fontSize={fontSize || 10} 
                textAnchor={textAnchor}>
                {value}
            </text>
        )
    }
    
    barChart(data){
        //const yKey = "percentPositiveFromTests"
        const xLabel = "stateCode"

        const yKeyP_T  = "percentPositiveFromTests"
        const legP_T   = "Positive (% of tests)"
        const colorP_T = COLORS[0]

        const yKeyT_A   = "percentTestsFromAll"
        const legT_A    = "Tests (% of total)"
        const colorT_A  = COLORS[3]

        const yKeyPop_A  = "percentPopulation" 
        const legPop_A   = "Population (% of total)"
        const colorPop_A = COLORS[7]

        const refLineLabel = "Positives to Tests Average : "+this.state.refLine  + " %"
        // label={{ position: 'top',  value: 'Max PV PAGE', fill: 'red', fontSize: 14 }}
        return(
            <div align='left'>
           <BarChart
           className='recharts-cartesian-axis'
           width={1280}           
           height={250}
           data={data}
           isAnimationActive={false}  
           margin={{top: 10, right: 5, left: 0, bottom: 5}}
       >
           <XAxis dataKey={xLabel} tick={<CustomizedAxisTick/>} minTickGap={-5}/>
           <YAxis/>
           <Tooltip content={CustomTooltipBar}/>
           <Legend />
           <Bar dataKey={yKeyP_T} stackId="a" name={legP_T} stroke={colorP_T} fill={colorP_T}/>
           <Bar dataKey={yKeyT_A} stackId="a" name={legT_A} stroke={colorT_A} fill={colorT_A}/>
           <Bar dataKey={yKeyPop_A} stackId="a" name={legPop_A} stroke={colorPop_A} fill={colorPop_A}/>

           <ReferenceLine y={this.state.refLine} label={{ position: 'insideBottomLeft',  value: refLineLabel, fill: 'black', fontSize: 14 }} stroke="black" strokeDasharray="3 3" />
          </BarChart>
          </div>
        )
    }    

    render () {
        //console.dir(this.state.arrData)
        return (
            <div>                
                <p style={{paddingBottom:'10px'}}/>
                <b>Discovery Density by State</b>
            {this.barChart(this.state.arrPerc)}
            <p style={{paddingBottom:'10px'}}/>
                <b>Distribution by State</b>
            <div className='row-components'>             
            <SimplePieChart data={this.state.dataPositives } dataKey={'Positive'}/>
            <SimplePieChart data={this.state.dataDeaths} dataKey={'Deaths'}/>
            </div>

            </div>
        );
    }
}

export default  PieChartSummary

