import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Cookies from 'universal-cookie';
import classNames from 'classnames';
import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';

import { AppFooter } from '../AppFooter';
import { AppTopbar } from '../AppTopbar';
import { AppMenu } from '../AppMenu';

const Menu = () => {
    const cookies = new Cookies();
    let navigate = useNavigate();
    let menuClick = false;
    let mobileTopbarMenuClick = false;
    PrimeReact.ripple = true;
    const toast = useRef(null);
    const copyTooltipRef = useRef();


    const usr = [{ //Solo lectura
        label: 'Usuario',
        items: [
            // { label: 'Inicio', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Perfil', icon: 'pi pi-fw pi-id-card', to: 'perfil' },
            // { label: 'Usuarios', icon: 'pi pi-fw pi-user-edit', to: 'usuario' },
            { label: 'Inventario', icon: 'pi pi-fw pi-database', to: 'inventariou' },
            { label: 'Eventos', icon: 'pi pi-fw pi-folder-open', to: 'eventou' },
            { label: 'Mantenimientos', icon: 'pi pi-fw pi-calendar', to: 'mantenimientou' },
            // {
            //     label: 'Características', icon: 'pi pi-box',
            //     items: [
            //         { label: 'Equipos', icon: 'pi pi-fw pi-cog', to: 'clase' },
            //         { label: 'Marcas', icon: 'pi pi-fw pi-briefcase', to: 'marca' },
            //         { label: 'Proveedores', icon: 'pi pi-fw pi-users', to: 'proveedor' },
            //         { label: 'Sedes', icon: 'pi pi-fw pi-building', to: 'sede' },
            //         { label: 'Ubicaciones', icon: 'pi pi-fw pi-building', to: 'ubicacion_fisica' },
            //         { label: 'Areas', icon: 'pi pi-fw pi-building', to: 'area' },
            //         { label: 'Servicios', icon: 'pi pi-fw pi-building', to: 'servicio' },
            //     ]
            // },
        ]
    },]



    const ing = [{ //Colocar eventos y mantenimientos, Solo ver el resto
        label: 'Ingeniero',

        items: [
            // { label: 'Inicio', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Perfil', icon: 'pi pi-fw pi-id-card', to: 'perfil' },
            // { label: 'Usuarios', icon: 'pi pi-fw pi-user-edit', to: 'usuario' },
            { label: 'Inventario', icon: 'pi pi-fw pi-database', to: 'inventariou' },
            { label: 'Eventos', icon: 'pi pi-fw pi-folder-open', to: 'evento' },
            { label: 'Mantenimientos', icon: 'pi pi-fw pi-calendar', to: 'mantenimiento' },
            {
                label: 'Características', icon: 'pi pi-box',
                items: [
                    { label: 'Equipos', icon: 'pi pi-fw pi-cog', to: 'clase' },
                    { label: 'Marcas', icon: 'pi pi-fw pi-briefcase', to: 'marca' },
                    { label: 'Proveedores', icon: 'pi pi-fw pi-users', to: 'proveedor' },
                    { label: 'Sedes', icon: 'pi pi-fw pi-building', to: 'sede' },
                    { label: 'Ubicaciones', icon: 'pi pi-fw pi-building', to: 'ubicacion_fisica' },
                    { label: 'Areas', icon: 'pi pi-fw pi-building', to: 'area' },
                    { label: 'Servicios', icon: 'pi pi-fw pi-building', to: 'servicio' },
                ]
            },
        ]
    },]

    const adm = [{ //Acceso a todo
        label: 'Administrador',

        items: [
            // { label: 'Inicio', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Perfil', icon: 'pi pi-fw pi-id-card', to: 'perfil' },
            { label: 'Usuarios', icon: 'pi pi-fw pi-user-edit', to: 'usuario' },
            { label: 'Inventario', icon: 'pi pi-fw pi-database', to: 'inventario' },
            { label: 'Eventos', icon: 'pi pi-fw pi-folder-open', to: 'evento' },
            { label: 'Mantenimientos', icon: 'pi pi-fw pi-calendar', to: 'mantenimiento' },
            {
                label: 'Características', icon: 'pi pi-box',
                items: [
                    { label: 'Equipos', icon: 'pi pi-fw pi-cog', to: 'clase' },
                    { label: 'Marcas', icon: 'pi pi-fw pi-briefcase', to: 'marca' },
                    { label: 'Proveedores', icon: 'pi pi-fw pi-users', to: 'proveedor' },
                    { label: 'Sedes', icon: 'pi pi-fw pi-building', to: 'sede' },
                    { label: 'Ubicaciones', icon: 'pi pi-fw pi-building', to: 'ubicacion_fisica' },
                    { label: 'Areas', icon: 'pi pi-fw pi-building', to: 'area' },
                    { label: 'Servicios', icon: 'pi pi-fw pi-building', to: 'servicio' },
                ]
            },
        ]

    },]


    function Acceder() {
        if (cookies.get('role') === 'ADMIN') {
            return adm;
        } else if (cookies.get('role') === 'USER') {
            return usr;
        } else if (cookies.get('role') === 'ING') {
            return ing;
        } else {
            return null;
        }
    }

    const stylespj = {
        body: {
            height: '100%',
            width: '100%',
            background: '#ae092d',
            backgroundImage: "url(/logos/background.jpg)",
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        }
    }



    function Estilos() {
        return stylespj;
    }

    function Imagen() {
        return '/logos/cmch2.jpg';
    }


    const menu = Acceder();
    const styles = Estilos();

    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light');
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);


    useEffect(() => {
        if (!cookies.get('id')) {
            navigate('/login');
        }
        document.documentElement.style.fontSize = 13 + 'px';
    }, [cookies, navigate]);


    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;
        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

    return (
        <div className={wrapperClass} onClick={onWrapperClick} style={styles.body} >
            <Toast ref={toast} />
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />
            <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />

            <div className="layout-sidebar" onClick={onSidebarClick} >
                <div align="center"><img src={Imagen()} alt="hyper" height={75} className="mb-4" /></div>
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
            </div>

            <div className="layout-main-container">
                <div className="container">
                    <Outlet />
                </div>
                <AppFooter />
            </div>
        </div>
    );
}

export default Menu;