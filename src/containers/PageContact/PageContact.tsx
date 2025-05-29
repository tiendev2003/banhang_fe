import { FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Label from "../../components/Label/Label";
import { addContact } from "../../features/contact/contactSlice";
import ButtonPrimary from "../../shared/Button/ButtonPrimary";
import Input from "../../shared/Input/Input";
import SocialsList from "../../shared/SocialsList/SocialsList";
import Textarea from "../../shared/Textarea/Textarea";
import { AppDispatch } from "../../store";

export interface PageContactProps {
  className?: string;
}

const info = [
  {
    title: "🗺 ĐỊA CHỈ",
    desc: "Gian hàng chụp ảnh xăm hình, áo hoodie taiyaki portland, máy đánh chữ neutra",
  },
  {
    title: "💌 EMAIL",
    desc: "ceautico@example.com",
  },
  {
    title: "☎ ĐIỆN THOẠI",
    desc: "000-123-456-7890",
  },
];

const PageContact: FC<PageContactProps> = ({ className = "" }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const dispatch: AppDispatch = useDispatch();
  const onSubmit = async (data: any) => {
    try {
      await dispatch(addContact(data)).unwrap();
      toast.success('Gửi yêu cầu thành công!');
      // Reset form
      reset();

    } catch (error) {
      console.error(error);
      toast.error('Gửi yêu cầu thất bại!');
    }
  };

  return (
    <div
      className={`nc-PageContact overflow-hidden ${className}`}
      data-nc-id="PageContact"
    >

      <title>Contact || Shop - eCommerce React Template</title>

      <div className="">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Liên hệ
        </h2>
        <div className="container max-w-7xl mx-auto">
          <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-12 mb-2">
            <div className="max-w-sm space-y-8">
              {info.map((item, index) => (
                <div key={index}>
                  <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">
                    {item.title}
                  </h3>
                  <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
                    {item.desc}
                  </span>
                </div>
              ))}
              <div>
                <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">
                  🌏 SOCIALS
                </h3>
                <SocialsList className="mt-2" />
              </div>
            </div>
            <div>
              <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
                <label className="block">
                  <Label>Họ và Tên</Label>
                  <Input
                    placeholder="Example Doe"
                    type="text"
                    className="mt-1"
                    {...register("name", { required: "Full name is required" })}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{String(errors.name.message)}</p>}
                </label>
                <label className="block">
                  <Label>Địa chỉ email</Label>
                  <Input
                    type="email"
                    placeholder="example@example.com"
                    className="mt-1"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{String(errors.email.message)}</p>}
                </label>
                <label className="block">
                  <Label>Nội dung tin nhắn</Label>
                  <Textarea
                    className="mt-1"
                    rows={6}
                    {...register("message", { required: "Message is required" })}
                  />
                  {errors.message && <p className="text-red-500 text-sm">{String(errors.message.message)}</p>}
                </label>
                <div>
                  <ButtonPrimary type="submit">Gửi yêu cầu</ButtonPrimary>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* nhúng giao diệN map */}
        <div className="container max-w-7xl mx-auto mt-3">
          <div className="h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.123456789012!2d106.12345678901234!3d10.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752a1234567890%3A0x1234567890123456!2zMTI4IE5ndXnhu4duIE5ndXnhu4duLCBQaG9uZyBUaG9uZywgVmlldG5hbSDEkOG7kSAwMTI4LCAxMjAwMCDEkOG7kSAwMTI4LCAxMjAwMA!5e0!3m2!1sen!2svi!4v1612345678900"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>



    </div>
  );
};

export default PageContact;
