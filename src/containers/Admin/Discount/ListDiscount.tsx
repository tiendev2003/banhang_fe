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
  deleteDiscount,
  fetchDiscounts,
} from "../../../features/discount/discountSlice";
import { AppDispatch, RootState } from "../../../store";
import PaginationItem from "../PaginationItem";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ListDiscount = () => {
  const dispatch: AppDispatch = useDispatch();
  const { discounts, error, pagination } = useSelector(
    (state: RootState) => state.discounts
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDiscountId, setSelectedDiscountId] = useState<number | null>(
    null
  );
  const [searchName, setSearchName] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    dispatch(fetchDiscounts({ page: 1, search: searchName, size: pageSize }));
  }, [dispatch, pageSize]);

  const openDeleteModal = (id: number) => {
    setSelectedDiscountId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedDiscountId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (selectedDiscountId !== null) {
      try {
        await dispatch(deleteDiscount(selectedDiscountId)).unwrap();
        toast.success("Xóa giảm giá thành công!");
        closeDeleteModal();
        dispatch(
          fetchDiscounts({ page: 1, search: searchName, size: pageSize })
        ); // Cập nhật lại danh sách với pageSize hiện tại
      } catch (error:any) {
         
        toast.error(error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchDiscounts({ page, search: searchName, size: pageSize })); // Thêm size vào đây
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    dispatch(fetchDiscounts({ page: 1, search: searchName, size: newSize })); // Gọi ngay với size mới
  };

  const debouncedSearch = debounce((value: string) => {
    dispatch(fetchDiscounts({ page: 1, search: value, size: pageSize })); // Thêm size vào đây
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
        <h1 className="text-2xl font-bold text-gray-900">Danh sách giảm giá</h1>
        <NavLink
          to="/admin/discounts/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Thêm giảm giá mới
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
          placeholder="Nhập tên giảm giá..."
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
                Mã giảm giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại giảm giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá trị giảm giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá trị đơn hàng tối thiểu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số tiền giảm giá tối đa
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
                  colSpan={8}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {error}
                </td>
              </tr>
            ) : discounts.length > 0 ? (
              discounts.map((discount) => (
                <tr key={discount._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discount._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {discount.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {discount.discountCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {discount.discountType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {discount.discountValue}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {discount.minOrderValue}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {discount.maxDiscountAmount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {" "}
                    <span
                      className={classNames(
                        discount.active
                          ? "status-active"
                          : "status-inactive",
                        "px-4 py-1.5 inline-flex text-sm leading-5 font-medium rounded-full"
                      )}
                    >
                      {discount.active === true ? "Hiển thị" : "Ẩn"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <NavLink
                        to={`/admin/discounts/edit/${discount._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Chỉnh sửa"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </NavLink>
                      <button
                        onClick={() =>
                          discount._id && openDeleteModal(discount!._id)
                        }
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
                  colSpan={8}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Không tìm thấy giảm giá nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <PaginationItem
        length={discounts.length}
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
                        Xóa giảm giá
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Bạn có chắc chắn muốn xóa giảm giá này không? Hành
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

export default ListDiscount;