import { useState, useRef, useEffect} from "react"
import "./chat.css"
import EmojiPicker from "emoji-picker-react"
import { onSnapshot,doc,getDoc,updateDoc,arrayUnion} from "firebase/firestore"
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { uploader } from "../../lib/upload";
//const {changeChat} = useChatStore();

const Chat = () => {

  const [chat, setChat] = useState()
  const [openEmoji, setOpenEmoji] = useState(false)
  const [searchText, setSearchText] = useState("")
  const {chatId, user} = useChatStore();
  const {currentUser} = useUserStore();
  const endRef = useRef(null)
  const [img, setImg] = useState({
    file: null,
    url: ""
  });


  useEffect(()=>{
    endRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, []) //end of use effect

  useEffect(() =>{

    // const unSub = onSnapshot(doc(db,"chats", "j4CcFwWoCZU1pFNyiNgk"),
    //   (res)=>{
    //     setChat(res.data())
    //   }) //end of snapsshot

      const unSub = onSnapshot(doc(db,"chats", chatId),
      (res)=>{
        setChat(res.data())
        console.log("==========",res.data())
      }) //end of snapsshot

    return () => {
      unSub();
    }
  },[chatId])//end of use effect
  console.log("----------hey yow")
  console.log(chat)

  const handleEmoji = e =>{
    //console.log(e)
    setSearchText(prev=> prev + e.emoji)
    setOpenEmoji(false)
  }

  const handleImg = e => {
    setImg({
        file: e.target.files[0],
        url:URL.createObjectURL(e.target.files[0])
    });
    console.log(img)
}


  const handleSend =async()=>{
    if(searchText === "") return;
    let imgUrl  = null
    try{

      if(img.file){
        imgUrl = await uploader(img.file);
      }

      await updateDoc(doc(db,"chats",chatId),{
      messages: arrayUnion({
        senderId: currentUser.id,
        searchText,
        createdAt: new Date(),
        ...(imgUrl && {img: imgUrl}),
      }),
    });

    const userIDs = [currentUser.id, user.id]

    userIDs.forEach(async (id)=>{
    const userChatRef = doc(db,"userchats",id)
    const userChatsSnapshot = await getDoc(userChatRef)

    if(userChatsSnapshot.exists()){
      const userChatsData = userChatsSnapshot.data()  

      const chatIndex = userChatsData.chats.findIndex(c=> c.chatId === chatId)
      userChatsData.chats[chatIndex].lastMessage = searchText;
      userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
      userChatsData.chats[chatIndex].updatedAt = Date.now();

      await updateDoc(userChatRef,{
        chats: userChatsData.chats
      })
    }
})// end of foreahch
    }catch(err){
      console.log(err)
    }
    setImg({
      file:null,
      url:"",
    })

    setSearchText("");

  };//end handle sen
//console.log(searchText)
  return (
    <div className='chat'>
        <div className="top">
          <div className="user">
              <img src={user?.avatar || "./avatar.png" } alt="" />
              <div className="text">

                <span>{user?.username}</span>
                <p>Lorem lorem sinta boko ng papayiah</p>
              </div>
              
          </div>
          <div className="icons">
            <img src="./phone.png" alt="" />
            <img src="./video.png" alt="" />
            <img src="./info.png" alt="" />
          </div>
        </div>

        <div className="center">
      {chat?.messages?.map(message=>(
        <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createAt}>
          <img src="./avatar.png" alt="" />
          <div className="text">
            {
              message.img && <img src={message.img} alt="" />
              
            }
            <p>
              {
                message.searchText
              }
            </p>
            {/* <span>{ message.createdAt}</span> */}
          </div>
        </div>
     ))
     //end of mapping
      //end of chat bracket
      } 
    { img.url && (
        <div className="message own">
          <div className="text">
            <img src={img.url} alt="" />
          </div>
        </div>
    )}

        <div ref={endRef}></div>

        </div>
        <div className="bottom">
          <div className="icons">
            <label htmlFor="file">
             <img src="./img.png" alt="" />
            </label>
            
            <input type="file" id="file" style={{display:"none"}} 
            onChange={handleImg}
            />
            <img src="./camera.png" alt="" />
            <img src="./mic.png" alt="" />
          </div>

          <input type="text" placeholder="Type message"
          value={searchText}
          onChange={e=>setSearchText(e.target.value)}/>
          <div className="emoji">
            <img src="./emoji.png" alt="" onClick={()=>setOpenEmoji(prev => !prev)} />
           <div className="picker">
           <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji}/>
          
            </div> 
            
          </div>

          <button className="sendButton" onClick={handleSend}>Send</button>

        </div>
    </div>
  )
}

export default Chat