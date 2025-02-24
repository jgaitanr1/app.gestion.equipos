import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import Cookies from 'universal-cookie';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
//import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';
import { environment } from "./util/baseUrl";
import { EquipoEntity } from '../Entity/EquipoEntity';
import { Divider } from 'primereact/divider';

import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';


export const Inventario = () => {

    let empty = EquipoEntity;
    const baseUrl = environment.baseUrl + "equipo/";
    const [data, setData] = useState(null);

    let navigate = useNavigate();
    const cookies = new Cookies();

    //dialogs
    const [getEntidadDialog, setEntidadDialog] = useState(false);

    const [product, setProduct] = useState(empty);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    //Filtros
    const [marcaFilter, setMarcaFilter] = useState(null);
    const [marcas, setMarcas] = useState([]);
    const [claseFilter, setClaseFilter] = useState(null);
    const [clases, setClases] = useState([]);
    const [sedeFilter, setSedeFilter] = useState(null);
    const [sedes, setSedes] = useState([]);
    const [ubicacionFilter, setUbicacionFilter] = useState(null);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [areaFilter, setAreaFilter] = useState(null);
    const [areas, setAreas] = useState([]);
    const [servicioFilter, setServicioFilter] = useState(null);
    const [servicios, setServicios] = useState([]);
    const [proveedorFilter, setProveedorFilter] = useState(null);
    const [proveedores, setProveedores] = useState([]);

    const [estadoFilter, setEstadoFilter] = useState(null);
    const [estados, setEstados] = useState([]);
    const [tipoFilter, setTipoFilter] = useState(null);
    const [tipos, setTipos] = useState([]);
    const [nivelFilter, setNivelFilter] = useState(null);
    const [niveles, setNiveles] = useState([]);


    //Dropdowns
    const [optionsClase_equipo, setOptionsClase_equipo] = useState([]);
    const [optionsMarca, setOptionsMarca] = useState([]);
    const [optionsSede, setOptionsSede] = useState([]);
    const [optionsUbicacion, setOptionsUbicacion] = useState([]);
    const [optionsArea, setOptionsArea] = useState([]);
    const [optionsServicio, setOptionsServicio] = useState([]);
    const [optionsProveedor, setOptionsProveedor] = useState([]);



    const peticionGet = async () => {
        await axios.get(baseUrl)
            .then(response => {
                setData(response.data);
                const uniqueMarcas = Array.from(new Set(response.data.map(item => item.marca.nombre))).map(marca => ({ label: marca, value: marca }));
                const uniqueSedes = Array.from(new Set(response.data.map(item => item.sede.nombre))).map(sede => ({ label: sede, value: sede }));
                const uniqueClases = Array.from(new Set(response.data.map(item => item.clase_equipo.nombre))).map(clase_equipo => ({ label: clase_equipo, value: clase_equipo }));
                const uniqueUbicaciones = Array.from(new Set(response.data.map(item => item.ubicacion_fisica.nombre))).map(ubicacion_fisica => ({ label: ubicacion_fisica, value: ubicacion_fisica }));
                const uniqueAreas = Array.from(new Set(response.data.map(item => item.area.nombre))).map(area => ({ label: area, value: area }));
                const uniqueServicios = Array.from(new Set(response.data.map(item => item.servicio.nombre))).map(servicio => ({ label: servicio, value: servicio }));
                const uniqueProveedores = Array.from(new Set(response.data.map(item => item.proveedor.nombre))).map(proveedor => ({ label: proveedor, value: proveedor }));

                const uniqueEstados = Array.from(new Set(response.data.map(item => item.estado))).map(estado => ({ label: estado, value: estado }));
                const uniqueTipos = Array.from(new Set(response.data.map(item => item.tipo))).map(tipo => ({ label: tipo, value: tipo }));
                const uniqueNiveles = Array.from(new Set(response.data.map(item => item.nivel))).map(nivel => ({ label: nivel, value: nivel }));

                setMarcas([{ label: 'Todos', value: null }, ...uniqueMarcas]);
                setSedes([{ label: 'Todos', value: null }, ...uniqueSedes]);
                setClases([{ label: 'Todos', value: null }, ...uniqueClases]);
                setUbicaciones([{ label: 'Todos', value: null }, ...uniqueUbicaciones]);
                setAreas([{ label: 'Todos', value: null }, ...uniqueAreas]);
                setServicios([{ label: 'Todos', value: null }, ...uniqueServicios]);
                setProveedores([{ label: 'Todos', value: null }, ...uniqueProveedores]);

                setEstados([{ label: 'Todos', value: null }, ...uniqueEstados]);
                setTipos([{ label: 'Todos', value: null }, ...uniqueTipos]);
                setNiveles([{ label: 'Todos', value: null }, ...uniqueNiveles]);


            }).catch(error => {
                console.log(error);
            })
    }

    const peticionGetClase_Equipo = async () => {
        await axios.get(environment.baseUrl + "clase_equipo/")
            .then(response => {
                const dataclase = response.data.map((item) => ({
                    value: item.id,
                    label: item.nombre,
                }));
                setOptionsClase_equipo(dataclase);
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionGetMarca = async () => {
        await axios.get(environment.baseUrl + "marca/")
            .then(response => {
                const datamarca = response.data.map((item) => ({
                    value: item.id,
                    label: item.nombre,
                }));
                setOptionsMarca(datamarca);
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionGetSede = async () => {
        await axios.get(environment.baseUrl + "sede/")
            .then(response => {
                const datasede = response.data.map((item) => ({
                    value: item.id,
                    label: item.nombre,
                }));
                setOptionsSede(datasede);
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionGetUbicacion = async () => {
        await axios.get(environment.baseUrl + "ubicacion_fisica/")
            .then(response => {
                const dataubicacion = response.data.map((item) => ({
                    value: item.id,
                    label: item.nombre,
                }));
                setOptionsUbicacion(dataubicacion);
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionGetArea = async () => {
        await axios.get(environment.baseUrl + "area/")
            .then(response => {
                const dataarea = response.data.map((item) => ({
                    value: item.id,
                    label: item.nombre,
                }));
                setOptionsArea(dataarea);
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionGetServicio = async () => {
        await axios.get(environment.baseUrl + "servicio/")
            .then(response => {
                const dataservicio = response.data.map((item) => ({
                    value: item.id,
                    label: item.nombre,
                }));
                setOptionsServicio(dataservicio);
            }).catch(error => {
                console.log(error);
            })
    }

    const peticionGetProveedor = async () => {
        await axios.get(environment.baseUrl + "proveedor/")
            .then(response => {
                const dataproveedor = response.data.map((item) => ({
                    value: item.id,
                    label: item.nombre,
                }));
                setOptionsProveedor(dataproveedor);
            }).catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        if (cookies.get('role') === 'ADMIN') {
            navigate('/inventario');
        }
        peticionGet();
        peticionGetClase_Equipo();
        peticionGetMarca();
        peticionGetSede();
        peticionGetUbicacion();
        peticionGetArea();
        peticionGetServicio();
        peticionGetProveedor();
    }, []);

    const redireccionar = (url) => {
        window.open(url);
    };


    const hideDialogVer = () => {
        setSubmitted(false);
        setEntidadDialog(false);
    }



    const showProduct = (product) => {
        setProduct({ ...product });
        setEntidadDialog(true);
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
    const onMarcaFilterChange = (e) => {
        setMarcaFilter(e.value);
        dt.current.filter(e.value, 'marca.nombre', 'equals');
    }

    const onClaseFilterChange = (e) => {
        setClaseFilter(e.value);
        dt.current.filter(e.value, 'clase_equipo.nombre', 'equals');
    }

    const onSedeFilterChange = (e) => {
        setSedeFilter(e.value);
        dt.current.filter(e.value, 'sede.nombre', 'equals');
    }

    const onUbicacionFilterChange = (e) => {
        setUbicacionFilter(e.value);
        dt.current.filter(e.value, 'ubicacion_fisica.nombre', 'equals');
    }

    const onAreaFilterChange = (e) => {
        setAreaFilter(e.value);
        dt.current.filter(e.value, 'area.nombre', 'equals');
    }

    const onServicioFilterChange = (e) => {
        setServicioFilter(e.value);
        dt.current.filter(e.value, 'servicio.nombre', 'equals');
    }

    const onProveedorFilterChange = (e) => {
        setProveedorFilter(e.value);
        dt.current.filter(e.value, 'proveedor.nombre', 'equals');
    }

    const onEstadoFilterChange = (e) => {
        setEstadoFilter(e.value);
        dt.current.filter(e.value, 'estado', 'equals');
    }

    const onTipoFilterChange = (e) => {
        setTipoFilter(e.value);
        dt.current.filter(e.value, 'tipo', 'equals');
    }

    const onNivelFilterChange = (e) => {
        setNivelFilter(e.value);
        dt.current.filter(e.value, 'nivel', 'equals');
    }



    const leftFiltroToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="formgrid grid" >
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
                            <Dropdown value={estadoFilter} options={estados} onChange={onEstadoFilterChange} placeholder="Seleccionar Estado" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>
                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={tipoFilter} options={tipos} onChange={onTipoFilterChange} placeholder="Seleccionar Tipo" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
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
                            <Dropdown value={nivelFilter} options={niveles} onChange={onNivelFilterChange} placeholder="Seleccionar Nivel" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
                        </span>
                    </div>
                    <div className="field col-12 md:col-3">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <Dropdown value={proveedorFilter} options={proveedores} onChange={onProveedorFilterChange} placeholder="Seleccionar Proveedor" className="p-inputtext-sm" filter emptyFilterMessage='Sin opciones' resetFilterOnHide />
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

    const serieBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.serie}
            </>
        );
    }

    const estadoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.estado}
            </>
        );
    }

    const clase_equipoBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.clase_equipo.nombre}
            </>
        );
    }

    const marcaBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.marca.nombre}
            </>
        );
    }

    const modeloBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.modelo}
            </>
        );
    }


    const servicioBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.servicio.nombre}
            </>
        );
    }


    const DetallesBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button title="Mostrar Equipo" icon="pi pi-search-plus" className="p-button-rounded p-button-outlined p-button-info mr-2" onClick={() => showProduct(rowData)} />
            </div>
        );
    }

    const FabricanteBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button title="Fabricante" icon="pi pi-external-link" className="p-button-rounded p-button-outlined p-button-danger mr-2" onClick={() => redireccionar(rowData.enlFabricante)} />
            </div>
        );
    }

    const RecomendacionesBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button title="Recomendaciones" icon="pi pi-compass" className="p-button-rounded p-button-outlined p-button-warning mr-2" onClick={() => redireccionar(rowData.enlRecomendaciones)} />
            </div>
        );
    }

    const ImagenesBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button title="Imágenes" icon="pi pi-images" className="p-button-rounded p-button-outlined p-button-danger mr-2" onClick={() => redireccionar(rowData.enlImagenes)} />
            </div>
        );
    }


    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Equipos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const FooterVer = (
        <>
            <Button label="Cerrar" icon="pi pi-times" className="p-button-info" onClick={hideDialogVer} />
        </>
    )

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftFiltroToolbarTemplate} ></Toolbar>
                    <DataTable ref={dt} value={data} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Ver {first} a {last} de {totalRecords} Equipos"
                        globalFilter={globalFilter} emptyMessage="No existen registros."
                        header={header}
                        scrollable
                        showGridlines
                    >
                        <Column field="id" header="N°" body={idBodyTemplate} style={{ minWidth: '50px' }}></Column>
                        {/* <Column field="codigo" header="Codigo" body={idBodyTemplate} style={{ minWidth: '50px' }}></Column> */}
                        <Column field="clase_equipo.nombre" header="Dispositivo" body={clase_equipoBodyTemplate} style={{ minWidth: '200px', wordBreak: 'break-word' }}></Column>
                        <Column field="marca.nombre" header="Marca" body={marcaBodyTemplate} style={{ minWidth: '200px', wordBreak: 'break-word' }}></Column>
                        <Column field="modelo" header="Modelo" body={modeloBodyTemplate} style={{ minWidth: '200px', wordBreak: 'break-word' }}></Column>
                        <Column field="serie" header="Serie" body={serieBodyTemplate} style={{ minWidth: '200px', wordBreak: 'break-word' }}></Column>
                        <Column field="estado" header="Estado" body={estadoBodyTemplate} style={{ minWidth: '150px', wordBreak: 'break-word' }}></Column>
                        <Column field="servicio.nombre" header="Servicio" body={servicioBodyTemplate} style={{ minWidth: '200px', wordBreak: 'break-word' }}></Column>
                        <Column header="Fabricante" body={FabricanteBodyTemplate} style={{ minWidth: '80px' }}></Column>
                        <Column header="Notas" body={RecomendacionesBodyTemplate} style={{ minWidth: '75px' }}></Column>
                        <Column header="Imágenes" body={ImagenesBodyTemplate} style={{ minWidth: '75px' }}></Column>
                        <Column header="Detalles" body={DetallesBodyTemplate} style={{ minWidth: '75px' }}></Column>
                    </DataTable>

                    {/* Lupita */}

                    <Dialog
                        visible={getEntidadDialog}
                        style={{ width: '1400px' }}
                        header="Datos de Equipo"
                        contentStyle={{ overflow: 'visible' }}
                        modal
                        className="p-fluid"
                        footer={FooterVer}
                        onHide={hideDialogVer}
                    >
                        <div className="field col-12" >
                            <div className="formgrid grid" >

                                {/* <div className="field col-12 md:col-2">
                                    <label htmlFor="modelo">Código</label>
                                    <InputText id="modelo" name="modelo" value={product.codigo} />
                                </div> */}
                                <div className="field col-12 md:col-4">
                                    <label htmlFor="equipo">Dispositivo</label>
                                    <InputText id="equipo" name="equipo" value={product.clase_equipo.nombre} />
                                </div>
                                <div className="field col-12 md:col-2">
                                    <label htmlFor="marca">Marca</label>
                                    <InputText id="marca" name="marca" value={product.marca.nombre} />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="modelo">Modelo</label>
                                    <InputText id="modelo" name="modelo" value={product.modelo} />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="serie">Serie</label>
                                    <InputText id="serie" name="serie" value={product.serie} />
                                </div>



                                <div className="field col-12 md:col-2">
                                    <label htmlFor="tipo">Tipo</label>
                                    <InputText id="tipo" name="tipo" value={product.tipo} />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="estado">Estado</label>
                                    <InputText id="estado" name="estado" value={product.estado} />
                                </div>
                                <div className="field col-12 md:col-2">
                                    <label htmlFor="nivel">Nivel</label>
                                    <InputText id="nivel" name="nivel" value={product.nivel} />
                                </div>
                                <div className="field col-12 md:col-2">
                                    <label htmlFor="fec_fabricacion">Fecha de fabricación</label>
                                    <InputText id="fec_fabricacion" name="fec_fabricacion" value={product.fec_fabricacion} />
                                </div>


                                <div className="field col-12 md:col-3">
                                    <label htmlFor="proveedor">Proveedor</label>
                                    <InputText id="proveedor" name="proveedor" value={product.proveedor.nombre} />
                                </div>

                                <Divider layout="horizontal" align="center">
                                    <span className="p-tag">Localización</span>
                                </Divider>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="sede">Sede</label>
                                    <InputText id="sede" name="sede" value={product.sede.nombre} />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="ubicacion_fisica">Ambiente</label>
                                    <InputText id="ubicacion_fisica" name="ubicacion_fisica" value={product.ubicacion_fisica.nombre} />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="area">UPSS</label>
                                    <InputText id="area" name="area" value={product.area.nombre} />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="servicio">Servicio</label>
                                    <InputText id="servicio" name="servicio" value={product.servicio.nombre} />
                                </div>

                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
export default Inventario;
