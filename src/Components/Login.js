import React from 'react'
import { useNavigate , } from "react-router-dom";
import { GoogleLogin } from 'react-google-login';
import { Navigate } from 'react-router-dom';

function refreshPage(){ 
    window.location.reload(); 
}


function LoginWithEmail(props){
    const Email = document.getElementById("LoginEmail").value;
    const Password = document.getElementById("LoginPassword").value;

    if(Email === "" || Password === ""){
        alert("Empty fields")
    }
    else{
    const logindata = {   
        Name : "",
        Email : Email,
        Password : Password,
        LoginType : "Normal"
       }

       const LoginUserWithOutGoogle = async ()=>{
           const apiResponse = await fetch("/api/login", {
               method: "post",
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify(logindata)
           })

           const datajson = await apiResponse.json();
           if(datajson.message === "USER_NOT_FOUND"){
               alert("Email or Password is wrong")
           }
           else{
               console.log(datajson.data);
               // props.setUserId(datajson.data["_id"])
               // props.setUserName(response.Du.tf)
               // props.setUserType(datajson.data["UserType"])
               props.setCookie('UserName',datajson.data["Name"], { path: '/' });
               props.setCookie('UserType',datajson.data["UserType"], { path: '/' });
               props.setCookie('UserId',datajson.data["_id"], { path: '/' });
               refreshPage()
         

               
               

           }

       }
       LoginUserWithOutGoogle();
    }


}




function Login(props) {

    if(props.cookies.UserId !== undefined){
    console.log("Cookies usergid" , props.cookies.UserId)
    return (<Navigate to="/"/>)
    }


    const successResponseGoogle = (response) => {
   
        const logindata = {   
         Name : response.Du.tf,
         Email : response.Du.tv,
         Password : "",
         LoginType : "Google"
        }

        const LoginUserWithGoogle = async ()=>{
            const apiResponse = await fetch("/api/login", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logindata)
            })

            const datajson = await apiResponse.json();
            if(datajson.message === "USER_NOT_FOUND"){
                alert("Email or Password is wrong")
            }
            else{
                console.log(datajson.data);
                // props.setUserId(datajson.data["_id"])
                // props.setUserName(response.Du.tf)
                // props.setUserType(datajson.data["UserType"])
                props.setCookie('UserName',response.Du.tf , { path: '/' });
                props.setCookie('UserType',datajson.data["UserType"], { path: '/' });
                props.setCookie('UserId',datajson.data["_id"], { path: '/' });
                refreshPage()
          

                
                

            }

        }
        LoginUserWithGoogle();


      }
      
      const failureResponseGoogle =(response) =>{
          console.log(response);
          
      }
      




  return (
    <section className="login-block p-5">
    <div className="container-fluid">
        <div className="row">
            <div className="col-sm-12">
                <form className="md-float-material form-material" action="#" method="POST">
                    <div className="auth-box card">
                        <div className="card-block">
                            <div className="row">
                                <div className="col-md-12">
                                    <h3 className="text-center heading">Login And Read!</h3>
                                    <p/>
                                </div>
                            </div>

                            <div className="form-group form-primary"> <input type="text" className="form-control" name="email" placeholder="Email" id="LoginEmail"/> </div>
                            <div className="form-group form-primary"> <input type="password" className="form-control" name="password" placeholder="Password" id="LoginPassword"/> </div>

                            <div className="row">
                                <div className="col-md-12"> <input type="button" className="btn btn-primary btn-md btn-block waves-effect text-center m-b-20" name="submit" value="Login" onClick={()=>{
                                    LoginWithEmail(props);
                                }}/>
                                </div>
                            </div>
                            <div className="or-container">
                                <div className="line-separator"></div>
                                <div className="or-label">or</div>
                                <div className="line-separator"></div>
                            </div>
                            <div className="row">
                            </div> <br/>
                            <GoogleLogin
    clientId="418256860625-i5arsm11tgl97ccfe31f7u17slqc9aao.apps.googleusercontent.com"
    buttonText="Login Using Google"
    onSuccess={successResponseGoogle}
    onFailure={failureResponseGoogle}
    cookiePolicy={'single_host_origin'}
  />
                            <p className="text-inverse text-center">Don't have an account? <a href="/Signup" data-abc="true">SignUp</a></p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>
  )
}

export default Login