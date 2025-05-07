import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { addLocale } from 'primereact/api';

import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import { environment } from "./util/baseUrl";
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { MantenimientoEntity } from '../Entity/MantenimientoEntity';
import { format } from 'date-fns';
import { Divider } from 'primereact/divider';
import { InputTextarea } from 'primereact/inputtextarea';

import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar',
});

export const Mantenimiento = () => {

    let empty = MantenimientoEntity;

    const baseUrl = environment.baseUrl + "mantenimiento/";
    const [data, setData] = useState(null);
    const [EntidadNewDialog, setEntidadNewDialog] = useState(false);

    const [product, setProduct] = useState(empty);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);

    //equipo combo
    const [optionsEquipo, setOptionsEquipo] = useState([]);
    const [equipoId, setEquipoId] = useState(null);

    //fin equipo combo


    const toast = useRef(null);
    const dt = useRef(null);

    let navigate = useNavigate();
    const cookies = new Cookies();

    //Filtros
    const [completadoFilter, setCompletadoFilter] = useState(null);
    const [completados, setCompletados] = useState([]);
    const [responsableFilter, setResponsableFilter] = useState(null);
    const [responsables, setResponsables] = useState([]);
    const [sedeFilter, setSedeFilter] = useState(null);
    const [sedes, setSedes] = useState([]);
    const [servicioFilter, setServicioFilter] = useState(null);
    const [servicios, setServicios] = useState([]);
    const [areaFilter, setAreaFilter] = useState(null);
    const [areas, setAreas] = useState([]);
    const [ubicacionFilter, setUbicacionFilter] = useState(null);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [claseFilter, setClaseFilter] = useState(null);
    const [clases, setClases] = useState([]);
    const [marcaFilter, setMarcaFilter] = useState(null);
    const [marcas, setMarcas] = useState([]);
    const [tipoFilter, setTipoFilter] = useState(null);
    const [tipos, setTipos] = useState([]);

    //Dropdowns especiales
    const [completadoId, setCompletadoId] = useState(null);
    const optionsCompletado = [
        { label: 'SI', value: 'SI' },
        { label: 'NO', value: 'NO' },
        { label: 'ESPERA', value: 'ESPERA' },
    ];

    const peticionGet = async () => {
        await axios.get(baseUrl)
            .then(response => {
                setData(response.data);

                const uniqueSedes = Array.from(new Set(response.data.map(item => item.equipo.sede.nombre))).map(sede => ({ label: sede, value: sede }));
                const uniqueServicios = Array.from(new Set(response.data.map(item => item.equipo.servicio.nombre))).map(servicio => ({ label: servicio, value: servicio }));
                const uniqueCompletados = Array.from(new Set(response.data.map(item => item.completado))).map(completado => ({ label: completado, value: completado }));
                const uniqueResponsables = Array.from(new Set(response.data.map(item => item.responsable))).map(responsable => ({ label: responsable, value: responsable }));
                const uniqueAreas = Array.from(new Set(response.data.map(item => item.equipo.area.nombre))).map(area => ({ label: area, value: area }));
                const uniqueUbicaciones = Array.from(new Set(response.data.map(item => item.equipo.ubicacion_fisica.nombre))).map(ubicacion_fisica => ({ label: ubicacion_fisica, value: ubicacion_fisica }));
                const uniqueClases = Array.from(new Set(response.data.map(item => item.equipo.clase_equipo.nombre))).map(clase_equipo => ({ label: clase_equipo, value: clase_equipo }));
                const uniqueMarcas = Array.from(new Set(response.data.map(item => item.equipo.marca.nombre))).map(marca => ({ label: marca, value: marca }));
                const uniqueTipo = Array.from(new Set(response.data.map(item => item.equipo.tipo))).map(tipo => ({ label: tipo, value: tipo }));

                setCompletados([{ label: 'Todos', value: null }, ...uniqueCompletados]);
                setResponsables([{ label: 'Todos', value: null }, ...uniqueResponsables]);
                setSedes([{ label: 'Todos', value: null }, ...uniqueSedes]);
                setServicios([{ label: 'Todos', value: null }, ...uniqueServicios]);
                setAreas([{ label: 'Todos', value: null }, ...uniqueAreas]);
                setUbicaciones([{ label: 'Todos', value: null }, ...uniqueUbicaciones]);
                setClases([{ label: 'Todos', value: null }, ...uniqueClases]);
                setMarcas([{ label: 'Todos', value: null }, ...uniqueMarcas]);
                setTipos([{ label: 'Todos', value: null }, ...uniqueTipo]);

            }).catch(error => {
                console.log(error);
            })
    }

    const peticionGetEquipo = async () => {
        await axios.get(environment.baseUrl + "equipo/")
            .then(response => {
                const data = response.data.map((item) => ({
                    value: item.id,
                    label: item.clase_equipo.nombre + " (" + item.serie + ")",
                }));
                setOptionsEquipo(data);
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionPost = async () => {
        delete product.id; // Asegúrate de eliminar el ID si se genera automáticamente en el backend

        if (typeof product.fecha === 'string' && product.fecha.includes('/')) {
            console.log(product.fecha);
        } else {
            product.fecha = formatDate(product.fecha);
        }

        await axios.post(baseUrl, product)
            .then(response => {
                const nuevoEquipo = response.data;
                // Actualiza los datos del nuevo equipo de forma similar a cómo lo haces en peticionPut
                const nuevoRegistro = {
                    ...nuevoEquipo,
                    equipo: {
                        ...nuevoEquipo.equipo,
                        sede: { ...nuevoEquipo.equipo.sede },
                        servicio: { ...nuevoEquipo.equipo.servicio },
                        area: { ...nuevoEquipo.equipo.area },
                        ubicacion_fisica: { ...nuevoEquipo.equipo.ubicacion_fisica },
                        clase_equipo: { ...nuevoEquipo.equipo.clase_equipo },
                        marca: { ...nuevoEquipo.equipo.marca },
                    },
                    frecuencia: nuevoEquipo.frecuencia,
                    nivel: nuevoEquipo.nivel,
                    responsable: nuevoEquipo.responsable,
                    completado: nuevoEquipo.completado,
                    observacion: nuevoEquipo.observacion,
                    periodo1: nuevoEquipo.periodo1,
                    periado2: nuevoEquipo.periado2,
                    fecha: nuevoEquipo.fecha,
                };
                setData(data.concat(nuevoRegistro));

                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ingreso Correcto', life: 3000 });
                setTimeout(() => {
                    window.location.reload();
                }, 200);
            })
            .catch(error => {
                console.log(error);
                toast.current.show({ severity: 'error', summary: 'Datos Incompletos', detail: 'Datos Incompletos', life: 5000 });
            });

        setOptionsEquipo(null);
    };

    const peticionPut = async () => {
        if (typeof product.fecha === 'string' && product.fecha.includes('/')) {
            console.log(product.fecha);
        } else {
            product.fecha = formatDate(product.fecha);
        }
        try {
            await axios.put(baseUrl, product)
                .then(() => {
                    var dataNueva = data.map(u => {
                        if (u.id === product.id) {
                            u.equipo.id = product.equipo.id;
                            u.equipo.sede.nombre = product.equipo.sede.nombre;
                            u.equipo.servicio.nombre = product.equipo.servicio.nombre;
                            u.equipo.area.nombre = product.equipo.area.nombre;
                            u.equipo.ubicacion_fisica.nombre = product.equipo.ubicacion_fisica.nombre;
                            u.equipo.clase_equipo.nombre = product.equipo.clase_equipo.nombre;
                            u.equipo.marca.nombre = product.equipo.marca.nombre;
                            u.equipo.modelo = product.equipo.modelo;
                            u.equipo.serie = product.equipo.serie;
                            u.equipo.tipo = product.equipo.tipo;
                            u.frecuencia = product.frecuencia;
                            u.nivel = product.nivel;
                            u.responsable = product.responsable;
                            u.completado = product.completado;
                            u.observacion = product.observacion;
                            u.periodo1 = product.periodo1;
                            u.periado2 = product.periado2;
                            u.fecha = product.fecha;
                        }
                        return u;
                    });
                    setData(dataNueva);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ingreso Modificado', life: 3000 });
                    setTimeout(() => {
                        window.location.reload();
                    }, 200);
                })
                .catch(error => {
                    console.log(error);
                    toast.current.show({ severity: 'error', summary: 'Datos Incorrectos', detail: 'Datos Incorrectos', life: 5000 });
                });
        } catch (error) {
            console.error(error);
        }

        setOptionsEquipo(null);
    };

    useEffect(() => {
        if (cookies.get('role') === 'USER') {
            navigate('/mantenimientou');
        }
        peticionGet();
        peticionGetEquipo();
    }, []);

    const openNew = () => {
        setProduct(empty);
        setSubmitted(false);
        setEntidadNewDialog(true);
    }
    const hideDialogNew = () => {

        setCompletadoId(null);
        setEquipoId(null);


        product.completado = null;


        setSubmitted(false);
        setEntidadNewDialog(false);
    }
    const editProduct = (product) => {
        setProduct({ ...product });
        setEntidadNewDialog(true);
    }

    const saveProduct = () => {
        setSubmitted(true);
        if (product.equipo.id && product.completado && product.fecha) {
            let _products = [...data];
            let _product = { ...product };
            if (product.id) {
                const index = findIndexById(product.id);
                _products[index] = _product;
                peticionPut();
            }
            else {
                peticionPost();
                _products.push(_product);
                product.completado = null;

            }
            setCompletadoId(null);

            setEntidadNewDialog(false);
            setProduct(empty);
        } else {
            toast.current.show({ severity: 'error', summary: 'Datos Incompletos', detail: 'Datos Incompletos', life: 2000 });
        }
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    //onFilterChange

    const onCompletadoFilterChange = (e) => {
        setCompletadoFilter(e.value);
        dt.current.filter(e.value, 'completado', 'equals');
    }
    const onResponsableFilterChange = (e) => {
        setResponsableFilter(e.value);
        dt.current.filter(e.value, 'responsable', 'equals');
    }
    const onSedeFilterChange = (e) => {
        setSedeFilter(e.value);
        dt.current.filter(e.value, 'equipo.sede.nombre', 'equals');
    }
    const onServicioFilterChange = (e) => {
        setServicioFilter(e.value);
        dt.current.filter(e.value, 'equipo.servicio.nombre', 'equals');
    }
    const onAreaFilterChange = (e) => {
        setAreaFilter(e.value);
        dt.current.filter(e.value, 'equipo.area.nombre', 'equals');
    }
    const onUbicacionFilterChange = (e) => {
        setUbicacionFilter(e.value);
        dt.current.filter(e.value, 'equipo.ubicacion_fisica.nombre', 'equals');
    }

    const onClaseFilterChange = (e) => {
        setClaseFilter(e.value);
        dt.current.filter(e.value, 'equipo.clase_equipo.nombre', 'equals');
    }
    const onMarcaFilterChange = (e) => {
        setMarcaFilter(e.value);
        dt.current.filter(e.value, 'equipo.marca.nombre', 'equals');
    }
    const onTipoFilterChange = (e) => {
        setMarcaFilter(e.value);
        dt.current.filter(e.value, 'equipo.tipo', 'equals');
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Registrar Mantenimiento" icon="pi pi-plus-circle" className="p-button-outlined p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        )
    }

    const leftFiltroToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="formgrid grid" >
                    <div className="field col-12 md:col-12">
                        <h5 className="m-0">Filtros</h5>
                    </div>

                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={claseFilter} options={clases} onChange={onClaseFilterChange} placeholder="Seleccionar Dispositivo" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>
                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={marcaFilter} options={marcas} onChange={onMarcaFilterChange} placeholder="Seleccionar Marca" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>
                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={responsableFilter} options={responsables} onChange={onResponsableFilterChange} placeholder="Seleccionar Responsable" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>
                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={completadoFilter} options={completados} onChange={onCompletadoFilterChange} placeholder="Completado?" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>

                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={sedeFilter} options={sedes} onChange={onSedeFilterChange} placeholder="Seleccionar Sede" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>
                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={ubicacionFilter} options={ubicaciones} onChange={onUbicacionFilterChange} placeholder="Seleccionar Ambiente" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>
                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={areaFilter} options={areas} onChange={onAreaFilterChange} placeholder="Seleccionar UPSS" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>
                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={servicioFilter} options={servicios} onChange={onServicioFilterChange} placeholder="Seleccionar Servicio" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>



                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={tipoFilter} options={tipos} onChange={onTipoFilterChange} placeholder="Seleccionar Tipo" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>
                </div>
            </React.Fragment>
        )
    }


    const idBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.id}
            </>
        );
    }

    const areaBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.equipo.area.nombre}
            </>
        );
    }

    const sedeBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.equipo.sede.nombre}
            </>
        );
    }

    const servicioBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.equipo.servicio.nombre}
            </>
        );
    }

    const ubicacion_fisicaBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.equipo.ubicacion_fisica.nombre}
            </>
        );
    }

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.equipo.clase_equipo.nombre}
            </>
        );
    }

    const marcaBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.equipo.marca.nombre}
            </>
        );
    }

    const modeloBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.equipo.modelo}
            </>
        );
    }

    const serieBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.equipo.serie}
            </>
        );
    }

    const tipoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.equipo.tipo}
            </>
        );
    }

    const frecuenciaBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.frecuencia}
            </>
        );
    }

    const nivelBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.nivel}
            </>
        );
    }

    const responsableBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.responsable}
            </>
        );
    }

    const completadoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.completado}
            </>
        );
    }

    const observacionBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.observacion}
            </>
        );
    }

    const perido1BodyTemplate = (rowData) => {
        return (
            <>
                {rowData.perido1}
            </>
        );
    }
    const perido2BodyTemplate = (rowData) => {
        return (
            <>
                {rowData.perido2}
            </>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : format(date, 'dd/MM/yyyy');
    };

    const stringToDate = (dateString) => {
        if (!dateString) return null;
        if (dateString instanceof Date) {
            return dateString;
        }
        if (typeof dateString === 'number') {
            return new Date(dateString);
        }
        if (typeof dateString === 'string' && dateString.includes('/')) {
            const [day, month, year] = dateString.split('/').map(Number);
            return new Date(year, month - 1, day);
        }
        return null;
    };

    const getBackgroundColor = (completado) => {
        switch (completado) {
            case 'ESPERA':
                return 'yellow';
            case 'SI':
                return 'lightgreen';
            case 'NO':
                return 'red';
            default:
                return 'transparent';
        }
    };

    const monthBodyTemplate = (rowData, month) => {

        const maintenanceDate = stringToDate(rowData.fecha);
        const maintenanceMonth = maintenanceDate.getMonth();
        const currentYear = new Date().getFullYear();

        return (
            <div
                style={{
                    backgroundColor: maintenanceDate.getFullYear() === currentYear && maintenanceMonth === month
                        ? getBackgroundColor(rowData.completado)
                        : 'transparent',
                    padding: '30px',
                    textAlign: 'center',
                    borderRadius: '1px'
                }}
            >
                {maintenanceMonth === month ? '❌' : ''}
            </div>
        );
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button title="Modificar Mantenimiento" icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-success mr-2" onClick={() => editProduct(rowData)} />
            </div>
        );
    }

    const onInputChange = (e, name) => {
        let val;
        if (name === 'fecha') {
            val = e.value;
        } else {
            val = (e.target && e.target.value) || '';
        }
        // Actualizar solo el campo específico en el producto
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: val
        }));
    };

    //HandleChange para Dropdown
    const handleChangeEquipoSerie = (event) => {
        setEquipoId(event.value);
        product.equipo.id = event.value;
    };

    const handleChangeCompletado = (event) => {
        setCompletadoId(event.value);
        product.completado = event.value;
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Configuración de Mantenimientos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooterNew = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialogNew} />
            <Button label="Aceptar" icon="pi pi-check" className="p-button-success" onClick={saveProduct} />
        </>
    );

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                    <Toolbar className="mb-4" left={leftFiltroToolbarTemplate} ></Toolbar>
                    <DataTable ref={dt} value={data} style={{ borderRadius: '10px', overflow: 'hidden' }} scrollable
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive custom-datatable"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Ver {first} a {last} de {totalRecords} Mantenimientos"
                        globalFilter={globalFilter} emptyMessage="No existen registros." header={header}
                        showGridlines>

                        <Column body={actionBodyTemplate} style={{ minWidth: '90px', wordBreak: 'break-word' }} />

                        <Column field="id" header="N°" body={idBodyTemplate} style={{ minWidth: '80px' }}></Column>

                        <Column field="equipo.sede.nombre" header="Sede" body={sedeBodyTemplate} style={{ minWidth: '130px', wordBreak: 'break-word' }} />
                        <Column field="equipo.ubicacion_fisica.nombre" header="Ambiente" body={ubicacion_fisicaBodyTemplate} style={{ minWidth: '120px', wordBreak: 'break-word' }} />
                        <Column field="equipo.area.nombre" header="UPSS" body={areaBodyTemplate} style={{ minWidth: '130px', wordBreak: 'break-word' }} />
                        <Column field="equipo.servicio.nombre" header="Servicio" body={servicioBodyTemplate} style={{ minWidth: '130px', wordBreak: 'break-word' }} />
                        <Column field="equipo.clase_equipo.nombre" header="Dispositivo" body={nombreBodyTemplate} style={{ minWidth: '200px', wordBreak: 'break-word' }} />
                        <Column field="equipo.marca.nombre" header="Marca" body={marcaBodyTemplate} style={{ minWidth: '120px', wordBreak: 'break-word' }} />
                        <Column field="equipo.modelo" header="Modelo" body={modeloBodyTemplate} style={{ minWidth: '120px', wordBreak: 'break-word' }} />
                        <Column field="equipo.serie" header="Serie" body={serieBodyTemplate} style={{ minWidth: '120px', wordBreak: 'break-word' }} />
                        <Column field="equipo.tipo" header="Tipo" body={tipoBodyTemplate} style={{ minWidth: '120px', wordBreak: 'break-word' }} />
                        <Column field="frecuencia" header="Frecuencia (Meses)" body={frecuenciaBodyTemplate} style={{ minWidth: '150px', wordBreak: 'break-word' }} />
                        <Column field="nivel" header="Nivel" body={nivelBodyTemplate} style={{ minWidth: '120px', wordBreak: 'break-word' }} />
                        <Column field="responsable" header="Responsable" body={responsableBodyTemplate} style={{ minWidth: '120px', wordBreak: 'break-word' }} />
                        {Array.from({ length: 12 }).map((_, month) => (
                            <Column key={month} header={new Date(0, month).toLocaleString('es', { month: 'short' })} body={(rowData) => monthBodyTemplate(rowData, month)} style={{ width: '80px', textAlign: 'center' }} align="center" alignHeader="center" />
                        ))}
                        <Column field="completado" header="Completado" body={completadoBodyTemplate} style={{ minWidth: '120px', wordBreak: 'break-word' }} />
                        <Column field="observacion" header="Observación" body={observacionBodyTemplate} style={{ minWidth: '120px', wordBreak: 'break-word' }} />
                    </DataTable>
                    <Dialog visible={EntidadNewDialog} style={{ width: '700px' }} header="Datos de Mantenimiento" modal className="p-fluid" footer={productDialogFooterNew} onHide={hideDialogNew} p>
                        <div className="field col-12">
                            <div className="formgrid grid">
                                <div className="field col-12 md:col-12">
                                    <label htmlFor="equipo.serie">Equipo</label>
                                    <Dropdown placeholder={product.equipo.clase_equipo.nombre + " (" + product.equipo.serie + ")"} id="equipo.serie" name="equipo.serie" options={optionsEquipo} value={equipoId} onChange={handleChangeEquipoSerie} filter resetFilterOnHide appendTo={'self'} emptyFilterMessage='Sin opciones' className={classNames({ 'p-invalid': submitted && !product.equipo.serie })} />
                                </div>
                                <Divider layout="horizontal" align="center">
                                    <span className="p-tag">Mantenimiento</span>
                                </Divider>
                                <div className="field col-12 md:col-12">
                                    <label htmlFor="responsable">Responsable</label>
                                    <InputText id="responsable" name="responsable" value={product.responsable} onChange={(e) => onInputChange(e, 'responsable')} />
                                    {/* {submitted && !product.responsable && <small className="p-invalid">El responsable es requerido.</small>} */}
                                </div>
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="fecha">Fecha</label>
                                    <Calendar id="fecha" name="fecha" placeholder="dd/mm/aaaa" value={product.fecha ? stringToDate(product.fecha) : product.fecha} dateFormat="dd/mm/yy" locale='es' appendTo={'self'} onChange={(e) => onInputChange(e, 'fecha')} className={classNames({ 'p-invalid': submitted && !product.fecha })} />
                                </div>
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="completado">Completado</label>
                                    <Dropdown placeholder={product.completado} id="completado" name="completado" options={optionsCompletado} value={completadoId} onChange={handleChangeCompletado} appendTo={'self'} className={classNames({ 'p-invalid': submitted && !product.completado })} />
                                </div>
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="frecuencia">Frecuencia</label>
                                    <InputText id="frecuencia" name="frecuencia" value={product.frecuencia} onChange={(e) => onInputChange(e, 'frecuencia')} />
                                </div>
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="nivel">Nivel</label>
                                    <InputText id="nivel" name="nivel" value={product.nivel} onChange={(e) => onInputChange(e, 'nivel')} />
                                </div>

                                <Divider layout="horizontal" align="center">
                                    <span className="p-tag">Observación</span>
                                </Divider>
                                <div className="field col-12 md:col-12">
                                    <InputTextarea id="observacion" name="observacion" value={product.observacion} onChange={(e) => onInputChange(e, 'observacion')} autoResize />
                                </div>

                                <Divider layout="horizontal" align="center">
                                    <span className="p-tag">Informes</span>
                                </Divider>
                                <div className="field col-12 md:col-12">
                                    <label htmlFor="periodo1">Periodo 1</label>
                                    <InputTextarea id="periodo1" name="periodo1" value={product.periodo1} onChange={(e) => onInputChange(e, 'periodo1')} autoResize />
                                </div>
                                <div className="field col-12 md:col-12">
                                    <label htmlFor="periado2">Periodo 2</label>
                                    <InputTextarea id="periado2" name="periado2" value={product.periado2} onChange={(e) => onInputChange(e, 'periado2')} autoResize />
                                </div>


                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default Mantenimiento;
