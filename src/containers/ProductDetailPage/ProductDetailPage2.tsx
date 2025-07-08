import { Transition } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/24/solid";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import NcInputNumber from "../../components/NcInputNumber";
import Prices from "../../components/Prices";
import ReviewItem from "../../components/ReviewItem";
import { addCartItem } from "../../features/cart/cartSlice";
import { fetchProductDetail } from "../../features/product/productSlice";
import ButtonPrimary from "../../shared/Button/ButtonPrimary";
import ButtonSecondary from "../../shared/Button/ButtonSecondary";
import NcImage from "../../shared/NcImage/NcImage";
import { AppDispatch, RootState } from "../../store";
import formatCurrencyVND from "../../utils/formatMoney";
import AccordionInfo from "./AccordionInfo";
import ModalPhotos from "./ModalPhotos";
import ModalViewAllReviews from "./ModalViewAllReviews";

export interface ProductDetailPage2Props {
  className?: string;
}
const PRODUCT_COLORS = [
  { id: "red", name: "Đỏ", hex: "#FF0000" },
  { id: "green", name: "Xanh lá", hex: "#00FF00" },
  { id: "blue", name: "Xanh dương", hex: "#0000FF" },
  { id: "black", name: "Đen", hex: "#000000" },
  { id: "white", name: "Trắng", hex: "#FFFFFF" },
  { id: "pink", name: "Hồng", hex: "#FFC0CB" },
  { id: "yellow", name: "Vàng", hex: "#FFFF00" },
  { id: "orange", name: "Cam", hex: "#FFA500" },
  { id: "purple", name: "Tím", hex: "#800080" },
  { id: "gray", name: "Xám", hex: "#808080" },
];

const PRODUCT_SIZES = [
  { id: "XS", name: "XS" },
  { id: "S", name: "S" },
  { id: "M", name: "M" },
  { id: "L", name: "L" },
  { id: "XL", name: "XL" },
  { id: "XXL", name: "XXL" },
];

const ProductDetailPage2: FC<ProductDetailPage2Props> = ({
  className = "",
}) => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetail(id));
    }
  }, [dispatch, id]);

  const [qualitySelected, setQualitySelected] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] =
    useState(false);
  const [openFocusIndex, setOpenFocusIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleOpenModal = (index: number) => {
    setIsOpen(true);
    setOpenFocusIndex(index);
  };
  const handleCloseModal = () => setIsOpen(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No product found</div>;
  }

  const handleAddToCart = async () => {
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

      await dispatch(
        addCartItem({
          productId: product._id,
          quantity: qualitySelected,
          selectedSize: selectedSize || undefined,
          selectedColor: selectedColor || undefined
        })
      ).unwrap();

      toast.custom(
        (t) => (
          <Transition
            appear
            show={t.visible}
            className="p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200"
            enter="transition-all duration-150"
            enterFrom="opacity-0 translate-x-20"
            enterTo="opacity-100 translate-x-0"
            leave="transition-all duration-150"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 translate-x-20"
          >
            <p className="block text-base font-semibold leading-none">
              Thêm giỏ hàng thành công
            </p>
            <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
            {renderProductCartOnNotify()}
          </Transition>
        ),
        { position: "top-right", id: "nc-product-notify", duration: 3000 }
      );
    } catch (error: any) {
      toast.error(error as string);
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size === selectedSize ? null : size);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color === selectedColor ? null : color);
  };

  const renderProductCartOnNotify = () => {
    return (
      <div className="flex">
        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={product?.productImages[0] || "/default-image.jpg"}
            alt={product?.name || "Product Image"}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between">
              <div>
                <h3 className="text-base font-medium">
                  {product?.name || "Product Name"}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>
                    {product?.brand?.name || "Brand"} -{" "}
                    {product?.category?.name || "Category"}
                  </span>
                  {selectedSize && (
                    <span className="ml-2">
                      Size: {selectedSize}
                    </span>
                  )}
                  {selectedColor && (
                    <span className="ml-2">
                      Color: {PRODUCT_COLORS.find(c => c.id === selectedColor)?.name || selectedColor}
                    </span>
                  )}
                </p>
              </div>
              <Prices
                price={(product?.salePrice || product?.price) * qualitySelected}
                className="mt-0.5"
              />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400">
              SL: {qualitySelected}
            </p>

            <div className="flex">
              <Link
                to={"/cart"}
                className="font-medium text-primary-6000 dark:text-primary-500"
              >
                Xem giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVariantOptions = () => {
    return (
      <div className="space-y-6">
        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <div className="flex justify-between font-medium text-sm">
              <label htmlFor="size-select">
                <span className="text-slate-900 dark:text-slate-200">Size:</span>
                <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedSize || "Vui lòng chọn"}
                </span>
              </label>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2.5">
              {product.sizes.map((sizeId) => {
                const sizeObject = PRODUCT_SIZES.find(s => s.id === sizeId);
                return (
                  <div
                    key={sizeId}
                    className={`relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center 
                      cursor-pointer select-none uppercase font-semibold tracking-wider text-sm sm:text-base
                      ${selectedSize === sizeId
                        ? 'border-slate-900 dark:border-slate-200 bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900'
                        : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 hover:border-slate-800 dark:hover:border-slate-400'
                      }`}
                    onClick={() => handleSizeSelect(sizeId)}
                  >
                    {sizeObject?.name || sizeId}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div>
            <div className="flex justify-between font-medium text-sm">
              <label htmlFor="color-select">
                <span className="text-slate-900 dark:text-slate-200">Màu sắc:</span>
                <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedColor ?
                    PRODUCT_COLORS.find(c => c.id === selectedColor)?.name || selectedColor
                    : "Vui lòng chọn"}
                </span>
              </label>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-3">
              {product.colors.map((colorId) => {
                const colorObject = PRODUCT_COLORS.find(c => c.id === colorId);
                return (
                  <div
                    key={colorId}
                    className={`relative h-12 rounded-2xl border flex items-center justify-center 
                      cursor-pointer select-none transition-all px-3
                      ${selectedColor === colorId
                        ? 'border-slate-900 dark:border-slate-200 bg-slate-100 dark:bg-slate-800 scale-105'
                        : 'border-slate-300 dark:border-slate-700 hover:border-slate-800 dark:hover:border-slate-400'
                      }`}
                    onClick={() => handleColorSelect(colorId)}
                  >
                    <span
                      className="w-6 h-6 rounded-full   border border-slate-300 dark:border-slate-700"
                      style={{ backgroundColor: colorObject?.hex || colorId }}
                    />

                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSectionSidebar = () => {
    const reviewsCount = product?.reviews?.length || 0;
    const averageRating =
      reviewsCount > 0
        ? product.reviews.reduce((acc, review) => acc + review.star, 0) /
        reviewsCount
        : 0;

    return (
      <div className="listingSectionSidebar__wrap lg:shadow-lg">
        <div className="space-y-7 lg:space-y-8">
          <div className="flex items-center justify-between space-x-5">
            <div className="flex text-2xl font-semibold">
              {formatCurrencyVND(product.salePrice || product.price)}
            </div>
            <a
              href="#reviews"
              className="flex items-center text-sm font-medium"
            >
              <StarIcon className="w-5 h-5 pb-[1px] text-orange-400" />
              <span className="ml-1.5 flex">
                <span>{averageRating.toFixed(1)}</span>

                <span className="mx-1.5">·</span>
                <span className="text-slate-700 dark:text-slate-400 underline">{`${product?.reviews?.length || 0
                  } đánh giá`}</span>
              </span>
            </a>
          </div>

          {/* Product Attributes Section */}
          <div className="border-t border-b border-slate-200 dark:border-slate-700 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.material && (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Material:</span>
                  <span className="ml-2 font-medium">{product.material}</span>
                </div>
              )}
              {product.gender && (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Gender:</span>
                  <span className="ml-2 font-medium">{product.gender}</span>
                </div>
              )}
              {product.style && (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Style:</span>
                  <span className="ml-2 font-medium">{product.style}</span>
                </div>
              )}
              {product.season && (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Season:</span>
                  <span className="ml-2 font-medium">{product.season}</span>
                </div>
              )}
              {product.stock !== undefined && (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Available:</span>
                  <span className={`ml-2 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Variant Selection */}
          {((product.sizes && product.sizes.length > 0) || (product.colors && product.colors.length > 0)) && (
            <div className="border-b border-slate-200 dark:border-slate-700 pb-5">
              {renderVariantOptions()}
            </div>
          )}

          <div className="flex space-x-3.5">
            <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
              <NcInputNumber
                defaultValue={qualitySelected}
                onChange={setQualitySelected}
              />
            </div>
            <ButtonPrimary
              className="flex-1 flex-shrink-0"
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <span className="ml-3">{product.stock > 0 ? 'Add to cart' : 'Out of stock'}</span>
            </ButtonPrimary>
          </div>
          <div className="hidden sm:flex flex-col space-y-4">
            <div className="space-y-2.5">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="flex">
                  <span>{`${formatCurrencyVND(
                    product.salePrice || product.price
                  )}`}</span>
                  <span className="mx-2">x</span>
                  <span>{`${qualitySelected} `}</span>
                </span>
                <span>{`${formatCurrencyVND(
                  (product.salePrice || product.price) * qualitySelected
                )}`}</span>
              </div>
            </div>
            <div className="border-b border-slate-200 dark:border-slate-700"></div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{`${formatCurrencyVND(
                (product.salePrice || product.price) * qualitySelected
              )}`}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSection1 = () => {
    const reviewsCount = product?.reviews?.length || 0;
    const averageRating =
      reviewsCount > 0
        ? product.reviews.reduce((acc, review) => acc + review.star, 0) /
        reviewsCount
        : 0;
    return (
      <div className="listingSection__wrap !space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold">{product.name}</h2>
          <div className="flex items-center mt-4 sm:mt-5">
            <a
              href="#reviews"
              className="hidden sm:flex items-center text-sm font-medium"
            >
              <StarIcon className="w-5 h-5 pb-[1px] text-slate-800 dark:text-slate-200" />
              <span className="ml-1.5">
                <span>{averageRating.toFixed(1)}</span>

                <span className="mx-1.5">·</span>
                <span className="text-slate-700 dark:text-slate-400 underline">
                  {`${product?.reviews?.length || 0} đánh giá`}
                </span>
              </span>
            </a>
            <span className="hidden sm:block mx-2.5">·</span>
            {product.brand && (
              <span className="text-slate-700 dark:text-slate-400">
                Thương hiệu: <span className="font-medium">{product.brand.name}</span>
              </span>
            )}
          </div>
        </div>
        <div className="block lg:hidden">{renderSectionSidebar()}</div>
        <AccordionInfo
          data={[
            {
              name: "Mô tả",
              content: product?.description,
            },
            {
              name: "Chất liệu",
              content: product?.material??"",
            },
            {
              name: "Thông tin bổ sung",
              content: `
                ${product.material ? `Chất liệu:${product.material}` : ''}
                ${product.gender ? `Giới tính:${product.gender}</p>` : ''}
                ${product.style ? `<p><strong>Phong cách:</strong> ${product.style}</p>` : ''}
                ${product.season ? `<p><strong>Mùa:</strong> ${product.season}</p>` : ''}
                ${product.sizes?.length ? `<p><strong>Kích thước có sẵn:</strong> ${product.sizes.map(sizeId => {
                const size = PRODUCT_SIZES.find(s => s.id === sizeId);
                return size?.name || sizeId;
              }).join(', ')}</p>` : ''}
                ${product.colors?.length ? `<p><strong>Màu sắc có sẵn:</strong> ${product.colors.map(colorId => {
                const color = PRODUCT_COLORS.find(c => c.id === colorId);
                return color?.name || colorId;
              }).join(', ')}</p>` : ''}
              `,
            },
          ]}
        />
      </div>
    );
  };

  const renderReviews = () => {
    return (
      <div id="reviews" className="scroll-mt-[150px]">
        <h2 className="text-2xl font-semibold flex items-center">
          <StarIcon className="w-7 h-7 mb-0.5" />
          <span className="ml-1.5">
            {" "}
            {`${product?.reviews?.length ?? 0} đánh giá`}
          </span>
        </h2>
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-28">
            {product.reviews.map((review, index) => (
              <ReviewItem key={index} data={review} />
            ))}
          </div>
          <ButtonSecondary
            onClick={() => setIsOpenModalViewAllReviews(true)}
            className="mt-10 border border-slate-300 dark:border-slate-700"
          >
            Xem tất cả {product?.reviews?.length ?? 0} reviews
          </ButtonSecondary>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`ListingDetailPage nc-ProductDetailPage2 ${className}`}
      data-nc-id="ProductDetailPage2"
    >
      <header className="container mt-8 sm:mt-10">
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-6">
            <div
              className="col-span-2 md:col-span-1 row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
              onClick={() => handleOpenModal(0)}
            >
              <img
                className="object-cover w-full h-full rounded-md sm:rounded-xl"
                src={product?.productImages[0]}
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-40 transition-opacity"></div>
            </div>
            {product?.productImages[1] && (
              <div
                className="col-span-1 row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
                onClick={() => handleOpenModal(1)}
              >
                <img
                  className="object-container w-full h-fulll rounded-md sm:rounded-xl"
                  src={product?.productImages[1]}
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-40 transition-opacity"></div>
              </div>
            )}

            {product?.productImages?.slice(2).map((item, index) => (
              <div
                key={index}
                className={`relative rounded-md sm:rounded-xl overflow-hidden ${index >= 2 ? "block" : ""
                  }`}
              >
                <NcImage
                  containerClassName="aspect-w-6 aspect-h-5 lg:aspect-h-4"
                  className="object-cover w-full h-full rounded-md sm:rounded-xl"
                  src={item}
                />
                <div
                  className="absolute inset-0 bg-slate-900 bg-opacity-20 opacity-0 hover:opacity-60 transition-opacity cursor-pointer"
                  onClick={() => handleOpenModal(index + 2)}
                />
              </div>
            ))}
          </div>
          <div
            className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-white text-slate-500 cursor-pointer hover:bg-slate-200 z-10"
            onClick={() => handleOpenModal(0)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span className="ml-2 text-neutral-800 text-sm font-medium">
              Show all photos
            </span>
          </div>
        </div>
      </header>
      <ModalPhotos
        imgs={product?.productImages?.map((img) => img)}
        isOpen={isOpen}
        onClose={handleCloseModal}
        initFocus={openFocusIndex}
        uniqueClassName="nc-ProductDetailPage2__modalPhotos"
      />
      <main className="container relative z-10 mt-9 sm:mt-11 flex">
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-10 lg:pr-14 lg:space-y-14">
          {renderSection1()}
        </div>
        <div className="flex-grow">
          <div className="hidden lg:block sticky top-28">
            {renderSectionSidebar()}
          </div>
        </div>
      </main>
      <div className="container pb-24 lg:pb-28 pt-14 space-y-14">
        <hr className="border-slate-200 dark:border-slate-700" />
        {renderReviews()}
        <hr className="border-slate-200 dark:border-slate-700" />
      </div>
      <ModalViewAllReviews
        show={isOpenModalViewAllReviews}
        onCloseModalViewAllReviews={() => setIsOpenModalViewAllReviews(false)}
        review={product.reviews}
      />
    </div>
  );
};

export default ProductDetailPage2;
