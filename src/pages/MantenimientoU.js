import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { addLocale } from 'primereact/api';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { environment } from "./util/baseUrl";
import { Dropdown } from 'primereact/dropdown';
import { MantenimientoEntity } from '../Entity/MantenimientoEntity';
import { format } from 'date-fns';

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


    const [globalFilter, setGlobalFilter] = useState(null);

    //equipo combo
    const [optionsEquipo, setOptionsEquipo] = useState([]);

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


    useEffect(() => {
        if (cookies.get('role') === 'USER') {
            navigate('/mantenimientou');
        }
        peticionGet();
        peticionGetEquipo();
    }, []);


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


    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Configuración de Mantenimientos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftFiltroToolbarTemplate} ></Toolbar>
                    <DataTable ref={dt} value={data} style={{ borderRadius: '10px', overflow: 'hidden' }} scrollable
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive custom-datatable"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Ver {first} a {last} de {totalRecords} Mantenimientos"
                        globalFilter={globalFilter} emptyMessage="No existen registros." header={header}
                        showGridlines>


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
                </div>
            </div>
        </div>
    );
}

export default Mantenimiento;
