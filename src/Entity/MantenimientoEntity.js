export const MantenimientoEntity = {
    id: null,
    descripcion: '',
    responsable: '',
    fecProgramada: '',
    actividad: '',
    equipo: {
        id: null,
        codigo: '',
        modelo: '',
        serie: '',
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
