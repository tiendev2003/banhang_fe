export interface IUser {
    _id:string;
    name:string;
    email:string;
    password:string;
    role:string;
    date:string;
    phone:string;
    photo:string;
    gender:string;
  }
  
  interface HeaderType {
    headers: {
      "Content-Type": string;
      Authorization: string;
    };
  }
  
  // children type
  
  export type childrenAndBreadCampType = {
    children: React.ReactNode;
    breadCampTitle: string;
  };
  export type childrenType = {
    children: React.ReactNode;
  };
  
  // context api data type
  
  export interface AppContextType {
    sideMenuOpen?: boolean;
    setSideMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    header?: HeaderType;
    toggleSideMenu?: () => void;
    logout?: () => void;
    scrollDirection?: string;
    setScrollDirection?: React.Dispatch<React.SetStateAction<string>> | undefined;
    showSidebar?: boolean;
    setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
    user?: IUser;
    setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
    loggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    update: boolean;
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    updateStatus: boolean;
    setUpdateStatus: React.Dispatch<React.SetStateAction<boolean>>;
    totalCancelOrder: number;
    settotalCancelOrder: React.Dispatch<React.SetStateAction<number>>;
    
   
  }
  
  // id type
  export interface idType {
    id: string;
  }
  
  // menu type
  
  interface DropdownItem {
    link: string;
    title: string;
  }
  
  export interface NavMenuItem {
    link: string;
    title: string;
    hasDropdown?: boolean;
    megamenu?: boolean;
    dropdownItems?: DropdownItem[];
  }
  
  // apext chart
  export interface ChartOptions {
    series: {
      name: string;
      data: number[];
    }[];
    chart: {
      height: number;
      width: string;
      type: "area";
    };
    dataLabels: {
      enabled: boolean;
    };
    title: {
      text: string;
      align: "left";
    };
    colors: string[];
    stroke: {
      curve: "smooth";
    };
    xaxis: {
      categories: string[];
    };
    yaxis: {
      min: number;
      max: number;
    };
    legend: {
      position: "top";
      horizontalAlign: "right";
      floating: boolean;
      offsetY: number;
      offsetX: number;
    };
  }
  
  // line bar chart
  
  export interface BarChartOption {
    series: {
      name: string;
      data: number[];
    }[];
    chart: {
      type: "bar";
      height: number;
      width: string;
    };
    title: {
      text: string;
      align: "left";
    };
    dataLabels: {
      enabled: boolean;
    };
    colors: string[];
    stroke: {
      show: boolean;
      width: number;
      colors: string[];
    };
    xaxis: {
      categories: string[];
    };
    yaxis: {
      min: number;
      max: number;
      title: {
        text: string;
      };
    };
    legend: {
      position: "top";
      horizontalAlign: "right";
      floating: boolean;
      offsetY: number;
      offsetX: number;
    };
    fill: {
      opacity: number;
    };
    tooltip: {
      y: {
        formatter: (val: any) => string;
      };
    };
  }
  
  // pie chart
  
  export interface PieChartOption {
    series: number[];
    chart: {
      width: number;
      type: "donut";
    };
    labels: string[];
    dataLabels: {
      enabled: boolean;
    };
    fill: {
      type: "gradient";
    };
    colors: string[];
    responsive: {
      breakpoint: number;
      options: {
        chart: {
          width: number | string;
          height?: number;
        };
        legend?: {
          position: "bottom";
        };
      };
    }[];
  }