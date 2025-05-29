import React, { FC } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router";
import BagIcon from "../components/BagIcon";
import NcInputNumber from "../components/NcInputNumber";
import Prices from "../components/Prices";
import AccordionInfo from "../containers/ProductDetailPage/AccordionInfo";
import { addCartItem } from "../features/cart/cartSlice";
import ButtonPrimary from "../shared/Button/ButtonPrimary";
import { AppDispatch } from "../store";
import { Product } from "../types";

export interface ProductQuickViewProps {
  className?: string;
  product: Product;
}

const ProductQuickView: FC<ProductQuickViewProps> = ({ className = "", product }) => {
  const LIST_IMAGES_DEMO = product?.productImages?.map(img => img); // Giả định ProductImage có trường url
  const dispatch: AppDispatch = useDispatch();

  const [qualitySelected, setQualitySelected] = React.useState(1);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size === selectedSize ? null : size);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color === selectedColor ? null : color);
  };

  const notifyAddTocart = async () => {
    try {
      // Check if size and color are selected when available
      if (product.sizes?.length && !selectedSize) {
        toast.error("Vui lòng chọn kích thước");
        return;
      }

      if (product.colors?.length && !selectedColor) {
        toast.error("Vui lòng chọn màu sắc");
        return;
      }

      await dispatch(addCartItem(
        {
          productId: product._id,
          quantity: qualitySelected,
          selectedSize: selectedSize || undefined,
          selectedColor: selectedColor || undefined
        }
      )).unwrap();
      toast.success("Add to cart success");
    } catch (error) {
      console.error("Error notifyAddTocart", error);
    }
  };

  const renderStatus = () => {
    if (!product?.status) {
      return null;
    }
    const CLASSES =
      "absolute top-3 left-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-700 text-slate-900 dark:text-slate-300";
    return (
      <div className={CLASSES}>
        <span className="ml-1 leading-none">{product.status.toUpperCase()}</span>
      </div>
    );
  };

  const renderSectionContent = () => {
    return (
      <div className="space-y-8">
        {/* ---------- 1 HEADING ---------- */}
        <div>
          <h2 className="text-2xl font-semibold hover:text-primary-6000 transition-colors">
            <Link to={`/cua-hang/${product._id}`}>{product?.name}</Link>
          </h2>

          <div className="flex items-center mt-5 space-x-4 sm:space-x-5">
            <Prices
              contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold"
              price={product?.sale && product?.salePrice ? product?.salePrice : product?.price}
            />
          </div>
        </div>

        {/* ---------- 2 DESCRIPTION AND STOCK ---------- */}
        <div>
          <p className="text-slate-600 dark:text-slate-300">{product?.description}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Stock: <span className="font-semibold">{product?.stock}</span>
          </p>
        </div>

        {/* Size selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-4">
            <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Size:</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    selectedSize === size
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
                      : 'border-slate-300 dark:border-slate-700 hover:border-slate-900 dark:hover:border-slate-300'
                  }`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color selector */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-4">
            <label className="text-sm font-medium text-slate-900 dark:text-slate-200">Màu sắc:</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    selectedColor === color
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
                      : 'border-slate-300 dark:border-slate-700 hover:border-slate-900 dark:hover:border-slate-300'
                  }`}
                  onClick={() => handleColorSelect(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---------- 3 QTY AND ADD TO CART BUTTON ---------- */}
        <div className="flex space-x-3.5 mt-4">
          <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
            <NcInputNumber
              defaultValue={qualitySelected}
              onChange={setQualitySelected}
              max={product.stock} // Giới hạn số lượng dựa trên stock
            />
          </div>
          <ButtonPrimary
            className="flex-1 flex-shrink-0"
            onClick={notifyAddTocart}
            disabled={product.stock === 0} // Vô hiệu hóa nếu hết hàng
          >
            <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
            <span className="ml-3">Add to cart</span>
          </ButtonPrimary>
        </div>

        {/* ---------- 4 ACCORDION INFO ---------- */}
        <hr className="border-slate-200 dark:border-slate-700" />
        <AccordionInfo
          data={[
            {
              name: "Description",
              content: product?.description,
            },
            {
              name: "Ingredients",
              content: product?.ingredients,
            },
            {
              name: "Usage",
              content: product?.productUsage,
            },
          ]}
        />
      </div>
    );
  };

  return (
    <div className={`nc-ProductQuickView ${className}`}>
      {/* MAIN */}
      <div className="lg:flex">
        {/* CONTENT */}
        <div className="w-full lg:w-[50%]">
          {/* HEADING */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-16">
              <img
                src={LIST_IMAGES_DEMO[0] || "default-image.jpg"} // Hình ảnh mặc định nếu không có
                className="w-full rounded-xl object-cover"
                alt={product.name}
                crossOrigin="anonymous"
              />
            </div>
            {/* STATUS */}
            {renderStatus()}
            {/* META FAVORITES */}
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-3 mt-3 sm:gap-6 sm:mt-6 xl:gap-5 xl:mt-5">
            {LIST_IMAGES_DEMO.slice(1, 3).map((item, index) => (
              <div key={index} className="aspect-w-3 aspect-h-4">
                <img
                  src={item || "default-image.jpg"}
                  className="w-full rounded-xl object-cover"
                  alt={`${product.name} detail ${index + 1}`}
                  aspect-w-16 aspect-h-16
                />
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-full lg:w-[50%] pt-6 lg:pt-0 lg:pl-7 xl:pl-8">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;