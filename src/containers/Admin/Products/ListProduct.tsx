import { Dialog, Transition } from "@headlessui/react";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import {
  deleteProduct,
  fetchProducts,
} from "../../../features/product/productSlice";
import { AppDispatch, RootState } from "../../../store";
import formatCurrencyVND from "../../../utils/formatMoney";
import PaginationItem from "../PaginationItem";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ListProduct = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, error, pagination } = useSelector(
    (state: RootState) => state.products
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [searchName, setSearchName] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(5);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, search: searchName, isActive: true ,size: pageSize}));
  }, [dispatch, pageSize]);

  const openDeleteModal = (id: number) => {
    setSelectedProductId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedProductId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (selectedProductId !== null) {
      try {
        await dispatch(deleteProduct(selectedProductId)).unwrap();
        toast.success("Xóa sản phẩm thành công!");
        closeDeleteModal();
      } catch (error : any) {
        console.error(error);
        toast.error(error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchProducts({ page, search: searchName, isActive: true,size:pageSize }));
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    dispatch(fetchProducts({ page: 1, search: searchName, isActive: true,size: newSize }));
  };

  const debouncedSearch = debounce((value: string) => {
    dispatch(fetchProducts({ page: 1, search: value, isActive: true }));
  }, 300);

  const handleSearchName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchName(value);
    debouncedSearch(value);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Danh sách sản phẩm</h1>
        <NavLink
          to="/admin/products/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Thêm sản phẩm mới
        </NavLink>
      </div>

      {/* Search by Name */}
      <div className="mb-6">
        <label
          htmlFor="nameSearch"
          className="block text-sm font-medium text-gray-700"
        >
          Tìm kiếm theo tên
        </label>
        <input
          type="text"
          id="nameSearch"
          value={searchName}
          onChange={handleSearchName}
          placeholder="Nhập tên sản phẩm..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô tả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá khuyến mãi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
             
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {error ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {error}
                </td>
              </tr>
            ) : products?.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.description.length > 25
                      ? `${product.description.substring(0, 25)}...`
                      : product.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatCurrencyVND(product.price)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatCurrencyVND(product.salePrice ?? 0)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                       className={classNames(
                        product.isActive
                          ? "status-active"
                          : "status-inactive",
                        "px-4 py-1.5 inline-flex text-sm leading-5 font-medium rounded-full"
                      )}
                    >
                      {product.isActive === true ? "Hoạt động" : "Khóa"}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <NavLink
                        to={`/admin/products/edit/${product._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Chỉnh sửa"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </NavLink>
                      <button
                        onClick={() => openDeleteModal(product._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <PaginationItem
        length={products.length}
        pagination={pagination}
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
        handlePageChange={handlePageChange}
        classNames={classNames}
      />
      {/* Delete Confirmation Modal */}
      <Transition show={isDeleteModalOpen} as="div">
        <Dialog as="div" className="relative z-10" onClose={closeDeleteModal}>
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={closeDeleteModal}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div>
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Xóa sản phẩm
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Bạn có chắc chắn muốn xóa sản phẩm này không? Hành
                          động này không thể hoàn tác.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={handleDelete}
                    >
                      Xóa
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={closeDeleteModal}
                    >
                      Hủy
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ListProduct;
