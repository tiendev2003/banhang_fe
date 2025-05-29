import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router";
import {
  addDiscount,
  fetchDiscountById,
  updateDiscount,
} from "../../../features/discount/discountSlice";
import { AppDispatch, RootState } from "../../../store";
import { Discount, DiscountType } from "../../../types/discount.types";

const AddDiscount = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { discount } = useSelector((state: RootState) => state.discounts);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      discountCode: "",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 0,
      minOrderValue: 0,
      maxDiscountAmount: 0,
      maxUsage: 0,
      startDate: "",
      endDate: "",
      isActive: "true",
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchDiscountById(Number(id))).then((action) => {
        if (fetchDiscountById.fulfilled.match(action)) {
          const discount = action.payload;
          setValue("name", discount.name);
          setValue("discountCode", discount.discountCode);
          setValue("discountType", discount.discountType);
          setValue("discountValue", discount.discountValue);
          setValue("minOrderValue", discount.minOrderValue);
          setValue("maxDiscountAmount", discount.maxDiscountAmount);
          setValue("maxUsage", discount.maxUsage);
          setValue(
            "startDate",
            new Date(discount.startDate).toISOString().split("T")[0]
          );
          setValue(
            "endDate",
            new Date(discount.endDate).toISOString().split("T")[0]
          );
          setValue("isActive", discount.active ? "true" : "false");
        }
      });
    }
  }, [id, dispatch, setValue]);
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const maxDiscountAmount = watch("maxDiscountAmount");
  const discountType = watch("discountType");

  const onSubmit = async (data: any) => {
    const newDiscount: Discount = {
      id: discount ? discount._id : Date.now(),
      ...data,
      active: data.isActive === "true" ? true : false,
      usageCount: discount ? discount.usageCount : 0,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    };
    console.log(newDiscount);
    try {
      if (discount?._id) {
        await dispatch(updateDiscount(newDiscount)).unwrap();
        toast.success("Discount updated successfully");
      } else {
        await dispatch(addDiscount(newDiscount)).unwrap();
        toast.success("Discount added successfully");
      }
      navigate("/admin/discounts");
    } catch (error: any) {
      console.error("Error adding/updating discount:", error);
      toast.error(error);
    }
  };

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {discount ? `Sửa mã - ${discount.name}` : "Thêm mã giảm giá"}
        </h1>
        <NavLink
          to="/admin/discounts"
          className="text-indigo-600 hover:text-indigo-900 flex items-center"
        >
          <span className="mr-2">Back to Discount List</span>
        </NavLink>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Tên
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Tên là bắt buộc" })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.name ? "border-red-500" : ""
                }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Discount Code */}
          <div>
            <label
              htmlFor="discountCode"
              className="block text-sm font-medium text-gray-700"
            >
              Mã giảm giá
            </label>
            <input
              type="text"
              id="discountCode"
              {...register("discountCode", {
                required: "Mã giảm giá là bắt buộc",
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.discountCode ? "border-red-500" : ""
                }`}
            />
            {errors.discountCode && (
              <p className="text-red-500 text-sm">
                {errors.discountCode.message}
              </p>
            )}
          </div>

          {/* Discount Type */}
          <div>
            <label
              htmlFor="discountType"
              className="block text-sm font-medium text-gray-700"
            >
              Loại giảm giá
            </label>
            <select
              id="discountType"
              {...register("discountType")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value={DiscountType.PERCENTAGE}>Phần trăm</option>
              <option value={DiscountType.FIXED}>Số tiền cố định</option>
            </select>
          </div>

          {/* Discount Value */}
          <div>
            <label
              htmlFor="discountValue"
              className="block text-sm font-medium text-gray-700"
            >
              Giá trị giảm giá
            </label>
            <input
              type="number"
              id="discountValue"
              {...register("discountValue", {
                required: "Giá trị giảm giá là bắt buộc",
                min: { value: 1, message: "Giá trị giảm giá phải lớn hơn 0" },
                validate: (value) => {
                  if (discountType === DiscountType.PERCENTAGE) {
                    return (
                      value <= 100 ||
                      "Giá trị giảm giá phần trăm không được vượt quá 100%"
                    );
                  }
                  const max = maxDiscountAmount ? maxDiscountAmount : Infinity;
                  return (
                    value <= max ||
                    "Giá trị giảm giá không được vượt quá số tiền giảm giá tối đa"
                  );
                },
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.discountValue ? "border-red-500" : ""
                }`}
            />
            {errors.discountValue && (
              <p className="text-red-500 text-sm">
                {errors.discountValue.message}
              </p>
            )}
          </div>

          {/* Min Order Value */}
          <div>
            <label
              htmlFor="minOrderValue"
              className="block text-sm font-medium text-gray-700"
            >
              Giá trị đơn hàng tối thiểu
            </label>
            <input
              type="number"
              id="minOrderValue"
              {...register("minOrderValue", {
                required: "Giá trị đơn hàng tối thiểu là bắt buộc",
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.minOrderValue ? "border-red-500" : ""
                }`}
            />
            {errors.minOrderValue && (
              <p className="text-red-500 text-sm">
                {errors.minOrderValue.message}
              </p>
            )}
          </div>

          {/* Max Discount Amount */}
          <div>
            <label
              htmlFor="maxDiscountAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Số tiền giảm giá tối đa
            </label>
            <input
              type="number"
              id="maxDiscountAmount"
              {...register("maxDiscountAmount", {
                required: "Số tiền giảm giá tối đa là bắt buộc",
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.maxDiscountAmount ? "border-red-500" : ""
                }`}
            />
            {errors.maxDiscountAmount && (
              <p className="text-red-500 text-sm">
                {errors.maxDiscountAmount.message}
              </p>
            )}
          </div>

          {/* Max Usage */}
          <div>
            <label
              htmlFor="maxUsage"
              className="block text-sm font-medium text-gray-700"
            >
              Số lần sử dụng tối đa
            </label>
            <input
              type="number"
              id="maxUsage"
              {...register("maxUsage", {
                required: "Số lần sử dụng tối đa là bắt buộc",
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.maxUsage ? "border-red-500" : ""
                }`}
            />
            {errors.maxUsage && (
              <p className="text-red-500 text-sm">{errors.maxUsage.message}</p>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày bắt đầu
            </label>
            <input
              type="date"
              id="startDate"
              {...register("startDate", {
                required: "Ngày bắt đầu là bắt buộc",
                validate: (value) => {
                  const start = new Date(value);
                  const end = new Date(endDate);
                  return start < end || "Ngày bắt đầu phải trước ngày kết thúc";
                },
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.startDate ? "border-red-500" : ""
                }`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate.message}</p>
            )}
          </div>
          {/* End Date */}
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              Ngày kết thúc
            </label>
            <input
              type="date"
              id="endDate"
              {...register("endDate", {
                required: "Ngày kết thúc là bắt buộc",
                validate: (value) => {
                  const start = new Date(startDate);
                  const end = new Date(value);
                  return end > start || "Ngày kết thúc phải sau ngày bắt đầu";
                },
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.endDate ? "border-red-500" : ""
                }`}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate.message}</p>
            )}
          </div>

          {/* Is Active */}
          <div>
            <label
              htmlFor="isActive"
              className="block text-sm font-medium text-gray-700"
            >
              Trạng thái
            </label>
            <select
              id="isActive"
              {...register("isActive")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value={"true"}>Hoạt động</option>
              <option value={"false"}>Không hoạt động</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <NavLink
            to="/admin/discounts"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </NavLink>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Lưu giảm giá
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDiscount;