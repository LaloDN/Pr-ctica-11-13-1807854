export interface Coordenadas{
    lat:number;
    lng:number;
}

export interface LugarUbicacion extends Coordenadas{
    adrress:string;
    staticMapImageUrl: string;
}