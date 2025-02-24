export const MantenimientoEntity = {
    id: null,
    frecuencia: '',
    nivel: '',
    responsable: '',
    completado: '',
    observacion: '',
    periodo1: '',
    periado2: '',
    fecha: '',
    equipo: {
        id: null,
        tipo: '',
        nivel: '',
        modelo: '',
        serie: '',
        codigo: '',
        fec_fabricacion: '',
        enlFabricante: '',
        enlRecomendaciones: '',
        enlImagenes: '',
        estado: '',
        marca: {
            id: null,
            nombre: '',
        },
        clase_equipo: {
            id: null,
            nombre: '',
        },
        sede: {
            id: null,
            nombre: '',
            direccion: ''
        },
        proveedor: {
            id: null,
            nombre: '',
            telefono: '',
            email: '',
            contacto: ''
        },
        ubicacion_fisica: {
            id: null,
            nombre: '',
        },
        area: {
            id: null,
            nombre: '',
        },
        servicio: {
            id: null,
            nombre: '',
        },
    }
};
