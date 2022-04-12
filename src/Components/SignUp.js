import React from 'react'
import { GoogleLogin } from 'react-google-login';
import { Navigate } from 'react-router-dom';



function SignUpUsingEmail(){
    var checkedValue = document.querySelector('input[name="UserTypeCheck"]:checked').value;
    const Name = document.getElementById("SignUpName").value;
    const Email = document.getElementById("SignUpEmail").value;
    const Password = document.getElementById("SignUpPassword").value;
    const RePassword = document.getElementById("RePassword").value;
    
    if(Email === "" || Password === "" || Name === ""){
        alert("Empty fields")
    }
    else if(Password !== RePassword){
        alert("Password does not match")
    }
    else{
        const signupdata = {
            Name: Name,
            Email: Email,
            Password : Password,
            LoginType: "Normal",
            UserType: checkedValue
        }

        const SignUpUserWithOutGoogle = async ()=>{
            const apiResponse = await fetch("/api/signup", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupdata)
            })

            const datajson = await apiResponse.json();
            if(datajson.message === "USER_ADDED"){
                alert("Account created successfully please login");
            }
            else{
                alert("User with this email is already present");

            }

        }
        SignUpUserWithOutGoogle();

    }

}

    

function SignUp(props) {
    if(props.cookies.UserId !== undefined){
  
    return (<Navigate to="/"/>)
    }

    const successResponseGoogle = (response) => {

        var checkedValue = document.querySelector('input[name="UserTypeCheck"]:checked').value;
        const signupdata = {
            Name: response.Du.tf,
            Email: response.Du.tv,
            Password : "",
            LoginType: "Google",
            UserType: checkedValue
        }

        console.log(signupdata)
        const SignUpUserWithGoogle = async ()=>{
            const apiResponse = await fetch("/api/signup", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupdata)
            })

            const datajson = await apiResponse.json();
            if(datajson.message === "USER_ADDED"){
                alert("Account created successfully please login");
            }
            else{
                
                alert("User with this email is already present");

            }

        }
        SignUpUserWithGoogle();



      }
      
      const failureResponseGoogle =(response) =>{
          console.log(response)
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
                                    <h3 className="text-center heading">Create your BookWorm account. It’s free and only takes a minute.</h3>
                                    <p/>
                                </div>
                            </div>
                            <div className="form-group form-primary"> <input type="text" className="form-control" name="first_name" placeholder="Display name" id="SignUpName"/> </div>
                            <div className="form-group form-primary"> <input type="text" className="form-control" name="email"placeholder="Email" id="SignUpEmail"/> </div>
                            <div className="form-group form-primary"> <input type="password" className="form-control" name="password" placeholder="Password" id="SignUpPassword"/> </div>
                            <div className="form-group form-primary"> <input type="password" className="form-control" name="password_confirm" placeholder="Repeat password"  id="RePassword"/> </div>
                            <div class="form-check">
    <input type="radio" name = "UserTypeCheck"  value = "Publisher" class="form-check-input" id="exampleCheck1"/>
    <label class="form-check-label UserTypeCheck" for="UserTypeCheck" value = "Publisher">Publisher</label>
</div>
<div class="form-check">
    <input type="radio" class="form-check-input" value = "Writter" checked="checked" name = "UserTypeCheck" id="exampleCheck12"/>
    <label class="form-check-label UserTypeCheck" for="UserTypeCheck" value = "Writter">Writter</label>
  
  
  
  </div>
  <br/>
                            <div className="row">
                                <div className="col-md-12"> <input type="button" className="btn btn-primary btn-md btn-block waves-effect text-center m-b-20" name="submit" value="Signup Now" onClick={()=>{
                                    SignUpUsingEmail();
                                }}/>
                                </div>
                            </div>
                            <div className="or-container">
                                <div className="line-separator"></div>
                                <div className="or-label">or</div>
                                <div className="line-separator"></div>
                            </div>
                       
                            <GoogleLogin
    clientId="418256860625-i5arsm11tgl97ccfe31f7u17slqc9aao.apps.googleusercontent.com"
    buttonText="SignUp Using Google"
    onSuccess={successResponseGoogle}
    onFailure={failureResponseGoogle}
    cookiePolicy={'single_host_origin'}
  />
                             <br/>
                            <p className="text-inverse text-center">Already have an account? <a href="/Login" data-abc="true">Login</a></p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>
  )
}

export default SignUp