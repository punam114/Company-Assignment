import axios from "axios";
import { useEffect, useState } from "react"
import { useTabState } from "../useTabState";

const BaseUrl = 'https://fir-2-db7a0-default-rtdb.firebaseio.com'
const Item_Per_page = 5;

export default function Creatures({isFrozen}){

  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  const [newItemName , setNewItemName] = useState('');
  const {isAdding , setIsAdding} = useState(false);
  const {currentPage , filter ,setCurrentPage ,setFilter} = useTabState();

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

    const filteredData = filter ? data.filter(item => item.name ?.toLowerCase().includes(filter.toLowerCase())||
                   item.id?.toLowerCase().includes(filter.toLowerCase()) 
     ) : data;

     const totalPages = Math.ceil(filteredData.length / Item_Per_page)
     const start = (currentPage -1) * Item_Per_page;
     const paginatedData = filteredData.slice(start , Item_Per_page);
     
     const handleAdd = async (e)=> {
        e.preventDefault();
        if(!newItemName.trim() || isAdding) return;

        setIsAdding(true);

        try {
            await axios.post(`${BaseUrl}/creatures.json`,{
                name : newItemName,
                timestamp : Date.now(),
                creator : "Observers-01",
                type : 'Entity'
            })

            setNewItemName('');
            fetchData();
        } catch (error) {
            console.log(error)
        }finally{
            setIsAdding(false);
        }
     }

    //  if(error) return <div>Error loading Creatures: {error.message}</div>

    return(
        <nav>
            
        </nav>
    )
}