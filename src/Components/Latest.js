import React from 'react'
import Card from './Card'

function Latest(props) {
    const type = props.type;
    const data = props.data;
    console.log(data, "data");

    const renderCards = [];

    data.forEach(d => {
        renderCards.push(
            <Card tags = {d["Tags"]} title = {d["Title"]} discription = {d["Description"]} thumbnailImage = {d["ThumbnailURL"]}/>
        )
        
    });

    if(type === ""){
        return(
            <div></div>
        )
    }




  return (
    <div className="jumbotron ">
        <h1>{type} Books</h1>
        <hr className='my-5'/>
    <div className='d-flex justify-content-center flex-wrap'>
        {renderCards}
    </div>
    </div>
  )
}

export default Latest