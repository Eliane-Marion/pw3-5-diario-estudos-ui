import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Tarefa } from '../models/tarefa.model';

@Injectable({
    providedIn: 'root'
})
export class TarefaService {

    private readonly baseUrl = 'http://localhost:8080/api/tarefas';

    constructor(private http: HttpClient) { }

    listarTarefas(): Observable<Tarefa[]> {
        return this.http.get<Tarefa[]>(this.baseUrl)
            .pipe(catchError(this.tratarErro));
    }

    buscarTarefa(id: number): Observable<Tarefa> {
        return this.http.get<Tarefa>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.tratarErro));
    }

    criarTarefa(tarefa: Tarefa): Observable<Tarefa> {
        return this.http.post<Tarefa>(this.baseUrl, tarefa)
            .pipe(catchError(this.tratarErro));
    }

    atualizarTarefa(id: number, tarefa: Tarefa): Observable<Tarefa> {
        return this.http.put<Tarefa>(`${this.baseUrl}/${id}`, tarefa)
            .pipe(catchError(this.tratarErro));
    }

    excluirTarefa(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.tratarErro));
    }

    concluirTarefa(id: number): Observable<Tarefa> {
        return this.http.put<Tarefa>(`${this.baseUrl}/${id}/concluir`, {})
            .pipe(catchError(this.tratarErro));
    }

    private tratarErro(error: HttpErrorResponse): Observable<never> {
        let mensagem = 'Erro inesperado ao comunicar com o servidor.';
        if (error.error instanceof ErrorEvent) {
            mensagem = `Erro do cliente: ${error.error.message}`;
        } else {
            switch (error.status) {
                case 404:
                    mensagem = 'Tarefa não encontrada.';
                    break;
                case 400:
                    mensagem = 'Requisição inválida. Verifique os dados informados.';
                    break;
                case 409:
                    mensagem = 'Conflito ao processar a tarefa.';
                    break;
                case 500:
                    mensagem = 'Erro interno do servidor.';
                    break;
                default:
                    mensagem = `Erro ${error.status}: ${error.message}`;
            }
        }
        return throwError(() => new Error(mensagem));
    }
}
