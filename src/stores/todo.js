
import axios from 'axios'
import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todo', {
  state:()=>({
    todos:[]
  }),
  actions:{
    async getToDos(){
      const {data}= await axios.get('https://jsonplaceholder.typicode.com/todos');
      this.todos = data;
    },
  }
})
