import axios from "axios";
import { useEffect, useState } from "react"

const BaseUrl = 'https://fir-2-db7a0-default-rtdb.firebaseio.com'
const Item_Per_page = 5;

export default function Creatures({isFrozen}){

  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  const [newItemName , setNewItemName] = useState('');
  const {isAdding , setIsAdding} = useState(false);
//   const {currentPage , filter} = 

async function fetchData(){
    try {
        const res = await axios.get(`${BaseUrl}/creatures.json`);
        const val = res.data;
        const items = val ? Object.entries(val).map(([id,item]) => ({id , ...item})) :[];
        items.reverse();
        if(!isFrozen){
            setData(items);
        }
        setLoading(false);
    } catch (error) {
        setError(err);
        setLoading(false);
    }
}
    useEffect(()=>{
        fetchData();
    },[isFrozen]);

 
    
    return(
        <nav>
            
        </nav>
    )
}