import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TarefaService } from '../../services/tarefa.service';
import { Tarefa } from '../../models/tarefa.model';

@Component({
  selector: 'app-tarefa-formulario',
  imports: [ReactiveFormsModule],
  templateUrl: './tarefa-formulario.html',
  styleUrl: './tarefa-formulario.css'
})
export class TarefaFormulario implements OnInit {

  formulario!: FormGroup;
  editando = false;
  mensagem = '';
  salvando = false;
  tarefaAtual: Tarefa | null = null;

  constructor(
    private fb: FormBuilder,
    private tarefaService: TarefaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formulario = this.montarFormulario();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.editando = true;
      this.tarefaService.buscarTarefa(id).subscribe({
        next: tarefa => {
          this.tarefaAtual = tarefa;
          this.formulario.patchValue(tarefa);
        },
        error: erro => this.mensagem = erro.message
      });
    }
  }

  get titulo() { return this.formulario.get('titulo'); }
  get materia() { return this.formulario.get('materia'); }
  get dataEntrega() { return this.formulario.get('dataEntrega'); }

  salvar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.salvando = true;
    const dados = this.formulario.value;

    if (this.editando) {
      const tarefa = { ...this.tarefaAtual, ...dados } as Tarefa;
      if (!tarefa.id) {
        return;
      }
      this.tarefaService.atualizarTarefa(tarefa.id, tarefa).subscribe({
        next: () => this.router.navigate(['/']),
        error: erro => {
          this.mensagem = erro.message;
          this.salvando = false;
        }
      });
    } else {
      this.tarefaService.criarTarefa(dados as Tarefa).subscribe({
        next: () => this.router.navigate(['/']),
        error: erro => {
          this.mensagem = erro.message;
          this.salvando = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/']);
  }

  private montarFormulario() {
    return this.fb.group({
      titulo: ['', Validators.required],
      materia: ['', Validators.required],
      dataEntrega: ['', Validators.required]
    });
  }
}
