/*
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { View } from '../../views/view';

@customElement('todo-view')
export class TodoView extends View {
  render() {
    return html`<div>
      <img style="width: 200px;" src="images/empty-plant.png" />
      <h2>This place intentionally left empty</h2>
      <p>It’s a place where you can grow your own UI 🤗</p>
    </div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add(
      'flex',
      'flex-col',
      'h-full',
      'items-center',
      'justify-center',
      'p-l',
      'text-center',
      'box-border'
    );
  }
}
*/

import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/checkbox';
import '@vaadin/text-field';
import { Binder, field } from '@hilla/form';
import Todo from 'Frontend/generated/com/example/application/Todo';
import TodoModel from 'Frontend/generated/com/example/application/TodoModel';
import { TodoEndpoint } from 'Frontend/generated/endpoints';
import { View } from '../view';

@customElement('todo-view')
export class TodoView extends View {

    @state()
    private todos: Todo[] = [];
    private binder = new Binder(this, TodoModel);

    render() {
        return html`
            <div class="form">
                <vaadin-text-field
                        ${field(this.binder.model.task)  }
                ></vaadin-text-field>
                <vaadin-button
                        theme="primary"
                        @click=${this.createTodo }
                        ?disabled=${this.binder.invalid }
                >
                    Add
                </vaadin-button>
            </div>

            <div class="todos">
                ${this.todos.map((todo) =>  html`
                <div class="todo">
                    <vaadin-checkbox
                        ?checked=${todo.done }
                        @checked-changed=${(e: CustomEvent) => 
                        this.updateTodoState(todo, e.detail.value)}
                    ></vaadin-checkbox>
                    <span>${todo.task}</span>
                </div>
                `
                )}
            </div>
        `;
    }

    async connectedCallback() { 
        super.connectedCallback(); 
        this.todos = await TodoEndpoint.findAll(); 
    }

    async createTodo() {
        const createdTodo = await this.binder.submitTo(TodoEndpoint.save); 
        if (createdTodo) {
          this.todos = [...this.todos, createdTodo]; 
          this.binder.clear(); 
        }
    }

    updateTodoState(todo: Todo, done: boolean) {
        todo.done = done;
        const updatedTodo = { ...todo }; 
        this.todos = this.todos.map((t) => (t.id === todo.id ? updatedTodo : t)); 
        TodoEndpoint.save(updatedTodo); 
    }
    
}
