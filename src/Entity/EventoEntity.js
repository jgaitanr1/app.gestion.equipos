export const EventoEntity = {
    id: null,
    responsable: '',

    fecProgramada: '',
    horEvento: '',

    fecRegistro: '',
    horAtencion: '',
    horFin: '',

    durAtencion: '',
    durInoperativo: '',

    actividad: '',
    problema: '',
    descripcion: '',
    causa: '',
    afectado: '',

    equipo: {
        id: null,
        codigo: '',
        modelo: '',
        serie: '',
        estado: '',
        marca: {
            id: null,
            nombre: '',
        },
        clase_equipo: {
            id: null,
            nombre: '',
        },
        servicio: {
            id: null,
            nombre: '',
        }
    }
};
