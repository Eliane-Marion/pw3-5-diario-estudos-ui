import { Routes } from '@angular/router';
import { TarefaLista } from './components/tarefa-lista/tarefa-lista';
import { TarefaFormulario } from './components/tarefa-formulario/tarefa-formulario';

export const routes: Routes = [
  { path: '', component: TarefaLista },
  { path: 'nova', component: TarefaFormulario },
  { path: 'editar/:id', component: TarefaFormulario }
];
