import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import Latest from './Latest';


function ChangeType(type, setAnotherType, userId){
    console.log("this function runs")

    const fetchDataMyBooks = async ()=>{
        const apiResponse = await fetch("/api/Books/" + userId + "/" + type, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const datajson = await apiResponse.json();
        setAnotherType( <Latest type = {type} data = {datajson["Data"]}/>)
        console.log("mybook" , datajson);
    }

    fetchDataMyBooks();


}


function Home(props) {

    const [latest,  setLatest] = useState("");
    const [anotherType, setAnotherType] = useState("");
    
    
    useEffect(() => {
        const fetchData = async ()=>{
            const apiResponse = await fetch("/api/Books/" + props.cookies.UserId + "/" + "Recent", {
                method: "get",
                headers: {
                    'Content-Type': 'application/json',
                }
            })
 
            const datajson = await apiResponse.json();
            console.log("home data", datajson["Data"])
            setLatest(<Latest type = "Latest" data = {datajson["Data"]}/>);
        }

        fetchData();


    
    }, [])
    


    if(props.cookies.UserId === undefined){
    return (<Navigate to="/Login"/>)
    }


    const name = props.cookies.UserName;
    


  return (
      <div>
      <div className='p-3'>
          <div className='p-3'></div>
    <div className="jumbotron">
   
    <h1 className=" fontFamily"><b>Welcome {name}</b></h1>
    <hr className="my-6"/>

    <p><b>Select a Tag that you are intrested in..</b></p>
<div class="badge badge-primary p-4 m-3" onClick={()=>{
        ChangeType("Drama", setAnotherType, props.cookies.UserId);
}}><h5>Drama</h5></div>


<div class="badge badge-secondary p-4 m-3" onClick={()=>{
        ChangeType("Romance", setAnotherType, props.cookies.UserId);
}}><h5>Romance</h5></div>


<div class="badge badge-success p-4 m-3" onClick={()=>{
        ChangeType("Comedy", setAnotherType, props.cookies.UserId);
}}><h5>Comedy</h5></div>


<div class="badge badge-danger p-4 m-3" onClick={()=>{
        ChangeType("Advanture", setAnotherType, props.cookies.UserId);
}}><h5>Advanture</h5></div>


<div class="badge badge-warning p-4 m-3" onClick={()=>{
        ChangeType("Horror", setAnotherType, props.cookies.UserId);
}}><h5>Horror</h5></div>


<div class="badge badge-info p-4 m-3" onClick={()=>{
    ChangeType("My", setAnotherType, props.cookies.UserId);

}}><h5>My Books</h5></div>



  </div>
  </div>
  {
      anotherType
  }

  {
      latest
  }




  </div>
  )
}

export default Home