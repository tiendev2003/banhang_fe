 
const Preloader = () => {
   return (
      <>
         <div id="loading">
            <div id="loading-center">
               <div id="loading-center-absolute">
                  <div className="loading-icon text-center flex flex-col items-center justify-center">
                     <img style={{ width: '100px', height: 'auto' }} src={"/logo.png"} alt="logo" />
                     <div>
                        <div className="preloader">
                           <span></span>
                           <span></span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Preloader;