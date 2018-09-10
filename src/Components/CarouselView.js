import React, { Component } from 'react';
import MeteoriteStrike from './Projects/MeteoriteStrike';
import GrossProduct from './Projects/GrossProduct';
import ForceDirectedGraph from './Projects/ForceDirectedGraph';
import GlobalSurfaceTemp from './Projects/GlobalSurfaceTemp';
import ScatterPlot from './Projects/ScatterPlot';

import MeteoriteStrikeImage from '../images/World-Map.png';
import GrossProductImage from '../images/Gross-Product.png';
import ForceDirectedImage from '../images/Force-Directed.png';
import SurfaceTempImage from '../images/Surface-Temp.png';
import ScatterPlotImage from '../images/Scatter-Plot.png';

import './main.css';

export default class CarouselView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'ScatterPlot'
    };
  }
  componentDidUpdate() {
    const meteorite = document.querySelectorAll('div.MeteoriteStrikeTooltip');
    const surface = document.querySelectorAll('div.GlobalSurfaceTempTooltip');
    const product = document.querySelectorAll('div.GrossProductTooltip');

    meteorite.forEach(elements => (elements.style.opacity = 0));
    surface.forEach(elements => (elements.style.opacity = 0));
    product.forEach(elements => (elements.style.opacity = 0));
  }
  displayHero = () => {
    const { selected } = this.state;
    switch (selected) {
      case 'GrossProduct':
        return <GrossProduct />;
      case 'MeteoriteStrike':
        return <MeteoriteStrike />;
      case 'ForceDirectedGraph':
        return <ForceDirectedGraph />;
      case 'GlobalSurfaceTemp':
        return <GlobalSurfaceTemp />;
      case 'ScatterPlot':
        return <ScatterPlot />;
      default:
        return null;
    }
  };
  render() {
    return (
      <div className="hero-container">
        {this.displayHero()}
        <div className="images">
          <img
            src={MeteoriteStrikeImage}
            alt="meteorite graph"
            onClick={() => this.setState({ selected: 'MeteoriteStrike' })}
          />
          <img
            src={GrossProductImage}
            alt="gross product graph"
            onClick={() => this.setState({ selected: 'GrossProduct' })}
          />
          <img
            src={ForceDirectedImage}
            alt="force directed graph"
            onClick={() => this.setState({ selected: 'ForceDirectedGraph' })}
          />
          <img
            src={SurfaceTempImage}
            alt="surface temp graph"
            onClick={() => this.setState({ selected: 'GlobalSurfaceTemp' })}
          />
          <img
            src={ScatterPlotImage}
            alt="scatter plot graph"
            onClick={() => this.setState({ selected: 'ScatterPlot' })}
          />
        </div>
      </div>
    );
  }
}
