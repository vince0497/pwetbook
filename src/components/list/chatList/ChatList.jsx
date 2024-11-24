import { onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import AddUSer from "../../addUser/AddUser";
import "./chatlist.css"
import { useEffect, useState } from "react"
import { useUserStore } from "../../../lib/userStore"
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";



const ChatList = () => {

const [chats,setChats] = useState([]);
const [addMode,setAddMode] = useState(false);
const {currentUser} = useUserStore();
const {changeChat,chatId} = useChatStore();

useEffect(()=> {
  const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
    // const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
    // console.log(source, " data: ", doc.data());
    const items = res.data().chats;
    //setChats(doc.data())
    
    const promises = items.map(async(item) => {
      console.log("--->",item)
      const userDocRef = doc(db, "users", item.receiverId );
      const userDocSnap = await getDoc(userDocRef);
   
      const user = userDocSnap.data()
      
      return {...item,user}
    }); //end of promises

    const chatData = await Promise.all(promises)

    setChats(chatData.sort((a,b)=> b.updatedAt = a.updatedAt ))
    console.log("================helllodddddddwss")
    console.log(chats)
  }); //end of snapshtot

  return ()=>{
    unSub()
  }
}, [currentUser.id]);
//end of effct


//console.log(chats)

const handleSelect = async (chat) =>{ 

  // const userChatRef = doc(db,"userchats",currentUser.id)
  
  // const userChatsSnapshot = await getDoc(userChatRef)

  // if(userChatsSnapshot.exists()){
  //   const userChatsData = userChatsSnapshot.data()  

  //   const chatIndex = userChatsData.chats.findIndex(c=> c.chatId === chatId)
    
  //   userChatsData.chats[chatIndex].isSeen = true;


  //   await updateDoc(userChatRef,{
  //     chats: userChatsData.chats
  //   })
  // }//end if

  const userChats = chats.map(item=>{
    const {user,  ...rest} = item;
    return rest
  })

  const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)

  userChats[chatIndex].isSeen = true;
  const userChatRef = doc(db,"userchats",currentUser.id)

  try{

    await updateDoc(userChatRef,{
       chats: userChats
    })
    console.log("sasas")
    changeChat(chat.chatId,chat.user)

  }catch(err){
    console.log(err)
  }
 
}

  return (
    <div className='chatlist'>
        <div className="search">
            <div className="searchbar">
                <img src="./search.png" alt="" />    
                <input type="text" placeholder="Search"/>
            </div>    
            <img src={addMode ? "./minus.png" : "./plus.png"} alt="" className="add" 
            onClick={() => {setAddMode((prev)=> !prev)}}
            // point out the params
            />
        </div>   
    {chats.map((chat) => (

    
       <div className="item" key={chat.chatId} onClick={()=>handleSelect(chat)}
       style={
        {
          backgroundColor: chat?.isSeen ?  "transparent" : "#5183fe"
        }
       }
       >
          <img src={chat.user.avatar || "./avatar.png"  } alt="" />
          <div className="text">
            <span>{chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div> 

    ) //end of chunks of chat
    ) //end of map function
    } {/* //end of mapping */}
        {/* <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="text">
            <span>Jose Rizal</span>
            <p>Hello mga katipuneros!</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="text">
            <span>Antonio Luna</span>
            <p>Hello mga katipuneros!</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="text">
            <span>Andres Bonifacio</span>
            <p>Hello mga katipuneros!</p>
          </div>
        </div>

        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="text">
            <span>Jose Rizal</span>
            <p>Hello mga katipuneros!</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="text">
            <span>Antonio Luna</span>
            <p>Hello mga katipuneros!</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="text">
            <span>Andres Bonifacio</span>
            <p>Hello mga katipuneros!</p>
          </div>
        </div>

        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="text">
            <span>Jose Rizal</span>
            <p>Hello mga katipuneros!</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="text">
            <span>Antonio Luna</span>
            <p>Hello mga katipuneros!</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="text">
            <span>Andres Bonifacio</span>
            <p>Hello mga katipuneros!</p>
          </div>
        </div> */}
      {addMode && <AddUSer />}
      

    </div>
  );
};

export default ChatList