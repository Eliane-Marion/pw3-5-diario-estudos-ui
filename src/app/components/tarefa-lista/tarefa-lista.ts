import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TarefaService } from '../../services/tarefa.service';
import { Tarefa } from '../../models/tarefa.model';

@Component({
  selector: 'app-tarefa-lista',
  imports: [RouterLink],
  templateUrl: './tarefa-lista.html',
  styleUrl: './tarefa-lista.css'
})
export class TarefaLista implements OnInit {

  tarefas: Tarefa[] = [];
  mensagem = '';
  carregando = false;

  constructor(private tarefaService: TarefaService) { }

  ngOnInit(): void {
    this.carregarTarefas();
  }

  carregarTarefas(): void {
    this.carregando = true;
    this.tarefaService.listarTarefas().subscribe({
      next: tarefas => {
        this.tarefas = tarefas;
        this.carregando = false;
      },
      error: erro => {
        this.mensagem = erro.message;
        this.carregando = false;
      }
    });
  }

  concluir(tarefa: Tarefa): void {
    if (!tarefa.id || tarefa.status === 'CONCLUIDA') {
      return;
    }
    this.tarefaService.concluirTarefa(tarefa.id).subscribe({
      next: atualizada => {
        this.tarefas = this.tarefas.map(t => t.id === atualizada.id ? atualizada : t);
        this.mensagem = `Tarefa "${atualizada.titulo}" concluída com sucesso.`;
      },
      error: erro => this.mensagem = erro.message
    });
  }

  excluir(tarefa: Tarefa): void {
    if (!tarefa.id) {
      return;
    }
    this.tarefaService.excluirTarefa(tarefa.id).subscribe({
      next: () => {
        this.tarefas = this.tarefas.filter(t => t.id !== tarefa.id);
        this.mensagem = `Tarefa "${tarefa.titulo}" excluída com sucesso.`;
      },
      error: erro => this.mensagem = erro.message
    });
  }
}
