import React from 'react'

function NavigateButtons() {
    function back (){
        window.history.back()
    }
    function foward (){
        window.history.forward()
    }
  return (
    <>
      <button onClick={back}>Back</button>
      <button onClick={foward}>Foward</button>
    </>
  )
}

export default NavigateButtons
