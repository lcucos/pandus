import React, { Component } from 'react'
import './App.css'
import worlddata from './world'
import { geoPath, geoNaturalEarth1} from 'd3-geo'

class WorldMap extends Component {
    render() {
       var width = 1200;
       var height = 720;
       const projection = geoNaturalEarth1().scale((width/640)*100).translate([width/2, height/2]);
       const pathGenerator = geoPath().projection(projection)
       const countries = worlddata.features
          .map((d,i) => <path
          key={'path' + i}
          d={pathGenerator(d)}
          stroke="#000000"
          strokeWidth={ 0.5 }         
          fill={ `rgba(40,40,40,0` }
          className='countries'
          />)
          
    return <svg width={width} height={height}>
    {countries}
    </svg>
    }
 }

 export default WorldMap