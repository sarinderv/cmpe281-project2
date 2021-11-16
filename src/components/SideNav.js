import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as GiIcons from "react-icons/gi";
import * as User from './User';

const SideNav = (props) => {

    const SidebarData = function(isDoctor, isAdmin) { return [
        {
            title: 'Doctor',
            path: '/',
            icon: <AiIcons.AiFillHeart />,
            cName: 'nav-text',
            show: isAdmin || isDoctor
        },
        {
            title: 'Patient',
            path: '/patient',
            icon: <GiIcons.GiHealthNormal />,
            cName: 'nav-text',
            show: true // always show this nav item?
        },
        {
            title: 'Admin',
            path: '/admin',
            icon: <FaIcons.FaUserLock />,
            cName: 'nav-text',
            show: isAdmin
        },
        {
            title: 'Service',
            path: '/service',
            icon: <AiIcons.AiFillSetting />,
            cName: 'nav-text',
            show: isAdmin
        }
    ]};

    const [sidebar, setSidebar] = useState(false);
    const [sidebarData, setSidebarData] = useState(SidebarData());
    const showSidebar = () => setSidebar(!sidebar);

    useEffect(() => {
        fetchRoles();
    }, [sidebar]);

    async function fetchRoles() {
        const admin = await User.isAdmin();
        const doctor = await User.isDoctor();
        const updatedSideBarData = SidebarData(doctor, admin);
        console.log('updatedSideBarData', updatedSideBarData);
        setSidebarData(updatedSideBarData);
    }

    return (
        <>
            <div className='navbar'>
                <Link to='#' className='menu-bars'>
                    <FaIcons.FaBars onClick={showSidebar} />
                </Link>
                <div className='title'>Duke Patient Portal</div>
                <AmplifySignOut />
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items' onClick={showSidebar}>
                    <li className='navbar-toggle'>
                        <Link to='#' className='menu-bars'>
                            <AiIcons.AiOutlineClose />
                        </Link>
                    </li>
                    {sidebarData.map((item, index) => {
                        return ( item.show ?
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li> : ""
                        );
                    })}
                </ul>
            </nav>
        </>
    );
}

export default SideNav;