import React from 'react'

import { useNavigate } from "react-router-dom";
  import { Navigate } from 'react-router-dom';
  import { Editor } from '@tinymce/tinymce-react';


function addBookWrittenData(BooksWrittenData, UserId, AuthorName, navigate){
  var Title = document.getElementById("titleInput").value;
  const ThumbnailURL = document.getElementById("ThumbnailURL").value;
  const Discription = document.getElementById("Discription").value;

  var checkedValue = []

  var inputElements = document.getElementsByClassName('messageCheckbox');
  for(var i=0; inputElements[i]; ++i){
        if(inputElements[i].checked){
             checkedValue.push(inputElements[i].value);
        }
  }

  if(Title === "" || ThumbnailURL === "" || Discription === ""){
    alert("Empty fields")
  }
  else{

  const BookData = {
    AuthorName: AuthorName,
    Title: Title,
    ThumbnailURL: ThumbnailURL,
    Discription: Discription,
    Tags: checkedValue,
    UserId: UserId,
    "BookData": BooksWrittenData
  }

  const addData = async ()=>{
    const apiResponse = await fetch("/api/write", {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(BookData)
    })

    const datajson = await apiResponse.json();

    if(datajson.message === "TITLE_ALREADY_PRESENT"){
      alert("Title already present")
      return false
    }
    else{
      console.log(datajson.message);
      window.location.replace("/read/" + Title);
      return true
    }

  }
  return addData();
}

}



function Write(props) {
  var BookWrittenData = "";
  var navigate = useNavigate();



  const handleEditorChange = (e) => {
    BookWrittenData = e.target.getContent()
  }


    if(props.cookies.UserId === undefined){
    return (<Navigate to="/login"/>)
    }


  return (
    <div className="jumbotron jumbotron-fluid m-5">
  <div className="container">
    <h1 className="display-4"><b>Write Your Book</b></h1>
    <hr className='my-5'/>
    <form>
  <div className="form-group">
    <label for="exampleFormControlInput1"><h5>Title</h5></label>
    <input type="text" className="form-control is-valid" id="titleInput"/>
  </div>

  <div className="form-group">
    <label for="exampleFormControlInput1"><h5>Link of Thumbnail Image</h5></label>
    <input type="text" className="form-control is-valid" id="ThumbnailURL"/>
  </div>
  
  <div className="form-group">
    <label for="exampleFormControlTextarea1"><h5>Description</h5></label>
    <textarea className="form-control is-invalid" id="Discription" rows="3"></textarea>
  </div>

  <label for="exampleFormControlTextarea1"><h5>Select Tag</h5></label>
  <div class="form-check d-flex justify-content-center flex-wrap">

            <div className='p-2 m-2'>
        <input class="form-check-input messageCheckbox" type="checkbox" value="Drama" id="defaultCheck1"/>
        <label class="form-check-label" for="defaultCheck1">
            
        <div class="badge badge-primary">Drama</div>
        </label>
  </div>

  <div className='p-2 m-2'>
    <input class="form-check-input messageCheckbox" type="checkbox" value="Romance" id="defaultCheck1"/>
    <label class="form-check-label" for="defaultCheck2">
        
    <div class="badge badge-secondary">Romance</div>
    </label>
  </div>

  <div className='p-2 m-2'>
    <input class="form-check-input messageCheckbox" type="checkbox" value="Comedy" id="defaultCheck1"/>
    <label class="form-check-label" for="defaultCheck2">
        
    <div class="badge badge-success">Comedy</div>
    </label>
  </div>


  <div className='p-2 m-2'>
    <input class="form-check-input messageCheckbox" type="checkbox" value="Advanture" id="defaultCheck1"/>
    <label class="form-check-label" for="defaultCheck2">
        
    <div class="badge badge-danger">Advanture</div>
    </label>
  </div>

  <div className='p-2 m-2'>
    <input class="form-check-input messageCheckbox" type="checkbox" value="Horror" id="defaultCheck1"/>
    <label class="form-check-label" for="defaultCheck2">
        
    <div class="badge badge-warning">Horror</div>
    </label>
  </div>
</div>
<p/>
<label for="exampleFormControlTextarea1"><h5>Write here</h5></label>
<Editor
        initialValue=""
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist autolink lists link image',
            'charmap print preview anchor help',
            'searchreplace visualblocks code',
            'insertdatetime media table paste wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic | \
            alignleft aligncenter alignright | \
            bullist numlist outdent indent | help'
        }}
        onChange={handleEditorChange}
      />
<button type="button" class="btn btn-success p-3 m-3" onClick={()=>{
  const title = addBookWrittenData(BookWrittenData, props.cookies.UserId, props.cookies.UserName, navigate)
  if(title !== false){
    console.log("running this function", title);
    // setTimeout(()=>{
    // window.location.replace("/read/" + title);
    // }, 1000)

  }



}}>Publish</button>
<a href = "/"><button type="button" class="btn btn-danger p-3 m-3">Discard</button></a>


</form>
  </div>
</div>

  )
}

export default Write