import React,{useState} from "react";
import { AiOutlinePlus } from 'react-icons/ai';
import { useEffect } from "react";
import Todo from "./Todo";
import {db} from './firebase'
import {query,collection,onSnapshot, updateDoc, doc , addDoc, deleteDoc} from 'firebase/firestore'

const style ={
  bg:`h-screen w-screen p-4 bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container:`bg-slate-100 max-w-[500px] p-4 w-full m-auto rounded-md shadow-xl`,
  heading:`text-3xl  text-center text-gray-800 p-2`,
form:`flex justify-between`,
input:`border p-2 w-full mr-2 text-xl`,
button: `border p-4 ml2 bg-purple-900 text-slate-100`,
count: `text-center p-2`

}

function App() {
  const [todos, setTodos] = useState
  ([]);
  const [input,setInput] = useState('');


  //create todo
  const createTodo = async (e) => {
    e.preventDefault()
    if(input === '') {
      alert('please enter a valid todo')
    return
    }
    await addDoc(collection(db,'todos'),{
      text:input,
      completed:false
    })
    setInput('');
  }
  //read todo in firebase
useEffect(() => {
const q = query(collection(db, 'todos'))
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  let todosArr =[]
  querySnapshot.forEach((doc) => {
    todosArr.push({...doc.data(), id: doc.id})
  })
  setTodos(todosArr)
});
return () => unsubscribe()
},[])

  //update todo in firebase
const toggleComplete = async (todo)=>{
await updateDoc(doc(db,'todos', todo.id) ,
{
  completed: !todo.completed
});
}

  //delete todo
 const deleteTodo = async (id) => {
  await deleteDoc(doc(db, 'todos', id))
}
  return (
    <div className={style.bg}>
    <div className={style.container}
      >
        <h3 className={style.heading}>Todo App</h3>
        <form onSubmit={createTodo} className={style.form}>

          <input className={style.input} value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Add Todo"/>
          <button className={style.button} >< AiOutlinePlus size={30}/></button>
          </form>    
          <ul>
            {todos.map((todo, index)=>(
<Todo key={index} todo={todo} toggleComplete={toggleComplete} deleteTodo={deleteTodo} />
            ))}

          </ul>
          {todos.length < 1 ?  null :
           <p className={style.count}>{`You have ${todos.length} todos`}</p>
          }
         
          </div>
    </div>
  );
}

export default App;
