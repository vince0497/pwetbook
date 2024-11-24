import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";


export const uploader = async(file) => {

//const storage = getStorage();
const date = new Date()
const storageRef = ref(storage, `images/${date + file.name}`);
const uploadTask = uploadBytesResumable(storageRef, file);

return new Promise((resolve,reject)  => {
uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
    reject("Smething went wrong! " + error)
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
      resolve(downloadURL)
    });
  }
);//end of upload task

}); //end of promise

};// end of upload


// export const uploader;