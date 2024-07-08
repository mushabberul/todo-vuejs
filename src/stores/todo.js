
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
    },
    isEdit:false,
    
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
      this.todoForm.title ='';
    },
    async deleteTodo(id){
      const {data} = await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      this.todos = this.todos.filter(todo=>{
        return todo.id != id;
      });
    },
    async editTodo(id){
      const {data} = await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
      this.todoForm.title = data.title;
      this.isEdit = true;
    },
    async updateTodo(id){
      const {data} = await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`);
      this.todos.push(data);
    }

  }
})
