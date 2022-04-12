import React from 'react'
import {  useParams } from 'react-router-dom'
import { useEffect , useState} from 'react';
import { useCookies } from 'react-cookie';




function Read(props) {

    var {title} = useParams();
    const [views, setViews] = useState(0)
    const [readData, setReadData] = useState(0)
    const [Author, setAuthor] = useState(0)
    const [thumbnailImage, setThumbnailImage] = useState(0)
    const [renderTags, setRenderTags] = useState(0);
    const [authorId, setAuthorId] = useState(0);
    const [isPublisher, setIsPublisher] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies(['userAuth']);


    

    useEffect(() => {

        const fetchBookData = async ()=>{
            console.log("running");
            const apiResponse = await fetch("/api/read/" + title, {
                method: "get",
                headers: {
                    'Content-Type': 'application/json',
                }
            })
    
            const datajson = await apiResponse.json();
            console.log(datajson["data"])
            setAuthor(datajson["data"]["AuthorName"])
            setAuthorId(datajson["data"]["AuthorId"])
            const a = <div dangerouslySetInnerHTML={{__html:datajson["data"]["BookData"] }} />
        
            setReadData(a);
            setViews(datajson["data"]["Views"])
            setThumbnailImage(datajson["data"]["ThumbnailURL"])

            const tags = [];
            const tagsData = {
              "Comedy":  <div class="badge badge-success m-2">Comedy</div>,
              "Romance": <div class="badge badge-secondary m-2">Romance</div>,
              "Advanture":<div class="badge badge-danger m-2">Advanture</div>,
              "Horror": <div class="badge badge-warning m-2">Horror</div>,
              "Drama" : <div class="badge badge-primary m-2">Drama</div>
            }
            datajson["data"]["Tags"].forEach(tag => {
              tags.push(
                tagsData[tag]
              )
              
            });
            setRenderTags(tags);
            console.log(cookies.UserId);
            console.log(datajson["data"]["_id"]);
            if(cookies.UserType === "Publisher" && cookies.UserName !== datajson["data"]["AuthorName"]){
            setIsPublisher(<div className='p-4'><a href={'/chat/' + datajson["data"]["AuthorId"]}><div class="badge badge-info">Chat</div></a></div>)

            }
        
        }
    
        fetchBookData();
    




        let processScroll = () => {
            let docElem = document.documentElement, 
              docBody = document.body,
              scrollTop = docElem['scrollTop'] || docBody['scrollTop'],
                scrollBottom = (docElem['scrollHeight'] || docBody['scrollHeight']) - window.innerHeight,
              scrollPercent = scrollTop / scrollBottom * 100 + '%';
            
            // console.log(scrollTop + ' / ' + scrollBottom + ' / ' + scrollPercent);
            
              document.getElementById("progress-bar").style.setProperty("--scrollAmount", scrollPercent); 
          }
          
          window.addEventListener('scroll', processScroll);
    
    }, [])
    


  return (
            <div>
                <div id="progress-bar"></div>
                    <div className='jumbotron m-5 App'>
                        <div className='d-flex justify-content-center flex-wrap'>

<div>
                        <div className='title'>
                        {
                            title
}
                        </div >
                        <div className='stat d-flex justify-content-center flex-wrap'>
                        <div className='p-4'>
                        <span>{views}
                            <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 0 24 24" width="20px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"/></svg></span>
                            </div>
                        <div className='p-4'>
                            Written By :- {Author}
                        </div>
                        <div className='p-4'>
                            Tags :   &nbsp;
                            {
                                renderTags
                            }
                        </div>
                      {
                          isPublisher
                      }
                        </div>
        
                        </div>
                        <div>
                        <img className="card-img-top sizing2" src={thumbnailImage} alt="Card image cap"/>
                        </div>

                        </div>
        
                 
                    </div>
                    

                    <div className='jumbotron m-5'>
                        {
                            readData
                        }
                    </div>




                
            </div>
  )
}

export default Read