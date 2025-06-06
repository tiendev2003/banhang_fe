import { StarIcon } from "@heroicons/react/24/solid";
import { FC } from "react";
import { Link } from "react-router";
import { productImgs } from "../contains/fakeData";
import NcImage from "../shared/NcImage/NcImage";
import Prices from "./Prices";

export interface CollectionCard2Props {
  className?: string;
  imgs?: string[];
  name?: string;
  price?: number;
  description?: string;
}

const CollectionCard2: FC<CollectionCard2Props> = ({
  className,
  imgs = [productImgs[9], productImgs[10], productImgs[11], productImgs[8]],
  name = "Product Name",
  description = "Product Description",
  price,
}) => {
  return (
    <div className={`CollectionCard2 group relative ${className}`}>
      <div className="relative flex flex-col">
        <NcImage
          containerClassName="aspect-w-8 aspect-h-5 bg-neutral-100 rounded-2xl overflow-hidden"
          className="object-contain w-full h-full rounded-2xl"
          src={imgs[0]}
        />
        <div className="grid grid-cols-3 gap-2.5 mt-2.5">
          <NcImage
            containerClassName="w-full h-24 sm:h-28"
            className="object-cover w-full h-full rounded-2xl"
            src={imgs[1]}
          />
          <NcImage
            containerClassName="w-full h-24 sm:h-28"
            className="object-cover w-full h-full rounded-2xl"
            src={imgs[2]}
          />
          <NcImage
            containerClassName="w-full h-24 sm:h-28"
            className="object-cover w-full h-full rounded-2xl"
            src={imgs[3]}
          />
        </div>
      </div>

      <div className="relative mt-5 flex justify-between">
        {/* TITLE */}
        <div className="flex-1">
          <h2 className="font-semibold text-lg sm:text-xl ">{name}</h2>
          {/* AUTHOR */}
          <div className="mt-3 flex items-center text-slate-500 dark:text-slate-400">
            <span className="text-sm ">
              <span className="line-clamp-1">{description}</span>
            </span>
            <span className="h-5 mx-1 sm:mx-2 border-l border-slate-200 dark:border-slate-700"></span>
            <StarIcon className="w-4 h-4 text-orange-400" />
            <span className="text-sm ml-1 ">
              <span className="line-clamp-1">4.9 (269 reviews)</span>
            </span>
          </div>
        </div>
        <Prices className="mt-0.5 sm:mt-1 ml-4" price={price} />
      </div>
      <Link to={"/product-detail-2"} className="absolute inset-0 "></Link>
    </div>
  );
};

export default CollectionCard2;
