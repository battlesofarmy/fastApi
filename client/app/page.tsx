
"use client";

import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FaEdit, FaCheck } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

type Todo={
  id: number,
  email: string,
  data: string
}


export default function Home() {
  const [todoItems, setTodoItems] = useState<Todo[]>([]);
  const [editRow, setEditRow] = useState<null | number>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
      axios.get('http://127.0.0.1:8000/todos')
        .then(res=> {
          setTodoItems(res.data);
          console.log(res.data)
        })
        .catch(err=> console.log(err))
  },[])

  // add  a new todo
  const addToDo =(e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault();

    const form = e.currentTarget;
    const todoData = (form.elements.namedItem('todo') as HTMLInputElement).value;
    const newTodo = {email: "muntasir@gmail.com", data: todoData}

    axios.post(`http://127.0.0.1:8000/todos/new`, newTodo)
    .then((res)=>{
      setTodoItems([...todoItems, res.data]);
    })
    .catch(data=>console.log(data))

    form.reset();
  }

  // Edit 
  const updateToDo =(i: number, ele: Todo)=>{
    ele.data =  inputRef.current?.value || "";
    todoItems[i].data = ele.data;
    setTodoItems(todoItems);

    const updateToDo = {
      email: "muntasir@gmail.com",
      data: ele.data
    }

     // Update on Database
     axios.put(`http://127.0.0.1:8000/todos/update/${ele.id}`, updateToDo)
     .then((res)=>console.log(res.data))
     .catch(data=>console.log(data))
     
    setEditRow(null);
  }
  
  // Delete 
  const deleteToDo =(id: number)=>{
    axios.delete(`http://127.0.0.1:8000/todos/${id}`)
    .then(() => {
      setTodoItems(todoItems.filter(ele=> ele.id != id));
      console.log("Todo deleted!");
    })
    .catch((err) => console.error("Error deleting todo:", err));
  }

  
  return (
    <>
      <section className="py-10">
        <div className="container">
          <div className="shadow py-4 px-3 border md:py-8  md:px-16 mx-auto">

            <form onSubmit={addToDo} className='mt-4 flex md:gap-x-4 gap-x-2'>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="todo"
                name="todo"
                type="text"
                required
                placeholder="Enter your To Do Work"
                autoComplete="email"
                className="min-w-0 flex-auto rounded-md bg-[#F7F6F3] px-3.5 py-2 text-md outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-lg border"
              />
              <button
                type="submit"
                className="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm  font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                AddTodo
              </button>
            </form>
            
            {/* Todo data  */}
            <div className='pt-5'>
   
                {/* Single Todo item  */}
                {
                  todoItems?.map((ele: Todo, i)=>
                    <div key={ele.id} className='grid grid-cols-12 w-full bg-[#F7F6F3] py-3 my-2 capitalize'>
                      <h4 className='col-span-1 flex justify-center font-bold text-blue-600'>{i+1}</h4>
                      {
                        editRow === i ?
                        <input ref={inputRef} defaultValue={ele.data} type="text" className='col-span-9 px-3 rounded focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 bg-gray-300 py-2 -my-2'/>
                        :
                        <p  className='col-span-9 items-center flex'>{ele.data}</p>
                      }
                      <div  className='col-span-2 flex justify-center items-center gap-2 pr-1'>
                        {
                          editRow === i ?
                          <>
                            <FaCheck onClick={()=>updateToDo(i, ele)}  style={{cursor: 'pointer'}} className="text-xl"/>
                            <RxCross2 onClick={()=>setEditRow(null)} className="text-2xl text-red-600" style={{cursor: 'pointer'}}/>
                          </>
                          :
                          <>
                            <FaEdit onClick={()=>setEditRow(i)}  style={{cursor: 'pointer'}} className="text-xl"/>
                            <MdOutlineDeleteForever onClick={()=>deleteToDo(ele.id)} className="text-2xl text-red-600" style={{cursor: 'pointer'}}/>
                          </>
                        }
                      </div>
                    </div>
                  )
                }

                {
                    todoItems.length==0 ? <p className="text-[14px]">The todo list is empty. Add a todo to view </p> : <p></p>
                }
            </div>

          </div>
        </div>
      </section>
    </>
  );
}