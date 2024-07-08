<script setup>
import { onMounted } from 'vue';
import { useTodoStore } from './stores/todo';


const todoStore = useTodoStore();


onMounted(()=>{
  todoStore.getToDos();
})
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <h2 class="text-center">To-Do List</h2>
                <form id="todo-form" class="form-inline mb-4">
                    <input type="text" v-model="todoStore.todoForm.title" id="new-task" class="form-control mr-2 flex-grow-1" placeholder="Enter a new task" required>
                    <button v-if="!todoStore.isEdit" type="submit" class="btn btn-primary" @click.prevent="todoStore.createTodo()">Add Task</button>
                    <button v-else type="submit" class="btn btn-warning" @click.prevent="todoStore.createTodo()">Update</button>
                </form>
                <ul id="todo-list" class="list-unstyled">
                    <!-- To-Do Items will go here -->
                     <li v-for="todo in todoStore.todos" :key="todo.id">
                        <i class="fa-solid fa-trash mr-2" @click.prevent="todoStore.deleteTodo(todo.id)"></i>
                        <i class="fa-solid fa-pen-to-square mr-2" @click.prevent="todoStore.editTodo(todo.id)"></i>{{todo.title}}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>