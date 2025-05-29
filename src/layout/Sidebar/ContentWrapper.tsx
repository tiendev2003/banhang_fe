"use client"
import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../../context/AuthContext';
import { childrenAndBreadCampType } from '../../types/interFace';
import BreadCamp from '../Header/BreadCamp';
import FooterAdmin from '../Header/Footer';
import HeaderAdmin from '../Header/Header';
 
const ContentWrapper = ({ children,breadCampTitle }: childrenAndBreadCampType) => {
    const { sideMenuOpen } = useContext<AuthContextType>(AuthContext as any);
    return (
        <>
            <div className={`${sideMenuOpen ? "cashier-dashboard-main sidebar-enable": "cashier-dashboard-main"}`}>
              <HeaderAdmin breadCampTitle={breadCampTitle}/>
              <BreadCamp breadCampTitle={breadCampTitle}/>
              {children}
              <FooterAdmin/>
              
            </div>
        </>
    );
};

export default ContentWrapper;