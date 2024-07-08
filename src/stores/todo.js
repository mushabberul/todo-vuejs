
import axios from 'axios'
import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todo', {
  state:()=>({
    todos:[],
    todoForm:{
      completed:false,
      id:1,
      title:null,
      userId:1,
    }
  }),
  actions:{
    async getToDos(){
      const {data}= await axios.get('https://jsonplaceholder.typicode.com/todos');
      this.todos = data;
      
      
    },
    async createTodo(){
      const {data} = await axios.post('https://jsonplaceholder.typicode.com/todos',this.todoForm);
      this.todos.push(data);
      this.todos.reverse();
      
    }

  }
})
