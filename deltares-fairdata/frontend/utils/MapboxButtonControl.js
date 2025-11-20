/**
 * Custom Mapbox GL control for adding button controls to the map
 * Similar to the groundwater-toolbox implementation, adapted for Vue 3
 */
export default class MapboxButtonControl {
  constructor({ className = '', icon = '', title = '', eventHandler = () => {} }) {
    this._className = className
    this._eventHandler = eventHandler
    this._icon = icon
    this._title = title
  }

  onAdd(map) {
    this._map = map
    this._btn = document.createElement('button')
    this._btn.className = `mapboxgl-ctrl-icon ${ this._className } map-control-tooltip map-control-tooltip--right`
    this._btn.type = 'button'
    this._btn.title = this._title
    this._btn.onclick = this._eventHandler
    
    // Use Material Design Icons (mdi) if icon is provided
    if (this._icon) {
      this._btn.innerHTML = `<i aria-hidden="true" class="v-icon notranslate mdi ${ this._icon } theme--light"></i>`
    }

    this._container = document.createElement('div')
    this._container.className = 'mapboxgl-ctrl-group mapboxgl-ctrl'
    this._container.appendChild(this._btn)

    return this._container
  }

  onRemove() {
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container)
    }
    this._map = undefined
  }

  getDefaultPosition() {
    return 'top-left'
  }
}

