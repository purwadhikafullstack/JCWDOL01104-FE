import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registeSchema } from "@/lib/schema";
import { toast } from "sonner";
import { useEffect } from "react";
import { usePostApi } from "@/lib/service";
import { Separator } from "../ui/separator";
import { FormInput, FormInputPassword, LoginOauth } from "../Component";
import { useAppDispatch } from "@/lib/features/hook";
import { setRand } from "@/lib/features/globalReducer";

const Register = () => {
  const dispatch = useAppDispatch();

  const googleAuth = () => {
    window.open(`${import.meta.env.VITE_AUTH_URL}/google/oauth`, "_self");
  };

  const initForm = {
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  };

  type FormType = typeof initForm;
  const form = useForm({
    resolver: zodResolver(registeSchema),
    defaultValues: initForm,
  });

  const { mutate, isSuccess, isError, error } = usePostApi("/api/user/register");
  const onSubmit = (values: FormType) => {
    mutate({
      name: values.name,
      email: values.email,
      password: values.password,
      phoneNumber: values.phoneNumber,
      role: "user",
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Register Sukses");
      dispatch(setRand(Math.random()));
      form.reset(initForm);
    }
    if (isError) {
      toast.error(error?.response?.data.message);
    }
  }, [isSuccess, isError]);

  return (
    <div>
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))} className="space-y-4">
            <FormInput form={form} name="name" desc="Nama lengkap" />
            <FormInput form={form} name="email" desc="Alamat email" />
            <FormInputPassword form={form} name="password" />
            <FormInput form={form} name="phoneNumber" desc="Nomor telepon" />

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>

        <Separator className="bg-slate-300" />

        <LoginOauth googleAuth={googleAuth} />
      </div>
    </div>
  );
};

export default Register;
