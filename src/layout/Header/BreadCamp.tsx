
interface breadCampTitleType {
  breadCampTitle:string;
}

const BreadCamp = ({breadCampTitle}:breadCampTitleType) => {
  return (
    <>
      <div className="cashier-breadcrumb-area px-7 py-9 bg-white mb-5 hidden">
        <div className="cashier-breadcrumb-area-inner px-0.5">
          <h5 className="text-[20px] text-heading font-bold mb-3 leading-none">
          {breadCampTitle}
          </h5>
          <span className="text-[14px] text-bodyText font-normal leading-none">
            {breadCampTitle}
          </span>
        </div>
      </div>
    </>
  );
};

export default BreadCamp;