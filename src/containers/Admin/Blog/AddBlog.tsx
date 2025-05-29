import { Editor } from "@tinymce/tinymce-react";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router";
import api from "../../../api/api";
import {
  addBlog,
  fetchBlogById,
  updateBlog,
} from "../../../features/blog/blogSlice";
import { fetchBlogCategories } from "../../../features/blogCategory/blogCategorySlice";
import { fetchTags } from "../../../features/tag/tagSlice";
import { fetchUsers } from "../../../features/users/userSlice";
import { AppDispatch, RootState } from "../../../store";
import { BlogRequest } from "../../../types";
import { uploadImage } from "../../../utils/uploadImage";

const AddBlog = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { blog } = useSelector((state: RootState) => state.blogs);
  const { categories } = useSelector(
    (state: RootState) => state.blogCategories
  );
  const { tags } = useSelector((state: RootState) => state.tags);
  const { users } = useSelector((state: RootState) => state.users);
  // State cho form
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null as File | string | null,
    status: "Nháp",
    category: "",
    author: "",
    tags: [] as number[],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newTag, setNewTag] = useState(""); // Tag mới từ input

  // Xử lý thay đổi input
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi content từ TinyMCE
  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  // Xử lý thay đổi tag (multiple select)
  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );
    setFormData((prev) => ({ ...prev, tagIds: selectedOptions }));
  };

  // Xử lý nhập tag mới
  const handleNewTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  // Thêm tag mới
  const addNewTag = () => {
    if (newTag.trim() !== "") {
      const newTagObject = { _id: Date.now(), name: newTag };
      setFormData((prev) => ({
        ...prev,
        tagIds: [...prev.tags, newTagObject._id],
      }));
      setNewTag("");
      // Optionally, you can dispatch an action to add the new tag to the store
      // dispatch(addTag(newTagObject));
      toast.success("Added new tag successfully");
    } else {
      toast.error("Tag name cannot be empty");
    }
  };

  // Xử lý khi nhấn Enter trong input tag
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewTag();
    }
  };

  // Xử lý upload ảnh
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(imageUrl);
    }
  };

  useEffect(() => {
    dispatch(fetchBlogCategories({ page: 1, search: "", size: 100 }));
    dispatch(fetchTags({ page: 1, search: "", size: 100 }));
    dispatch(
      fetchUsers({
        page: 1,
        search: "",
        size: 100,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id)).then((action) => {
        if (fetchBlogById.fulfilled.match(action)) {
          const blog = action.payload;
          setFormData({
            title: blog.title,
            content: blog.content,
            image: blog.image,
            status: blog.status,
            category: blog?.category?._id?.toString(),
            author: blog.author._id.toString(),
            tags: blog.tags.map((tag) => tag._id),
          });
          setImagePreview(blog.image);
        }
      });
    }
  }, [id, dispatch]);

  // Xử lý submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = imagePreview;
      if (formData.image && typeof formData.image !== "string") {
        const formDataImage = new FormData();
        formDataImage.append("file", formData.image);
        const image = await uploadImage(formDataImage);
        imageUrl = api.getUri() + image;
      }

      const newBlog: BlogRequest = {
        _id: blog?._id,
        title: formData.title,
        content: formData.content.toString(),
        image: imageUrl!,
        status: formData.status,
        createdDate: blog ? blog.createdDate : new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        category: formData.category.toString(),
        author: formData.author.toString(),
        tags: tags
          .filter((tag) => formData.tags.includes(tag._id))
          .map((tag) => tag.name),
      };

      if (blog?._id) {
        await dispatch(updateBlog(newBlog)).unwrap();
        toast.success("Updated blog successfully");
      } else {
        await dispatch(addBlog(newBlog)).unwrap();
        toast.success("Added blog successfully");
      }
      navigate("/admin/blog");
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thêm Blog Mới</h1>
        <NavLink
          to="/admin/blog"
          className="text-indigo-600 hover:text-indigo-900 flex items-center"
        >
          <span className="mr-2">Quay lại danh sách Blog</span>
        </NavLink>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Tiêu đề
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Content with TinyMCE */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Nội dung
          </label>
          <Editor
            apiKey="btnhknzsdtdbu8ck8nwda9fxjxrlb2euoccuw6rfr5otxf02"
            value={formData.content}
            onEditorChange={handleEditorChange}
            init={{
              height: 400,
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
        </div>

        {/* Image */}
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
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="Không hoạt động">Không hoạt động</option>
            <option value="Hoạt động">Hoạt động</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Danh mục
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Chọn danh mục</option>
            {categories &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        {/* Author */}
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700"
          >
            Tác giả
          </label>
          <select
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Chọn tác giả</option>
            {users &&
              users.map((author) => (
                <option key={author._id} value={author._id}>
                  {author.username}
                </option>
              ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700"
          >
            Thẻ
          </label>
          <select
            id="tags"
            name="tags"
            multiple
            value={formData.tags.map(String)}
            onChange={handleTagChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {tags.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Giữ Ctrl (hoặc Cmd) để chọn nhiều thẻ.
          </p>

          {/* Input để thêm tag mới */}
          <div className="mt-2 flex items-center space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={handleNewTagChange}
              onKeyDown={handleKeyDown}
              placeholder="Nhập thẻ mới"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={addNewTag}
              className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Thêm
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <NavLink
            to="/admin/blog"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Hủy
          </NavLink>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Lưu Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;