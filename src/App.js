import logo from './logo.svg';
import './App.css';
import Header from './Components/Header';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import Home from './Components/Home';
import Latest from './Components/Latest';
import Write from './Components/Write';
import Read from './Components/Read';
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import Chat from './Components/Chat';
import NotFound from './Components/NotFound';
import { useCookies } from 'react-cookie';



function App() {

  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState(0);
  const [contentType, setContentType] = useState(""); //tags drama and all
  const [userType, setUserType] = useState(""); //USER AND PUBLISHER
  const [cookies, setCookie, removeCookie] = useCookies(['userAuth']);





  return (
    <BrowserRouter>
      <Routes>
          <Route path = "/" element={
          <div className='App'>
        <Header cookies = {cookies} removeCookie = {removeCookie}/>
        <Home contentType = {contentType}  cookies = {cookies} userName = {userName} setContentType = {setContentType}/>
        </div>
      } />


        <Route path="Login" element={
          <div className='App'>
        <Header cookies = {cookies} removeCookie = {removeCookie}/>
        <Login cookies = {cookies} setCookie= {setCookie} setUserId = {setUserId} setUserType = {setUserType} setUserName = {setUserName}/>
        </div>
      }/>


<Route path="Chat" element={
            <div className='App'>
            <Header cookies = {cookies} removeCookie = {removeCookie}/>
            <Chat  cookies = {cookies} />
            </div>
            }/>

<Route path="Chat/:id" element={
            <div className='App'>
            <Header cookies = {cookies} removeCookie = {removeCookie}/>
            <Chat  cookies = {cookies}/>
            </div>
            }/>

          <Route path="Signup" element={
            <div className='App'>
            <Header cookies = {cookies} removeCookie = {removeCookie}/>
            <SignUp  cookies = {cookies} setCookie= {setCookie}/>
            </div>
            }/>


          <Route path="write" element={
                        <div className='App'>
                        <Header cookies = {cookies} removeCookie = {removeCookie}/>
                        <Write   cookies = {cookies}/>
                        </div>
                        
          } />


<Route path="read/:title" element={
                        <div className=''>
                        <Header cookies = {cookies} removeCookie = {removeCookie}/>
                        <Read  userType = {userType}/>
                        </div>
                        
          } />

<Route path="*" element={
                        <div className='App'>
                        <Header cookies = {cookies} removeCookie = {removeCookie}/>
                        <NotFound/>
                        </div>
                        
          } />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
