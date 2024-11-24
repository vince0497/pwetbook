import "./detail.css"
import { auth } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import { useChatStore } from "../../lib/chatStore";

const Detail = () => {

  const {chatId,user,isCurrentUserBlocked, isReceiverBlocked, changeBlock} = useChatStore();
  const {currentUser} = useUserStore();
  const handleBlock = () => {

  };

  return (
    <div className='detail'>

      <div className="user">
    <img src={user?.avatar || "./avatar.png"  } alt="" />
    <h2>{user?.username }</h2>
    <p>Alyas Bayawak kilabot ng Mandaluyong City</p>

      </div>

      <div className="info">

        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>


        <div className="option">
          <div className="title">
            <span>Pribado & Pagtulong</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>


        <div className="option">
          <div className="title">
            <span>Shinare Larawan</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            
            <div className="photoItem">
            <div className="photoDetail">
              <img src="https://images.pexels.com/photos/28672757/pexels-photo-28672757/free-photo-of-two-ducks-swimming-among-autumn-leaves.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
              <span>Pulutan.png</span>
            </div>
            <img src="./download.png" alt="" className="icon" />
            </div>

            <div className="photoItem">
            <div className="photoDetail">
              <img src="https://images.pexels.com/photos/28672757/pexels-photo-28672757/free-photo-of-two-ducks-swimming-among-autumn-leaves.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
              <span>Pulutan.png</span>
            </div>
            <img src="./download.png" alt="" className="icon" />
            </div>




          </div>


        </div>

        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <button onClick={handleBlock}>Block User</button>
        <button className="logout" onClick={() => auth.signOut()}>Logout</button>
      </div>
    </div>
  )
}

export default Detail