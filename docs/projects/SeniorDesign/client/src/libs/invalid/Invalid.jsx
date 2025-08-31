import React from 'react'
import './invalid.css'
import forest from '../images/forest-1.png'

function Invalid() {
  return (
    <div className='invalidDiv'>
      <p id="error-head">401</p>
      <img className="forest-img-error" src={forest} alt="forest 401"></img>
      <p>You are not authorized to view this page.</p>
      <p>If this is a mistake, please contact a member of the Genetics Whitehill Lab team.</p>
    </div>
  )
}

export default Invalid;

