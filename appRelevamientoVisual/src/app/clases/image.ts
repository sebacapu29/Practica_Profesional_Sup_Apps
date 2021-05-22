export class Image {
    public key: string;
    public cualidad: string;
    public creador: string;
    public fecha: string;
    public ruta: string;
    public votos: number;
    /**
     *
     */
    constructor(cualidad: string, creador: string, ruta: string, votos: number, fecha?: string) {
        if (fecha) {
            this.fecha = new Date(fecha).toString();
        } else {
            this.fecha = new Date().toString();
        }
        this.cualidad = cualidad;
        this.creador = creador;
        this.ruta = ruta;
        this.votos = votos;
    }
}
