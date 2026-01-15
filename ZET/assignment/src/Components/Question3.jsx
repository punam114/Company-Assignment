import { useEffect, useState } from "react"

export function Todo(){

    const [task , setTask]= useState("");
    const [allTask,setAllTask] = useState([]);

    useEffect(()=>{
  let local = JSON.parse(localStorage.getItem("tasks"));
  setAllTask(local);
    },[])

    useEffect(()=>{
        localStorage.setItem("tasks",JSON.stringify(allTask));
    },[task])

function addTask(){

    setAllTask([...allTask,task]);
    setTask("")

}

function deleteBtn(index){
    let deleteTask = allTask.filter((ele,i) => i !== index);
    setAllTask(deleteTask);
}

    return(
        <>
         <h2>Third Assignment</h2>
        <input value={task} onChange={(e)=>setTask(e.target.value)} type="text" placeholder="Enter Task"/>
        <button onClick={addTask}>Add</button>
        <ul>
            {allTask.map((ele,index)=>(
                <li key={index}>
                  {ele}
                  <button onClick={()=>deleteBtn(index)}>Delete</button>
                </li>
            ))}
        </ul>
        </>
    )
}