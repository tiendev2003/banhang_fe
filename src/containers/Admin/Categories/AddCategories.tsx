import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router";
import api from "../../../api/api";
import {
  addCategory,
  fetchCategoryById,
  updateCategory,
} from "../../../features/category/categorySlice";
import { AppDispatch, RootState } from "../../../store";
import { Category } from "../../../types";
import { uploadImage } from "../../../utils/uploadImage";

const AddCategories = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { category } = useSelector((state: RootState) => state.categories);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Xử lý upload ảnh
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setValue("image", file); // Use setValue to update the image file
      setImagePreview(imageUrl);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryById(id)).then((action) => {
        if (fetchCategoryById.fulfilled.match(action)) {
          const category = action.payload;
          setValue("name", category.name);
          setValue("description", category.description);
          setValue("image", category.image);
          setValue("active", category.active ? "true" : "false");
          setImagePreview(category.image);
        }
      });
    }
  }, [id, dispatch, setValue]);

  // Xử lý submit form
  const onSubmit = async (data: any) => {
    try {
      let imageUrl = imagePreview;
      if (data.image && typeof data.image !== "string") {
        const formDataImage = new FormData();
        formDataImage.append("file", data.image);
        const image = await uploadImage(formDataImage);
        imageUrl = api.getUri() + image;
      }

      const newCategory: Category = {
        _id: category ? category._id : Date.now(),
        name: data.name,
        description: data.description,
        image: imageUrl!,
        active: data.active === "true",
        createdDate: category ? category.createdDate : new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };

      if (category?._id) {
        await dispatch(updateCategory(newCategory)).unwrap();
        toast.success("Cập nhật danh mục thành công");
      } else {
        await dispatch(addCategory(newCategory)).unwrap();
        toast.success("Thêm danh mục thành công");
      }
      navigate("/admin/categories");
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {category ? `Chỉnh danh mục: ${category.name}` : "Thêm danh mục"}
        </h1>
        <NavLink
          to="/admin/categories"
          className="text-indigo-600 hover:text-indigo-900 flex items-center"
        >
          <span className="mr-2">Back to Category List</span>
        </NavLink>
      </div>

      {/* Form */}
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
          <input
            type="text"
            id="name"
            {...register("name", { required: "Tên là bắt buộc" })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.name ? "border-red-500" : ""
              }`}
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
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Image */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Ảnh
          </label>
          <input
            type="file"
            id="image"
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
            htmlFor="active"
            className="block text-sm font-medium text-gray-700"
          >
            Trạng thái
          </label>
          <select
            id="active"
            {...register("active")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value={"true"}>Hoạt động</option>
            <option value={"false"}>Không hoạt động</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <NavLink
            to="/admin/categories"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </NavLink>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Lưu danh mục
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategories;