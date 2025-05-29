import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router";
import api from "../../../api/api";
import {
  addBrand,
  fetchBrandById,
  updateBrand,
} from "../../../features/brand/brandSlice";
import { AppDispatch, RootState } from "../../../store";
import { Brand } from "../../../types";
import { uploadImage } from "../../../utils/uploadImage";

const AddBrand = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { brand } = useSelector((state: RootState) => state.brands);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchBrandById(id)).then((action) => {
        if (fetchBrandById.fulfilled.match(action)) {
          const brand = action.payload;
          setValue("name", brand.name);
          setValue("description", brand.description);
          setValue("active", brand.active ? "true" : "false");
          setImagePreview(brand.logo);
        }
      });
    }
  }, [id, dispatch, setValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(imageUrl);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      let imageUrl = imagePreview;
      if (imageFile != null) {
        const formDataImage = new FormData();
        formDataImage.append("file", imageFile);
        const image = await uploadImage(formDataImage);
        imageUrl = api.getUri() + image;
      }

      const newBrand: Brand = {
        _id: brand ? brand._id : Date.now(),
        name: data.name,
        description: data.description,
        logo: imageUrl ?? brand?.logo ?? "",
        active: data.active === "true",
        createdDate: brand ? brand.createdDate : new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };

      if (brand) {
        await dispatch(updateBrand(newBrand)).unwrap();
        toast.success("Cập nhật thương hiệu thành công");
      } else {
        await dispatch(addBrand(newBrand)).unwrap();
        toast.success("Thêm thương hiệu thành công");
      }

      navigate("/admin/brand");
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {brand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
        </h1>
        <NavLink
          to="/admin/brand"
          className="text-indigo-600 hover:text-indigo-900 flex items-center"
        >
          <span className="mr-2">Quay lại danh sách thương hiệu</span>
        </NavLink>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Tên
          </label>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Tên không được để trống" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="name"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.name ? "border-red-500" : ""
                  }`}
              />
            )}
          />
          {errors.name && typeof errors.name.message === "string" && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Mô tả
          </label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Mô tả không được để trống" }}
            render={({ field }) => (
              <textarea
                {...field}
                id="description"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            )}
          />
          {errors.description && typeof errors.description.message === "string" && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Hình ảnh
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                crossOrigin="anonymous"
                className="h-40 w-auto rounded-md"
              />
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Trạng thái
          </label>
          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="active"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="true">Hoạt động</option>
                <option value="false">Không hoạt động</option>
              </select>
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <NavLink
            to="/admin/brand"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Hủy
          </NavLink>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            {brand ? "Cập nhật thương hiệu" : "Lưu thương hiệu"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBrand;