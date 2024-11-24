import { toast } from "react-toastify";
import "./login.css";
import { useState, useRef, useEffect} from "react"
import { uploader } from "../../lib/upload";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import {doc,setDoc} from "firebase/firestore";
import { auth,db } from "../../lib/firebase";



const Login = () => {

    const [avatar,setAvatar] = useState({
        file:null,
        url:""
    });

    const [loading,setLoading] = useState(false)


    const handleAvatar = e => {
        setAvatar({
            file: e.target.files[0],
            url:URL.createObjectURL(e.target.files[0])
        });
    }

    const handleLogin = async(e) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target)
        const {email,password} = Object.fromEntries(formData)
        try{    
            await signInWithEmailAndPassword(auth, email, password  )
        }catch (err){
            console.log(err)
            toast.error(err.message)
        }finally{
            setLoading(false)
        }
        
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target)
        const {username,email,password} = Object.fromEntries(formData)
        // console.log(username)
        try{
            // auth define in the firebase config
            const res = await createUserWithEmailAndPassword(auth,email,password)
            const imgUrl = await uploader(avatar.file)

            await setDoc(doc(db,"users",res.user.uid),{
                username,
                email,
                avatar: imgUrl,
                id: res.user.uid,
                blocked: []
            });

            await setDoc(doc(db,"userchats",res.user.uid),{
                chats: []
                
            });  

            toast.success("Welcome " + email +", Please login")
            console.log(res)
        }catch(err){
            console.log(err)
            toast.error(err.message)
        } finally{
            setLoading(false)
        }
    }
  return (
    <div className="login">

        <div className="item">
            <h2>Welcome back motherfather,</h2>
            <form onSubmit={handleLogin} >
                <input type="text" placeholder="Email"  name="email"/>
                <input type="password" placeholder="Password"  name="password"/>
                <button disabled={loading}> {loading? "Loading" : "Sign In"}</button>
            </form>

        </div>
        <div className="seperator"></div>

        <div className="item">
            <h2>Create account, or else..</h2>
            <form onSubmit={handleRegister}>
            <input type="file" id="file" style={{display:"none"}}
                onChange={handleAvatar}/>
            <label htmlFor="file" id="file">
                <img src={avatar.url || "./avatar.png"} alt="" />
                Upload Image
            </label>
                <input type="text" placeholder="Username"  name="username"/>
                <input type="text" placeholder="Email"  name="email"/>
                <input type="password" placeholder="Password"  name="password"/>
                <button disabled={loading}> {loading ? "Loading" : "Sign up"}</button>
            </form>

        </div>
        {/* <div className="item"></div>
        <div className="item"></div> */}
    </div>
  )
}

export default Login