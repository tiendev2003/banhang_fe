import { Dialog, Transition } from '@headlessui/react';
import { PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { deleteOrder, fetchOrders, updateOrderStatus } from '../../../features/order/orderSlice';
import { AppDispatch, RootState } from '../../../store';
import { OrderStatus } from '../../../types/order.types';
import formatDate from '../../../utils/formatDate';
import formatCurrencyVND from '../../../utils/formatMoney';
import PaginationItem from '../PaginationItem';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const ListOrder = () => {
  const dispatch: AppDispatch = useDispatch();
  const { orders, error, pagination } = useSelector((state: RootState) => state.orders);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [searchOrderId, setSearchOrderId] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(5);



  const debouncedSearch = useCallback(
    debounce((value: string) => {
      dispatch(fetchOrders({ page: 1, search: value, size: pageSize }));
    }, 500),
    [dispatch, pageSize] // Dependencies của useCallback
  );

  // Xử lý khi người dùng nhập vào ô tìm kiếm
  const handleSearchOrderId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchOrderId(value);
    debouncedSearch(value);
  };

  // Hủy debounce khi component unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);


  useEffect(() => {
    dispatch(fetchOrders({ page: 1, search: searchOrderId, size: pageSize }));
  }, [dispatch, pageSize]);

  const openDeleteModal = (id: number) => {
    setSelectedOrderId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedOrderId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (selectedOrderId !== null) {
      try {
        await dispatch(deleteOrder(selectedOrderId)).unwrap();
        toast.success('Xóa đơn hàng thành công!');
        closeDeleteModal();
      } catch (error) {
        console.error(error);
        toast.error('Xóa đơn hàng thất bại!');
      }
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchOrders({ page, search: searchOrderId, size: pageSize }));
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    dispatch(fetchOrders({ page: 1, search: searchOrderId, size: newSize }));
  };


  const handleStatusChange = async (id: number, newStatus: OrderStatus) => {
    try {
      await dispatch(updateOrderStatus({ id, status: newStatus })).unwrap();
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
    } catch (error) {
      console.error(error);
      toast.error('Cập nhật trạng thái đơn hàng thất bại!');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Danh Sách Đơn Hàng</h1>

      </div>

      {/* Search by Order ID */}
      <div className="mb-6">
        <label htmlFor="orderIdSearch" className="block text-sm font-medium text-gray-700">
          Tìm kiếm theo Mã Đơn Hàng
        </label>
        <input
          type="text"
          id="orderIdSearch"
          value={searchOrderId}
          onChange={handleSearchOrderId}
          placeholder="Nhập mã đơn hàng..."
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
                Mã Đơn Hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người Dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng Số Tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày Đặt Hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng Thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {error ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  {error}
                </td>
              </tr>
            ) : orders?.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrencyVND(order.finalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                      className="rounded-md border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {Object.values(OrderStatus).map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">

                      <NavLink
                        to={`/admin/orders/edit/${order._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Chỉnh Sửa"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </NavLink>
                      <button
                        onClick={() => openDeleteModal(order._id)}
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
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Không tìm thấy đơn hàng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <PaginationItem
        length={orders.length}
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
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Xóa Đơn Hàng
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không thể hoàn tác.
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

export default ListOrder;