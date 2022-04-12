import React from 'react'

function Card(props) {
    const title = props.title;
    const discription = props.discription;
    const tags = props.tags;
    const renderTags = [];
    const tagsData = {
      "Comedy":  <div class="badge badge-success m-2">Comedy</div>,
      "Romance": <div class="badge badge-secondary m-2">Romance</div>,
      "Advanture":<div class="badge badge-danger m-2">Advanture</div>,
      "Horror": <div class="badge badge-warning m-2">Horror</div>,
      "Drama" : <div class="badge badge-primary m-2">Drama</div>
    }
    tags.forEach(tag => {
      renderTags.push(
        tagsData[tag]
      )
      
    });


    

  return (
    <div className="card p-3 m-3  animate-right" style={{"width":" 18rem" }}>
  <img className="card-img-top sizing" src={props.thumbnailImage} alt="Card image cap"/>
  <div className="card-body">
    <h5 className="card-title">{title}</h5>
    <p className="card-text">{discription}</p>
    <div className='p-2 m-2'>
    {
renderTags
    }
 
  </div>
    <a href={"/read/" + title} className="btn btn-primary">Read this.</a>
  </div>
</div>
  )
}

export default Card