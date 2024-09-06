import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
//import Cookies from 'universal-cookie';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { environment } from "./util/baseUrl";
import { Dropdown } from 'primereact/dropdown';

import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';





export const MantenimientoU = () => {

    const baseUrl = environment.baseUrl + "mantenimiento/";
    const [data, setData] = useState(null);

    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    let navigate = useNavigate();
    const cookies = new Cookies();



    //Filtros
    const [actividadFilter, setActividadFilter] = useState(null);
    const [actividades, setActividades] = useState([]);
    const [responsableFilter, setResponsableFilter] = useState(null);
    const [responsables, setResponsables] = useState([]);

    const [claseFilter, setClaseFilter] = useState(null);
    const [clases, setClases] = useState([]);
    const [servicioFilter, setServicioFilter] = useState(null);
    const [servicios, setServicios] = useState([]);

    const [serieFilter, setSerieFilter] = useState(null);
    const [series, setSeries] = useState([]);


    const peticionGet = async () => {
        await axios.get(baseUrl)
            .then(response => {
                setData(response.data);
                const uniqueActividades = Array.from(new Set(response.data.map(item => item.actividad))).map(actividad => ({ label: actividad, value: actividad }));
                const uniqueResponsables = Array.from(new Set(response.data.map(item => item.responsable))).map(responsable => ({ label: responsable, value: responsable }));

                const uniqueClases = Array.from(new Set(response.data.map(item => item.equipo.clase_equipo.nombre))).map(clase_equipo => ({ label: clase_equipo, value: clase_equipo }));
                const uniqueServicios = Array.from(new Set(response.data.map(item => item.equipo.servicio.nombre))).map(servicio => ({ label: servicio, value: servicio }));

                const uniqueSerie = Array.from(new Set(response.data.map(item => item.equipo.serie))).map(serie => ({ label: serie, value: serie }));

                setActividades([{ label: 'Todos', value: null }, ...uniqueActividades]);
                setResponsables([{ label: 'Todos', value: null }, ...uniqueResponsables]);

                setClases([{ label: 'Todos', value: null }, ...uniqueClases]);
                setServicios([{ label: 'Todos', value: null }, ...uniqueServicios]);

                setSeries([{ label: 'Todos', value: null }, ...uniqueSerie]);


            }).catch(error => {
                console.log(error);
            })
    }




    useEffect(() => {
        if (cookies.get('role') !== 'USER') {
            navigate('/mantenimiento');
        }
        peticionGet();
    }, []);



    //HandleChange para filtros
    //Campos de Mantenimiento
    const onActividadFilterChange = (e) => {
        setActividadFilter(e.value);
        dt.current.filter(e.value, 'actividad', 'equals');
    }
    const onResponsableFilterChange = (e) => {
        setResponsableFilter(e.value);
        dt.current.filter(e.value, 'responsable', 'equals');
    }
    //Doble Foraneo
    const onClaseFilterChange = (e) => {
        setClaseFilter(e.value);
        dt.current.filter(e.value, 'equipo.clase_equipo.nombre', 'equals');
    }
    const onServicioFilterChange = (e) => {
        setServicioFilter(e.value);
        dt.current.filter(e.value, 'equipo.servicio.nombre', 'equals');
    }
    //Foraneo normal
    const onSerieFilterChange = (e) => {
        setSerieFilter(e.value);
        dt.current.filter(e.value, 'equipo.serie', 'equals');
    }



    const leftFiltroToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="formgrid grid" >
                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={actividadFilter} options={actividades} onChange={onActividadFilterChange} placeholder="Seleccionar Actividad" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
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
    const idequipoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.equipo.codigo}
            </>
        );
    }
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
    const serieequipoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.equipo.serie}
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
    const fec_programadaBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.fecProgramada}
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
    const actividadBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.actividad}
            </>
        );
    }



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
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftFiltroToolbarTemplate} ></Toolbar>
                    <DataTable ref={dt} value={data} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Ver {first} a {last} de {totalRecords} Mantenimientos"
                        globalFilter={globalFilter} emptyMessage="No existen registros." header={header}
                        scrollable
                        showGridlines>
                        <Column field="id" header="N°" body={idBodyTemplate} style={{ minWidth: '50px' }}></Column>
                        <Column field="idequipo" header="Código del equipo" body={idequipoBodyTemplate} style={{ minWidth: '100px', wordBreak: 'break-word' }}></Column>
                        <Column field="claseequipo" header="Dispositivo" body={claseequipoBodyTemplate} style={{ minWidth: '200px', wordBreak: 'break-word' }}></Column>

                        <Column field="seriequipo" header="Serie" body={serieequipoBodyTemplate} style={{ minWidth: '100px', wordBreak: 'break-word' }}></Column>
                        <Column field="servicio" header="Servicio" body={servicioBodyTemplate} style={{ minWidth: '100px', wordBreak: 'break-word' }}></Column>

                        <Column field="responsable" header="Responsable" body={responsableBodyTemplate} style={{ minWidth: '130px', wordBreak: 'break-word' }}></Column>
                        <Column field="fec_programada" header="Fecha Programada" body={fec_programadaBodyTemplate} style={{ minWidth: '140px', wordBreak: 'break-word' }}></Column>
                        <Column field="actividad" header="Actividad" body={actividadBodyTemplate} style={{ minWidth: '300px', wordBreak: 'break-word' }}></Column>
                        <Column field="descripcion" header="Descripción" body={descripcionBodyTemplate} style={{ minWidth: '300px', wordBreak: 'break-word' }}></Column>

                    </DataTable>
                </div>
            </div>
        </div>
    );
}

export default MantenimientoU;
