import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import Cookies from 'universal-cookie';

import classNames from 'classnames';
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
import { InputTextarea } from 'primereact/inputtextarea';

import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';


export const Inventario = () => {

    let empty = EquipoEntity;
    const baseUrl = environment.baseUrl + "equipo/";
    const [data, setData] = useState(null);

    let navigate = useNavigate();
    const cookies = new Cookies();

    //dialogs
    const [EntidadNewDialog, setEntidadNewDialog] = useState(false);
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
    const [clase_equipoId, setClase_equipoId] = useState(null);
    const [optionsMarca, setOptionsMarca] = useState([]);
    const [marcaId, setMarcaId] = useState(null);
    const [optionsSede, setOptionsSede] = useState([]);
    const [sedeId, setSedeId] = useState(null);
    const [optionsUbicacion, setOptionsUbicacion] = useState([]);
    const [ubicacionId, setUbicacionId] = useState(null);
    const [optionsArea, setOptionsArea] = useState([]);
    const [areaId, setAreaId] = useState(null);
    const [optionsServicio, setOptionsServicio] = useState([]);
    const [servicioId, setServicioId] = useState(null);
    const [optionsProveedor, setOptionsProveedor] = useState([]);
    const [proveedorId, setProveedorId] = useState(null);

    //Dropdowns especiales
    const [nivelId, setNivelId] = useState(null);
    const optionsNivel = [
        { label: 'PRINCIPAL', value: 'PRINCIPAL' },
        { label: 'SECUNDARIO', value: 'SECUNDARIO' },
    ];

    const [tipoId, setTipoId] = useState(null);
    const optionsTipo = [
        { label: 'PROPIO', value: 'PROPIO' },
        { label: 'TERCERO', value: 'TERCERO' },
        { label: 'COMODATO', value: 'COMODATO' },
    ]

    const [estadoId, setEstadoId] = useState(null);
    const optionsEstado = [
        { label: 'DESCONOCIDO', value: 'DESCONOCIDO' },
        { label: 'INOPERATIVO', value: 'INOPERATIVO' },
        { label: 'INOPERATIVO / PARA SU VENTA', value: 'INOPERATIVO / PARA SU VENTA' },
        { label: 'INOPERATIVO / RENOVACION', value: 'INOPERATIVO / RENOVACION' },
        { label: 'OPERATIVO', value: 'OPERATIVO' },
        { label: 'OPERATIVO / PARA SU VENTA', value: 'OPERATIVO / PARA SU VENTA' },
        { label: 'OPERATIVO / RENOVACION', value: 'OPERATIVO / RENOVACION' },
        { label: 'PARA SU BAJA', value: 'PARA SU BAJA' },
        { label: 'REGULAR', value: 'REGULAR' },
        { label: 'REGULAR / RENOVACION', value: 'REGULAR / RENOVACION' },
        { label: 'RETIRADO', value: 'RETIRADO' },
    ]

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

    const peticionPost = async () => {
        delete product.id;
        await axios.post(baseUrl, product)
            .then(response => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ingreso Correcto', life: 3000 });
                setTimeout(() => {
                    window.location.reload();
                }, 200);
            }).catch(error => {
                console.log(error);
                toast.current.show({ severity: 'error', summary: 'Datos Incorrectos', detail: 'Datos Incorrectos', life: 5000 });
            })
    }

    const peticionPut = async () => {
        try {
            const response = await axios.put(baseUrl, product);
            const updatedProduct = response.data;
            const dataNueva = data.map(u => {
                if (u.id === updatedProduct.id) {
                    u.serie = updatedProduct.serie;
                    u.modelo = updatedProduct.modelo;
                    u.tipo = updatedProduct.tipo;
                    u.estado = updatedProduct.estado;
                    u.nivel = updatedProduct.nivel;
                    u.fec_fabricacion = updatedProduct.fec_fabricacion;

                    u.enlFabricante = updatedProduct.enlFabricante;
                    u.enlRecomendaciones = updatedProduct.enlRecomendaciones;
                    u.enlImagenes = updatedProduct.enlImagenes;

                    // u.codigo = updatedProduct.codigo;


                    return {
                        ...u,
                        clase_equipo: {
                            ...u.clase_equipo,
                            id: updatedProduct.clase_equipo.id,
                            nombre: updatedProduct.clase_equipo.nombre
                        },
                        marca: {
                            ...u.marca,
                            id: updatedProduct.marca.id,
                            nombre: updatedProduct.marca.nombre
                        },
                        sede: {
                            ...u.sede,
                            id: updatedProduct.sede.id,
                            nombre: updatedProduct.sede.nombre
                        },
                        ubicacion_fisica: {
                            ...u.ubicacion_fisica,
                            id: updatedProduct.ubicacion_fisica.id,
                            nombre: updatedProduct.ubicacion_fisica.nombre
                        },
                        area: {
                            ...u.area,
                            id: updatedProduct.area.id,
                            nombre: updatedProduct.area.nombre
                        },
                        servicio: {
                            ...u.servicio,
                            id: updatedProduct.servicio.id,
                            nombre: updatedProduct.servicio.nombre
                        },
                        proveedor: {
                            ...u.proveedor,
                            id: updatedProduct.proveedor.id,
                            nombre: updatedProduct.proveedor.nombre
                        },
                    };
                }
                return u;
            });
            setData(dataNueva);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Ingreso Modificado', life: 3000 });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (cookies.get('role') !== 'ADMIN') {
            navigate('/inventariou');
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

    const openNew = () => {
        setProduct(empty);
        setSubmitted(false);
        setEntidadNewDialog(true);
    }
    const hideDialogNew = () => {
        setClase_equipoId(null);
        setMarcaId(null);
        setSedeId(null);
        setUbicacionId(null);
        setAreaId(null);
        setServicioId(null);
        setProveedorId(null);

        setNivelId(null);
        setTipoId(null);
        setEstadoId(null);

        product.tipo = null;
        product.nivel = null;
        product.estado = null;
        product.clase_equipo.id = null;
        product.marca.id = null;
        product.sede.id = null;
        product.ubicacion_fisica.id = null;
        product.area.id = null;
        product.servicio.id = null;
        product.proveedor.id = null;

        setProduct(empty);


        setSubmitted(false);
        setEntidadNewDialog(false);
    }

    const hideDialogVer = () => {
        setSubmitted(false);
        setEntidadDialog(false);
    }

    const editProduct = (product) => {
        setProduct({ ...product });
        setEntidadNewDialog(true);
    }

    const showProduct = (product) => {
        setProduct({ ...product });
        setEntidadDialog(true);
    }

    const saveProduct = () => {
        setSubmitted(true);
        if (product.serie && product.clase_equipo.id) {
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
                product.nivel = null;
                product.tipo = null;
                product.estado = null;
                product.clase_equipo.id = null;
                product.marca.id = null;
                product.sede.id = null;
                product.ubicacion_fisica.id = null;
                product.area.id = null;
                product.servicio.id = null;
                product.proveedor.id = null;
            }
            setClase_equipoId(null);
            setMarcaId(null);
            setSedeId(null);
            setUbicacionId(null);
            setAreaId(null);
            setServicioId(null);
            setProveedorId(null);

            setNivelId(null);
            setTipoId(null);
            setEstadoId(null);

            setEntidadNewDialog(false);
            // setData(_products);
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



    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;
        setProduct(_product);
    }
    //dropdown
    const handleChangeClase_Equipo = (event) => {
        setClase_equipoId(event.value);
        product.clase_equipo.id = event.value;

    };

    const handleChangeMarca = (event) => {
        setMarcaId(event.value);
        product.marca.id = event.value;

    };

    const handleChangeSede = (event) => {
        setSedeId(event.value);
        product.sede.id = event.value;

    };

    const handleChangeUbicacion = (event) => {
        setUbicacionId(event.value);
        product.ubicacion_fisica.id = event.value;

    };

    const handleChangeArea = (event) => {
        setAreaId(event.value);
        product.area.id = event.value;

    };

    const handleChangeServicio = (event) => {
        setServicioId(event.value);
        product.servicio.id = event.value;

    };

    const handleChangeProveedor = (event) => {
        setProveedorId(event.value);
        product.proveedor.id = event.value;

    };

    const handleChangeNivel = (event) => {
        setNivelId(event.value);
        product.nivel = event.value;

    };

    const handleChangeTipo = (event) => {
        setTipoId(event.value);
        product.tipo = event.value;

    };

    const handleChangeEstado = (event) => {
        setEstadoId(event.value);
        product.estado = event.value;

    };

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




    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Registrar Equipo" icon="pi pi-plus-circle" className="p-button-outlined p-button-success mr-2" onClick={openNew} />
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


    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
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

    // const idBodyTemplate = (rowData) => {
    //     return (
    //         <>
    //             {rowData.codigo}
    //         </>
    //     );
    // }

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

    // const equipoBodyTemplate = (rowData) => {
    //     return (
    //         <>
    //             {rowData.marca.nombre+' '+rowData.modelo}
    //         </>
    //     );
    // }

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



    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button title="Modificar Equipo" icon="pi pi-pencil" className="p-button-rounded p-button-outlined p-button-success mr-2" onClick={() => editProduct(rowData)} />
            </div>
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

    const ImagenesBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button title="Imágenes" icon="pi pi-images" className="p-button-rounded p-button-outlined p-button-danger mr-2" onClick={() => redireccionar(rowData.enlImagenes)} />
            </div>
        );
    }


    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Configuración de Equipos</h5>
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
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
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
                        <Column body={actionBodyTemplate} style={{ minWidth: '75px' }}></Column>
                        <Column field="id" header="N°" body={idBodyTemplate} style={{ minWidth: '50px' }}></Column>
                        {/* <Column field="codigo" header="Codigo" body={idBodyTemplate} style={{ minWidth: '50px' }}></Column> */}
                        <Column field="clase_equipo.nombre" header="Dispositivo" body={clase_equipoBodyTemplate} style={{ minWidth: '200px', wordBreak: 'break-word' }}></Column>
                        <Column field="marca.nombre" header="Marca" body={marcaBodyTemplate} style={{ minWidth: '200px', wordBreak: 'break-word' }}></Column>
                        <Column field="modelo" header="Modelo" body={modeloBodyTemplate} style={{ minWidth: '200px', wordBreak: 'break-word' }}></Column>
                        <Column field="serie" header="Serie" body={serieBodyTemplate} style={{ minWidth: '200px', wordBreak: 'break-word' }}></Column>
                        <Column field="estado" header="Estado" body={estadoBodyTemplate} style={{ minWidth: '150px', wordBreak: 'break-word' }}></Column>
                        <Column field="servicio.nombre" header="Servicio" body={servicioBodyTemplate} style={{ minWidth: '200px', wordBreak: 'break-word' }}></Column>
                        <Column header="Fabricante" body={FabricanteBodyTemplate} style={{ minWidth: '80px' }}></Column>
                        <Column header="Imágenes" body={ImagenesBodyTemplate} style={{ minWidth: '75px' }}></Column>
                        <Column header="Detalles" body={DetallesBodyTemplate} style={{ minWidth: '75px' }}></Column>
                    </DataTable>
                    <Dialog visible={EntidadNewDialog} style={{ width: '1400px' }} header="Datos de Equipo" contentStyle={{ overflow: 'visible' }} modal className="p-fluid" footer={productDialogFooterNew} onHide={hideDialogNew}>
                        <div className="field col-12">

                            <div className="formgrid grid" >
                                {/* <div className="field col-12 md:col-2">
                                    <label htmlFor="codigo">Código</label>
                                    <InputText id="codigo" name="codigo" value={product.codigo} required onChange={(e) => onInputChange(e, 'codigo')} className={classNames({ 'p-invalid': submitted && !product.codigo })} />
                                </div> */}
                                <div className="field col-12 md:col-4">
                                    <label htmlFor="equipo">Dispositivo</label>
                                    <Dropdown placeholder={product.clase_equipo.nombre} id="clase_equipo" name="clase_equipo" options={optionsClase_equipo} value={clase_equipoId} onChange={handleChangeClase_Equipo} filter resetFilterOnHide appendTo={'self'} emptyFilterMessage='Sin opciones' className={classNames({ 'p-invalid': submitted && !product.clase_equipo.nombre })} />
                                    {/* {submitted && !product.categoria && <small className="p-invalid">La clase del equipo es requerida.</small>} */}
                                </div>
                                <div className="field col-12 md:col-2">
                                    <label htmlFor="marca">Marca</label>
                                    <Dropdown placeholder={product.marca.nombre} id="marca" name="marca" options={optionsMarca} value={marcaId} onChange={handleChangeMarca} filter resetFilterOnHide appendTo={'self'} emptyFilterMessage='Sin opciones' className={classNames({ 'p-invalid': submitted && !product.marca.nombre })} />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="modelo">Modelo</label>
                                    <InputText id="modelo" name="modelo" value={product.modelo} onChange={(e) => onInputChange(e, 'modelo')} />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="serie">Serie</label>
                                    <InputText id="serie" name="serie" value={product.serie} onChange={(e) => onInputChange(e, 'serie')} required className={classNames({ 'p-invalid': submitted && !product.serie })} />
                                </div>
                            </div>
                            <div className="formgrid grid" >
                                <div className="field col-12 md:col-2">
                                    <label htmlFor="tipo">Tipo</label>
                                    <Dropdown placeholder={product.tipo} id="tipo" name="tipo" options={optionsTipo} value={tipoId} onChange={handleChangeTipo} appendTo={'self'} />
                                </div>

                                <div className="field col-12 md:col-3">
                                    <label htmlFor="estado">Estado</label>
                                    <Dropdown placeholder={product.estado} id="estado" name="estado" options={optionsEstado} value={estadoId} onChange={handleChangeEstado} appendTo={'self'} />
                                </div>

                                <div className="field col-12 md:col-2">
                                    <label htmlFor="nivel">Nivel</label>
                                    <Dropdown placeholder={product.nivel} id="nivel" name="nivel" options={optionsNivel} value={nivelId} onChange={handleChangeNivel} appendTo={'self'} />
                                </div>
                                <div className="field col-12 md:col-2">
                                    <label htmlFor="fec_fabricacion">Fecha de fabricación</label>
                                    <InputText id="fec_fabricacion" name="fec_fabricacion" value={product.fec_fabricacion} onChange={(e) => onInputChange(e, 'fec_fabricacion')} />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="proveedor">Proveedor</label>
                                    <Dropdown placeholder={product.proveedor.nombre} id="proveedor" name="proveedor" options={optionsProveedor} value={proveedorId} onChange={handleChangeProveedor} filter resetFilterOnHide appendTo={'self'} emptyFilterMessage='Sin opciones' className={classNames({ 'p-invalid': submitted && !product.proveedor.nombre })} />
                                </div>
                            </div>


                            <Divider layout="horizontal" align="center">
                                <span className="p-tag">Localización</span>
                            </Divider>
                            <div className="formgrid grid" >
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="sede">Sede</label>
                                    <Dropdown placeholder={product.sede.nombre} id="sede" name="sede" options={optionsSede} value={sedeId} onChange={handleChangeSede} filter resetFilterOnHide appendTo={'self'} emptyFilterMessage='Sin opciones' className={classNames({ 'p-invalid': submitted && !product.sede.nombre })} />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="ubicacion_fisica">Ambiente</label>
                                    <Dropdown placeholder={product.ubicacion_fisica.nombre} id="ubicacion_fisica" name="ubicacion_fisica" options={optionsUbicacion} value={ubicacionId} onChange={handleChangeUbicacion} filter resetFilterOnHide appendTo={'self'} emptyFilterMessage='Sin opciones' className={classNames({ 'p-invalid': submitted && !product.ubicacion_fisica.nombre })} />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="area">UPSS</label>
                                    <Dropdown placeholder={product.area.nombre} id="area" name="area" options={optionsArea} value={areaId} onChange={handleChangeArea} filter resetFilterOnHide appendTo={'self'} emptyFilterMessage='Sin opciones' className={classNames({ 'p-invalid': submitted && !product.area.nombre })} />
                                </div>
                                <div className="field col-12 md:col-3">
                                    <label htmlFor="servicio">Servicio</label>
                                    <Dropdown placeholder={product.servicio.nombre} id="servicio" name="servicio" options={optionsServicio} value={servicioId} onChange={handleChangeServicio} filter resetFilterOnHide appendTo={'self'} emptyFilterMessage='Sin opciones' className={classNames({ 'p-invalid': submitted && !product.servicio.nombre })} />
                                </div>
                            </div>

                            <Divider layout="horizontal" align="center">
                                <span className="p-tag">Enlaces</span>
                            </Divider>
                            <div className="formgrid grid" >
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="enlFabricante">Enlace Fabricante</label>
                                    <InputText id="enlFabricante" name="enlFabricante" value={product.enlFabricante} onChange={(e) => onInputChange(e, 'enlFabricante')} />
                                </div>
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="enlImagenes">Enlace Imágenes</label>
                                    <InputText id="enlImagenes" name="enlImagenes" value={product.enlImagenes} onChange={(e) => onInputChange(e, 'enlImagenes')} />
                                </div>
                            </div>
                            <Divider layout="horizontal" align="center">
                                <span className="p-tag">Recomendaciones</span>
                            </Divider>
                            <div className="field col-12 md:col-12">
                                <InputTextarea id="enlRecomendaciones" name="enlRecomendaciones" value={product.enlRecomendaciones} onChange={(e) => onInputChange(e, 'enlRecomendaciones')} autoResize />
                            </div>
                        </div>
                    </Dialog>

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
                                <Divider layout="horizontal" align="center">
                                    <span className="p-tag">Recomendaciones</span>
                                </Divider>
                                <div className="field col-12 md:col-12">
                                    <InputTextarea id="enlRecomendaciones" name="enlRecomendaciones" disabled value={product.enlRecomendaciones} autoResize />
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
