import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';

import { addLocale } from 'primereact/api';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import { environment } from "./util/baseUrl";
import { Calendar } from 'primereact/calendar';
import { format } from 'date-fns';
import { EventoEntity } from '../Entity/EventoEntity';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';

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

export const Evento = () => {

    let empty = EventoEntity;

    const baseUrl = environment.baseUrl + "evento/";
    const [data, setData] = useState(null);
    const [EntidadNewDialog, setEntidadNewDialog] = useState(false);

    const [product, setProduct] = useState(empty);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    let navigate = useNavigate();
    const cookies = new Cookies();

    //Filtros

    const [actividadFilter, setActividadFilter] = useState(null);
    const [actividades, setActividades] = useState([]);
    const [causaFilter, setCausaFilter] = useState(null);
    const [causas, setCausas] = useState([]);
    const [afectadoFilter, setAfectadoFilter] = useState(null);
    const [afectados, setAfectados] = useState([]);
    const [responsableFilter, setResponsableFilter] = useState(null);
    const [responsables, setResponsables] = useState([]);

    const [claseFilter, setClaseFilter] = useState(null);
    const [clases, setClases] = useState([]);
    const [servicioFilter, setServicioFilter] = useState(null);
    const [servicios, setServicios] = useState([]);

    const [serieFilter, setSerieFilter] = useState(null);
    const [series, setSeries] = useState([]);
    const [estadoFilter, setEstadoFilter] = useState(null);
    const [estados, setEstados] = useState([]);

    //Dropdowns especiales

    const [actividadId, setActividadId] = useState(null);
    const optionsActividad = [
        { label: 'MANTENIMIENTO PREVENTIVO', value: 'MANTENIMIENTO PREVENTIVO' },
        { label: 'MANTENIMIENTO CORRECTIVO', value: 'MANTENIMIENTO CORRECTIVO' },
        { label: 'CAPACITACIÓN', value: 'CAPACITACIÓN' },
        { label: 'INSTALACIÓN', value: 'INSTALACIÓN' },
        { label: 'INSPECCIÓN', value: 'INSPECCIÓN' },
        { label: 'TRASLADO', value: 'TRASLADO' },
        { label: 'CALIBRACIÓN', value: 'CALIBRACIÓN' },
        { label: 'EVALUACIÓN', value: 'EVALUACIÓN' },
        { label: 'ACTUALIZACIÓN', value: 'ACTUALIZACIÓN' },
    ];

    const [causaId, setCausaId] = useState(null);
    const optionsCausa = [
        { label: 'EQUIPO', value: 'EQUIPO' },
        { label: 'INFRAESTRUCTURA', value: 'INFRAESTRUCTURA' },
        { label: 'USUARIO', value: 'USUARIO' },
    ];

    const [afectadoId, setAfectadoId] = useState(null);
    const optionsAfectado = [
        { label: 'COMPONENTE', value: 'COMPONENTE' },
        { label: 'SOFTWARE', value: 'SOFTWARE' },
        { label: 'AMBOS', value: 'AMBOS' },
    ];

    //let navigate = useNavigate();

    const [equipos, setEquipos] = useState([]);
    const [equipoId, setEquipoId] = useState(null);

    const peticionGet = async () => {
        await axios.get(baseUrl)
            .then(response => {
                setData(response.data);
                const uniqueActividades = Array.from(new Set(response.data.map(item => item.actividad))).map(actividad => ({ label: actividad, value: actividad }));
                const uniqueCausas = Array.from(new Set(response.data.map(item => item.causa))).map(causa => ({ label: causa, value: causa }));
                const uniqueAfectados = Array.from(new Set(response.data.map(item => item.afectado))).map(afectado => ({ label: afectado, value: afectado }));
                const uniqueResponsables = Array.from(new Set(response.data.map(item => item.responsable))).map(responsable => ({ label: responsable, value: responsable }));

                const uniqueClases = Array.from(new Set(response.data.map(item => item.equipo.clase_equipo.nombre))).map(clase_equipo => ({ label: clase_equipo, value: clase_equipo }));
                const uniqueServicios = Array.from(new Set(response.data.map(item => item.equipo.servicio.nombre))).map(servicio => ({ label: servicio, value: servicio }));

                const uniqueSerie = Array.from(new Set(response.data.map(item => item.equipo.serie))).map(serie => ({ label: serie, value: serie }));
                const uniqueEstado = Array.from(new Set(response.data.map(item => item.equipo.estado))).map(estado => ({ label: estado, value: estado }));




                setActividades([{ label: 'Todos', value: null }, ...uniqueActividades]);
                setCausas([{ label: 'Todos', value: null }, ...uniqueCausas]);
                setAfectados([{ label: 'Todos', value: null }, ...uniqueAfectados]);
                setResponsables([{ label: 'Todos', value: null }, ...uniqueResponsables]);

                setClases([{ label: 'Todos', value: null }, ...uniqueClases]);
                setServicios([{ label: 'Todos', value: null }, ...uniqueServicios]);

                setSeries([{ label: 'Todos', value: null }, ...uniqueSerie]);
                setEstados([{ label: 'Todos', value: null }, ...uniqueEstado]);

            }).catch(error => {
                console.log(error);
            })
    }

    const peticionGetEquipo = async () => {
        await axios.get(environment.baseUrl + "equipo/")
            .then(response => {
                const data = response.data.map(item => ({
                    value: item.id,
                    label: item.clase_equipo.nombre + ' (' + item.serie + ')'
                }));
                setEquipos(data);
            }).catch(error => {
                console.log(error);
            })
    }


    const peticionPost = async () => {
        console.log("Entra post");
        delete product.id;
        product.equipo.id = equipoId;
        await axios.post(baseUrl, product)
            .then(response => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ingreso Correcto', life: 3000 });
                setTimeout(() => {
                    window.location.reload();
                }, 200);
            }).catch(error => {
                console.log(error);
                toast.current.show({ severity: 'error', summary: 'Datos Incompletos', detail: 'Datos Incompletos', life: 5000 });
            })
    }

    const peticionPut = async () => {
        if (equipoId != null) {
            product.equipo.id = equipoId;
        }
        console.log(product);
        try {
            await axios.put(baseUrl, product)
                .then(() => {
                    var dataNueva = data.map(u => {
                        if (u.id === product.id) {
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
    };

    useEffect(() => {
        if (cookies.get('role') === 'USER') {
            navigate('/eventou');
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

        setActividadId(null);
        setCausaId(null);
        setAfectadoId(null);
        setEquipoId(null);

        product.actividad = null;
        product.causa = null;
        product.afectado = null;




        setSubmitted(false);
        setEntidadNewDialog(false);
    }
    const editProduct = (product) => {
        setProduct({ ...product });
        setEntidadNewDialog(true);
    }

    const saveProduct = () => {
        setSubmitted(true);
        if (product.equipo.id) {
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
                product.actividad = null;
                product.causa = null;
                product.afectado = null;
            }
            setActividadId(null);
            setCausaId(null);
            setAfectadoId(null);



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

    // const exportCSV = () => {
    //     dt.current.exportCSV();
    // }


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy');
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        if (name === 'fecProgramada' || name === 'fecRegistro') {
            const date = new Date(val);
            if (!isNaN(date.getTime())) {
                _product[`${name}`] = formatDate(date);
            } else {
                console.error('Fecha inválida: ', val);
                _product[`${name}`] = '';
            }
        } else {
            _product[`${name}`] = val;
        }

        setProduct(_product);
    };

    //HandleChange para Dropdown
    const handleChangeEquipo = (event) => {
        setEquipoId(event.value);
        product.equipo.id = event.value;
    };

    const handleChangeActividad = (event) => {
        setActividadId(event.value);
        product.actividad = event.value;
    };
    const handleChangeCausa = (event) => {
        setCausaId(event.value);
        product.causa = event.value;
    };
    const handleChangeAfectado = (event) => {
        setAfectadoId(event.value);
        product.afectado = event.value;
    };



    //onFilterchange para filtros

    const onActividadFilterChange = (e) => {
        setActividadFilter(e.value);
        dt.current.filter(e.value, 'actividad', 'equals');
    }
    const onCausaFilterChange = (e) => {
        setCausaFilter(e.value);
        dt.current.filter(e.value, 'causa', 'equals');
    }
    const onAfectadoFilterChange = (e) => {
        setAfectadoFilter(e.value);
        dt.current.filter(e.value, 'afectado', 'equals');
    }
    const onResponsableFilterChange = (e) => {
        setResponsableFilter(e.value);
        dt.current.filter(e.value, 'responsable', 'equals');
    }



    const onClaseFilterChange = (e) => {
        setClaseFilter(e.value);
        dt.current.filter(e.value, 'equipo.clase_equipo.nombre', 'equals');
    }
    const onServicioFilterChange = (e) => {
        setServicioFilter(e.value);
        dt.current.filter(e.value, 'equipo.servicio.nombre', 'equals');
    }


    const onSerieFilterChange = (e) => {
        setSerieFilter(e.value);
        dt.current.filter(e.value, 'equipo.serie', 'equals');
    }
    const onEstadoFilterChange = (e) => {
        setEstadoFilter(e.value);
        dt.current.filter(e.value, 'equipo.estado', 'equals');
    }



    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Registrar Evento" icon="pi pi-plus-circle" className="p-button-outlined p-button-success mr-2" onClick={openNew} />
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
                            <Dropdown value={actividadFilter} options={actividades} onChange={onActividadFilterChange} placeholder="Seleccionar Actividad" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>
                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={causaFilter} options={causas} onChange={onCausaFilterChange} placeholder="Seleccionar Causa" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>
                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={afectadoFilter} options={afectados} onChange={onAfectadoFilterChange} placeholder="Seleccionar Afectado" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>
                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={responsableFilter} options={responsables} onChange={onResponsableFilterChange} placeholder="Seleccionar Responsable" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>

                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={claseFilter} options={clases} onChange={onClaseFilterChange} placeholder="Seleccionar Dispositivo" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>
                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={servicioFilter} options={servicios} onChange={onServicioFilterChange} placeholder="Seleccionar Servicio" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>

                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={serieFilter} options={series} onChange={onSerieFilterChange} placeholder="Seleccionar Serie" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>
                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={estadoFilter} options={estados} onChange={onEstadoFilterChange} placeholder="Seleccionar Estado" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" /> */}
                {/* <Button label="Exportar" icon="pi pi-upload" className="p-button-outlined p-button-help" onClick={exportCSV} /> */}
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
    // const idequipoBodyTemplate = (rowData) => {
    //     return (
    //         <>
    //             {rowData.equipo.codigo}
    //         </>
    //     );
    // }
    const claseequipoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.equipo.clase_equipo.nombre}
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
    const estadoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.equipo.estado}
            </>
        );
    }
    // const marcaBodyTemplate = (rowData) => {
    //     return (
    //         <>
    //             {rowData.equipo.marca.nombre}
    //         </>
    //     );
    // }

    // const modeloBodyTemplate = (rowData) => {
    //     return (
    //         <>
    //             {rowData.equipo.modelo}
    //         </>
    //     );
    // }

    const serieequipoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.equipo.serie}
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
    const fec_programadaBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.fecProgramada}
            </>
        );
    }
    const horEventoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.horEvento}
            </>
        );
    }
    const fec_registroBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.fecRegistro}
            </>
        );
    }
    const horAtencionBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.horAtencion}
            </>
        );
    }
    const horFinBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.horFin}
            </>
        );
    }
    const durAtencionBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.durAtencion}
            </>
        );
    }
    const durInoperativoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.durInoperativo}
            </>
        );
    }
    const actividadBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.actividad}
            </>
        );
    }
    const problemaBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.problema}
            </>
        );
    }
    const descripcionBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.descripcion}
            </>
        );
    }
    const causaBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.causa}
            </>
        );
    }
    const afectadoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.afectado}
            </>
        );
    }


    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button title="Modificar Evento" icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-success mr-2" onClick={() => editProduct(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Reporte de Actividades</h5>
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
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <Toolbar className="mb-4" left={leftFiltroToolbarTemplate} ></Toolbar>
                    <DataTable ref={dt} value={data} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Ver {first} a {last} de {totalRecords} Eventos"
                        globalFilter={globalFilter} emptyMessage="No existen registros." header={header}
                        scrollable
                        showGridlines>

                        <Column body={actionBodyTemplate} style={{ minWidth: '75px' }}></Column>

                        <Column field="id" header="N°" body={idBodyTemplate} style={{ minWidth: '50px' }}></Column>
                        {/* <Column field="idequipo" header="Código del equipo" body={idequipoBodyTemplate} style={{ minWidth: '100px', wordBreak: 'break-word' }}></Column> */}
                        <Column field="equipo.clase_equipo.nombre" header="Dispositivo" body={claseequipoBodyTemplate} style={{ minWidth: '200px', wordBreak: 'break-word' }}></Column>
                        {/* <Column field="marca" header="Marca" sortable body={marcaBodyTemplate} style={{ minWidth: '120px',wordBreak:'break-word' }}></Column>
                        <Column field="modelo" header="Modelo" body={modeloBodyTemplate} style={{ minWidth: '120px',wordBreak:'break-word' }}></Column> */}
                        <Column field="equipo.serie" header="Serie" body={serieequipoBodyTemplate} style={{ minWidth: '110px', wordBreak: 'break-word' }}></Column>
                        <Column field="equipo.estado" header="Estado" body={estadoBodyTemplate} style={{ minWidth: '120px', wordBreak: 'break-word' }}></Column>
                        <Column field="equipo.servicio.nombre" header="Servicio" body={servicioBodyTemplate} style={{ minWidth: '120px', wordBreak: 'break-word' }}></Column>

                        <Column field="responsable" header="Responsable" body={responsableBodyTemplate} style={{ minWidth: '130px', wordBreak: 'break-word' }}></Column>

                        <Column field="fec_programada" header="Fecha de Evento" body={fec_programadaBodyTemplate} style={{ minWidth: '100px', wordBreak: 'break-word' }}></Column>
                        <Column field="horEvento" header="Hora de Evento" body={horEventoBodyTemplate} style={{ minWidth: '100px', wordBreak: 'break-word' }}></Column>

                        <Column field="fec_registro" header="Fecha de Atención" body={fec_registroBodyTemplate} style={{ minWidth: '100px', wordBreak: 'break-word' }}></Column>
                        <Column field="horAtencion" header="Hora de Atención" body={horAtencionBodyTemplate} style={{ minWidth: '100px', wordBreak: 'break-word' }}></Column>
                        <Column field="horFin" header="Fin de Atención" body={horFinBodyTemplate} style={{ minWidth: '100px', wordBreak: 'break-word' }}></Column>

                        <Column field="durAtencion" header="Duración de Atención" body={durAtencionBodyTemplate} style={{ minWidth: '100px', wordBreak: 'break-word' }}></Column>
                        <Column field="durInoperativo" header="Duración de Inoperatividad" body={durInoperativoBodyTemplate} style={{ minWidth: '120px', wordBreak: 'break-word' }}></Column>

                        <Column field="actividad" header="Actividad" body={actividadBodyTemplate} style={{ minWidth: '140px', wordBreak: 'break-word' }}></Column>
                        <Column field="problema" header="Problema" body={problemaBodyTemplate} style={{ minWidth: '300px', wordBreak: 'break-word' }}></Column>
                        <Column field="descripcion" header="Descripción" body={descripcionBodyTemplate} style={{ minWidth: '300px', wordBreak: 'break-word' }}></Column>
                        <Column field="causa" header="Causa" body={causaBodyTemplate} style={{ minWidth: '100px', wordBreak: 'break-word' }}></Column>
                        <Column field="afectado" header="Parte afectada" body={afectadoBodyTemplate} style={{ minWidth: '120px', wordBreak: 'break-word' }}></Column>
                    </DataTable>
                    <Dialog visible={EntidadNewDialog} style={{ width: '900px' }} header="Datos de Evento" modal className="p-fluid" footer={productDialogFooterNew} onHide={hideDialogNew}>
                        <div className="field col-12">

                            <div className="formgrid grid">
                                <div className="field col-12 md:col-12">
                                    <label htmlFor="cod_equipo">Equipo</label>
                                    <Dropdown placeholder={product.equipo.clase_equipo.nombre + " (" + product.equipo.serie + ")"} id="equipo" name="equipo" options={equipos} value={equipoId} onChange={handleChangeEquipo} required autoFocus filter resetFilterOnHide appendTo={'self'} emptyFilterMessage='Sin opciones' className={classNames({ 'p-invalid': submitted && !product.equipo.serie })} />
                                    {/* {submitted && !product.equipo.codigo && <small className="p-invalid">El Código del equipo es necesario.</small>} */}
                                </div>
                            </div>

                            <div className="formgrid grid">
                                <div className="field col-12 md:col-4">
                                    <label htmlFor="fecProgramada">Fecha del Evento</label>
                                    <Calendar id="fecProgramada" name="fecProgramada" placeholder={product.fecProgramada} showIcon appendTo={'self'} value={product.fecProgramada} onChange={(e) => onInputChange(e, 'fecProgramada')} required locale='es' />
                                </div>
                                <div className="field col-12 md:col-2">
                                    <label htmlFor="horEvento">Hora del Evento</label>
                                    <InputText id="horEvento" name="horEvento" value={product.horEvento} onChange={(e) => onInputChange(e, 'horEvento')} required />
                                </div>
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="responsable">Responsable</label>
                                    <InputText id="responsable" name="responsable" value={product.responsable} onChange={(e) => onInputChange(e, 'responsable')} required />
                                </div>
                            </div>

                            <Divider layout="horizontal" align="center">
                                <span className="p-tag">Datos de Atención</span>
                            </Divider>
                            <div className="formgrid grid">
                                <div className="field col-12 md:col-4">
                                    <label htmlFor="fecRegistro">Fecha de Atención</label>
                                    <Calendar id="fecRegistro" name="fecRegistro" placeholder={product.fecRegistro} showIcon appendTo={'self'} value={product.fecRegistro} onChange={(e) => onInputChange(e, 'fecRegistro')} required locale='es' />
                                    {/* {submitted && !product.fecRegistro && <small className="p-invalid">Fecha de Registro requerida.</small>} */}
                                </div>
                                <div className="field col-12 md:col-2">
                                    <label htmlFor="horAtencion">Hora Inicio</label>
                                    <InputText id="horAtencion" name="horAtencion" value={product.horAtencion} onChange={(e) => onInputChange(e, 'horAtencion')} required />
                                </div>
                                <div className="field col-12 md:col-2">
                                    <label htmlFor="horFin">Hora Fin</label>
                                    <InputText id="horFin" name="horFin" value={product.horFin} onChange={(e) => onInputChange(e, 'horFin')} required />
                                </div>
                                <div className="field col-12 md:col-2">
                                    <label htmlFor="durAtencion">Duración Atención</label>
                                    <InputText id="durAtencion" name="durAtencion" value={product.durAtencion} onChange={(e) => onInputChange(e, 'durAtencion')} required />
                                    {/* {submitted && !product.durAtencion && <small className="p-invalid">Duración de atención requerida.</small>} */}
                                </div>
                                <div className="field col-12 md:col-2">
                                    <label htmlFor="durInoperativo">Duración Inop</label>
                                    <InputText id="durInoperativo" name="durInoperativo" value={product.durInoperativo} onChange={(e) => onInputChange(e, 'durInoperativo')} required />
                                </div>
                            </div>

                            <Divider layout="horizontal" align="center">
                                <span className="p-tag">Actividad</span>
                            </Divider>
                            <div className="field col-12 md:col-12">
                                <Dropdown placeholder={product.actividad} id="actividad" name="actividad" options={optionsActividad} value={actividadId} onChange={handleChangeActividad} appendTo={'self'} />
                            </div>

                            <Divider layout="horizontal" align="center">
                                <span className="p-tag">Problema</span>
                            </Divider>
                            <div className="field col-12 md:col-12">
                                <InputTextarea id="problema" name="problema" value={product.problema} onChange={(e) => onInputChange(e, 'problema')} required autoResize />
                                {/* {submitted && !product.problema && <small className="p-invalid">Problema requerido.</small>} */}
                            </div>

                            <Divider layout="horizontal" align="center">
                                <span className="p-tag">Causa</span>
                            </Divider>
                            <div className="field col-12 md:col-12">
                                <Dropdown placeholder={product.causa} id="causa" name="causa" options={optionsCausa} value={causaId} onChange={handleChangeCausa} appendTo={'self'} />
                            </div>

                            <Divider layout="horizontal" align="center">
                                <span className="p-tag">Parte afectada</span>
                            </Divider>
                            <div className="field col-12 md:col-12">
                                <Dropdown placeholder={product.afectado} id="afectado" name="afectado" options={optionsAfectado} value={afectadoId} onChange={handleChangeAfectado} appendTo={'self'} />
                            </div>

                            <Divider layout="horizontal" align="center">
                                <span className="p-tag">Descripción</span>
                            </Divider>
                            <div className="field col-12 md:col-12">
                                <InputTextarea id="descripcion" name="descripcion" value={product.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required autoResize />
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default Evento;
