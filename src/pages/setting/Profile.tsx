import { AuthContext } from "@/app/AuthContext";
import { useContext, useEffect, useRef } from "react";
import { useGetAPI, usePutApi } from "@/lib/service";
import { Form, FormControl, FormItem, FormMessage, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/lib/features/hook";
import { Button } from "@/components/ui/button";
import { uploadImageSchema } from "@/lib/schema";
import { AddAPhoto } from "@mui/icons-material";
import { setRand } from "@/lib/features/globalReducer";
import { random } from "@/lib/features/globalReducer";
import { Toaster, toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Biodata from "@/components/profile/Biodata";
import VerifyEmail from "@/components/profile/VerifyEmail";

const Profile = () => {
  const dispathc = useAppDispatch();
  const { bearer, token } = useContext(AuthContext);
  const { data, isFetched, refetch } = useGetAPI(`/api/user/id`, "user-profile", bearer);
  const rand = useAppSelector(random);
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (hiddenFileInput.current) hiddenFileInput.current.click();
  };

  const formUpload = useForm({
    resolver: zodResolver(uploadImageSchema),
  });

  const { mutate, isSuccess, isError } = usePutApi(`/api/user/upload-image`, {
    headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    formUpload.setValue("file", selectedFiles[0]);
  };

  const onSubmitUpload = async (values: any) => {
    const formData = new FormData();
    formData.append("file", values.file);
    mutate(values);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Sukses Upload Gambar");
    }
    if (isError) {
      toast.error("Gagal Upload Gambar");
    }
    refetch();
  }, [isSuccess, isError, rand]);

  return (
    <div className="border rounded-xl p-10 flex flex-col sm:flex-row h-full">
      <Toaster />
      <div className="w-full mb-10 sm:w-1/3">
        <div className="space-y-8">
          {isFetched && (
            <div className="flex justify-center">
              <Avatar className="ring-4 ring-[#FC5185] w-[150px] h-[150px] lg:w-[250px] lg:h-[250px]">
                <AvatarImage src={data.image_url as string} alt="" className=" rounded-full mx-auto" />
              </Avatar>
            </div>
          )}
          <div className="flex">
            <Button
              className="bg-slate-100 rounded-full shadow-2xl text-black px-6 font-normal hover:bg-slate-200 mx-auto"
              onClick={() => handleClick()}
            >
              <AddAPhoto fontSize="small" className="mr-2" />
              upload
            </Button>
          </div>
        </div>

        <div className="text-center mb-10">
          <Form {...formUpload}>
            <form
              onSubmit={formUpload.handleSubmit(onSubmitUpload, (err) => console.log(err))}
              encType="multipart/form-data"
            >
              <FormField
                control={formUpload.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <Input
                        ref={hiddenFileInput}
                        className="hidden"
                        type="file"
                        id="file"
                        onChange={(value) => handleChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mx-auto mt-2" type="submit" onClick={() => dispathc(setRand(Math.random()))}>
                Submit
              </Button>
            </form>
          </Form>
        </div>

        {isFetched && (
          <div className="lg:mx-auto text-center">
            <p className="text-base italic font-thin">
              {data.email_verified ? "Email telah diverifikasi" : "Email belum diverifikasi"}
            </p>
            <VerifyEmail data={data} />
          </div>
        )}
      </div>

      {isFetched && (
        <div className="w-full sm:w-2/3 sm:px-8 md:px-12 lg:px-16">
          <Biodata data={data} />
        </div>
      )}
    </div>
  );
};

export default Profile;
