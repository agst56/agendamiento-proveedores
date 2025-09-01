export type EnUso = 'S' | 'N';


export interface Jaula {
idJaula: number;
nombre: string;
enUso: EnUso; // 'S' | 'N'
}