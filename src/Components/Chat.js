import React, { useState, useEffect } from 'react'

import { Navigate } from 'react-router-dom';
import {  useParams } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import { io } from 'socket.io-client';



const endpoint = "https://bookworm04.herokuapp.com/";
var socket, selectedChatCompare;

var generatedChatId = "";



function RenderChats(id, chatUser, setRenderCurrentChatData , renderCurrentChatData, cookies){
	if(id === undefined){
		return <div></div>
	}
	else{
		return (<div class="col-12 col-lg-7 col-xl-9">
					<div class="py-2 px-4 border-bottom d-none d-lg-block">
						<div class="d-flex align-items-center py-1">
							<div class="position-relative">
								<img src={"https://avatars.dicebear.com/api/initials/" + chatUser +".svg"} class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40"/>
							</div>
							<div class="flex-grow-1 pl-3">
								<strong>{chatUser}</strong>
							</div>
			
						</div>
					</div>

					<div class="flex-grow-0 py-3 px-4 border-top">
						<div class="input-group">
							<input type="text" id = "message" class="form-control" placeholder="Type your message"/>
							<div class="btn btn-primary" onClick={()=>{
								const message = document.getElementById("message").value;
								const newChat = [];
								
								newChat.push(
									<div class="chat-message-right mb-4">
								<div>
									<img src={"https://avatars.dicebear.com/api/initials/" +cookies.UserName + ".svg"} class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40"/>
								</div>
								<div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
									<div class="font-weight-bold mb-1">You</div>
									{message}
								</div>
							</div>
								)
								
								newChat.push(renderCurrentChatData);

								setRenderCurrentChatData(newChat);
	

								socket.emit("new message", {
									message:message,
									roomId: generatedChatId,
									senderName: cookies.UserName,
									senderId: cookies.UserId
								});

								document.getElementById("message").value = ""
							}}>Send</div>
						</div>
					</div>

					<div class="position-relative" id = {"renderedChat"}>
						<div class="chat-messages p-4" >
							{
								renderCurrentChatData
							}

						</div>
					</div>


				</div>)
	}


}




function Chat(props) {
    const [chatUser, setChatUser] = useState("");
	const [renderCurrentChatData, setRenderCurrentChatData] = useState([]);
	const [cookies, setCookie, removeCookie] = useCookies(['userAuth']);
	const [socketConnected, setSocketConnected] = useState(false);
	const [allChats, setAllChats] = useState([]);
    //get Avatars from https://avatars.dicebear.com/api/adventurer/your-custom-seed.svg
	var logedInUser = cookies.UserId;



    var {id} = useParams();
	console.log("id", id);

	useEffect(() => {
		socket = io(endpoint)

		if(id <= logedInUser){
			generatedChatId = id+ "-" +logedInUser ;
		}
		else{
			generatedChatId = logedInUser+ "-" + id;
		}

		socket.emit("setup", {_id: generatedChatId})
		socket.on("connection", ()=>{
			setSocketConnected(true);

		})


	}, [])



	useEffect(() => {
		if(id !== undefined){
		
			const fetchChatDataById = async ()=>{
				console.log("running");
				const postData = {
					"UserId": cookies.UserId
				}
				const apiResponse = await fetch("/api/newChatData/" + id, {
					method: "post",
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(postData)
				})
				
		
				const datajson = await apiResponse.json();
		
				const chatArray = [];
				console.log(datajson);
				console.log(datajson["userInfo"]["Name"]);
				setChatUser(datajson["userInfo"]["Name"]);
			
				datajson["ChatData"][0]["Chat"].reverse();
				datajson["ChatData"][0]["Chat"].forEach(chat => {
					if(chat["SenderId"] === cookies.UserId){
						chatArray.push(
							<div class="chat-message-right mb-4">
								<div>
									<img src={"https://avatars.dicebear.com/api/initials/" +cookies.UserName + ".svg"} class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40"/>
								</div>
								<div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
									<div class="font-weight-bold mb-1">You</div>
									{chat["Message"]}
								</div>
							</div>
						)

					}
					else{
						chatArray.push(
							<div class="chat-message-left pb-4">
							<div>
								<img src={"https://avatars.dicebear.com/api/initials/" +chat["SendBy"] + ".svg"} class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40"/>
							</div>
							<div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
								<div class="font-weight-bold mb-1">{chat["SendBy"]}</div>
								{chat["Message"]}
							</div>
						</div>
						)

					}
			
				});
	
				setRenderCurrentChatData(chatArray);
				


				socket.emit("join chat", generatedChatId);

			}

			fetchChatDataById();



			const fetchChatUsers = async ()=>{
				const apiResponse = await fetch("/api/chatData/" + cookies.UserId, {
					method: "get",
					headers: {
						'Content-Type': 'application/json',
					}
			
				})
				const data = [];

		
				const datajson = await apiResponse.json();
		
				datajson["users"].forEach(arr =>{
					data.push(
					<a href={"/chat/" + arr["_id"]}class="list-group-item list-group-item-action border-0">
					<div class="d-flex align-items-start">
						<img src={"https://avatars.dicebear.com/api/initials/" +arr["Name"] +".svg" } class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40"/>
						<div class="flex-grow-1 ml-3">
							{arr["Name"]}
							
						</div>
					</div>
				</a>
					)

				})

				setAllChats(data);

			}

			fetchChatUsers();




			
		}
		else{
			const fetchChatUsers = async ()=>{
				const apiResponse = await fetch("/api/chatData/" + cookies.UserId, {
					method: "get",
					headers: {
						'Content-Type': 'application/json',
					}
			
				})
				const data = [];

		
				const datajson = await apiResponse.json();
		
				datajson["users"].forEach(arr =>{
					data.push(
					<a href={"/chat/" + arr["_id"]}class="list-group-item list-group-item-action border-0">
					<div class="d-flex align-items-start">
						<img src={"https://avatars.dicebear.com/api/initials/" +arr["Name"] +".svg" } class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40"/>
						<div class="flex-grow-1 ml-3">
							{arr["Name"]}
							
						</div>
					</div>
				</a>
					)

					

				})
				setAllChats(data);
			}

			fetchChatUsers();
		}

		}, [])




	//Recived message
	useEffect(() =>{

		socket.on("message recieved", (newMessageRecived) =>{
			const newData = [];
		

			newData.push(
				<div class="chat-message-left pb-4">
							<div>
								<img src={"https://avatars.dicebear.com/api/initials/" +newMessageRecived["senderName"]+ ".svg"} class="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40"/>
							</div>
							<div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
								<div class="font-weight-bold mb-1">{newMessageRecived["senderName"]}</div>
								{newMessageRecived["message"]}
							</div>
						</div>
			)
			newData.push(renderCurrentChatData);

			setRenderCurrentChatData(newData)
		

			console.log(logedInUser , newMessageRecived, );
		
		})
	})
	

		if(props.cookies.UserId === undefined){
			return (<Navigate to="/login"/>)
			}
		
		




  return (
      <div className='jumbotron m-4'>
    <main class="content">
    <div class="container p-0">

		<h1 >Messages</h1>
        <br/>
        <hr/>
        <br/>

		<div class="card">
			<div class="row g-0">
				<div class="col-12 col-lg-5 col-xl-3 border-right">
					{
						allChats
					}

					<hr />
				</div>
				{
					RenderChats(id, chatUser, setRenderCurrentChatData , renderCurrentChatData, cookies)
				}
			</div>
		</div>
	</div>
</main>
</div>

  )
}

export default Chat