import { create } from 'zustand'
import { doc, getDoc } from "firebase/firestore";
import { db } from './firebase';

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async(uid) => {
    if(!uid) return set({currentUser:null, isLoading:false});
    
    
        try{

           
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
                
            if (docSnap.exists()) {
            //   console.log("Document data:", docSnap.data());
               set({currentUser:docSnap.data(), isLoading:false})
            } else {
              // docSnap.data() will be undefined in this case
              set({currentUser:null, isLoading:false})
            }

    }catch(err){
        console.log(err)
        return  set({currentUser:null, isLoading:false})
    }finally{

    }
  }
//   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//   removeAllBears: () => set({ bears: 0 }),
//   updateBears: (newBears) => set({ bears: newBears }),
}))