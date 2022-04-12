import React from 'react'
import { useNavigate } from "react-router-dom";

export default function Header(props) {
    var logo = require("../assets/bookworm.png");
    var navigate = useNavigate();
    const headerButtonToggle = [];

    if(props.cookies.UserId === undefined){
      headerButtonToggle.push(      <li className="nav-item">
        <a className="nav-link navColor" href="/Login"><h4>Login</h4></a>
      </li>)


      headerButtonToggle.push(<li className="nav-item">
        <a className="nav-link navColor" href="/Signup"><h4>SignUp</h4> </a>
      </li>)
    }
    else{
      headerButtonToggle.push(
      <li className="nav-item">
        <a className="nav-link navColor" href="/Write"><h4>Write</h4></a>
      </li>)
      
      headerButtonToggle.push(
      <li className="nav-item">
        <a className="nav-link navColor" href="/Chat"><h4>Chat</h4></a>
      </li>)

      headerButtonToggle.push(    <li className="nav-item">
        <a className="nav-link navColor" href="/Login" onClick={()=>{
          //Remove cookies
          props.removeCookie("UserId");
          props.removeCookie("UserName");
          props.removeCookie("UserType");
          navigate("/Login");

        }}><h4>Logout</h4></a>
      </li>)

    }


  return (

  <nav className="navbar navbar-expand-lg navbar-light bg-light ">
  <div className = "fontFamily"><a className="navbar-brand " href="/"><b className='titleSize'>Book Worm</b><img src={logo} height={"40px"} width={"40px"}/></a></div>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
    <ul className="navbar-nav ">
      {
        headerButtonToggle
      }

  
      
    </ul>
  </div>
</nav>
  )
}
