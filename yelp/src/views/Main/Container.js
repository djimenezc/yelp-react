import React from 'react'
import Map, {GoogleApiWrapper} from 'google-maps-react'
import {searchNearby} from 'utils/googleApiHelpers'
// our webpack alias allows us to reference `components`
// relatively to the src/ directory
import Header from 'components/Header/Header'
import Sidebar from 'components/Sidebar/Sidebar'

import styles from './styles.module.css'

export class Container extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      places: [],
      pagination: null
    }
  }

  onReady(mapProps, map) {

    const {google} = this.props;

    const opts = {
      location: map.center,
      radius: '500',
      types: ['cafe']
    };

    searchNearby(google, map, opts)
      .then((results, pagination) => {
        // We got some results and a pagination object
        this.setState({
          places: results,
          pagination
        })
      }).catch((status, result) => {
      // There was an error
    })
  }

  onMarkerClick(item) {
    const {place} = item; // place prop
  }

  render() {

    let children = null;
    if (this.props.children) {
      // We have children in the Container component
      children = React.cloneElement(
        this.props.children,
        {
          google: this.props.google,
          places: this.state.places,
          loaded: this.props.loaded,
          onMarkerClick: this.onMarkerClick.bind(this)
        });
    }

    return (
      <div>
        Hello from the container
        <Map
          onReady={this.onReady.bind(this)}
          google={this.props.google}
          className={styles.wrapper}
          visible={false}/>

        <Header />
        <Sidebar
          title={'Restaurants'}
          places={this.state.places}/>

        <div className={styles.content}>
          {/* Setting children routes to be rendered*/}
          {children}
        </div>

      </div>
    )
  }
}

//noinspection Eslint
export default GoogleApiWrapper({
  apiKey: __GAPI_KEY__
})(Container)
