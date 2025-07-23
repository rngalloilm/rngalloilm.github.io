import React from 'react'

function GenericHover(props) {
  return (
    <div className="hover-box">ⓘ
      <span className="hover-text">{props.text}</span>
    </div>
  )
}

export default GenericHover