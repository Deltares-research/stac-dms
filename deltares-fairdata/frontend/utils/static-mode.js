const drawButtonClass = '.mapbox-gl-draw_ctrl-draw-btn'

const StaticMode = {
  onSetup() {
    const drawButton = document.querySelector(drawButtonClass)

    if (drawButton) {
      drawButton.setAttribute('disabled', true)
    }

    this.setActionableState() // default actionable state is false for all actions

    return {}
  },
  onStop() {
    const drawButton = document.querySelector(drawButtonClass)

    if (drawButton) {
      drawButton.removeAttribute('disabled')
    }
  },
  toDisplayFeatures(state, geojson, display) {
    display(geojson)
  },
}

export default StaticMode

