import React, { useContext, useEffect, useState, useRef } from 'react';
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import MainNavBarTenant from '@/components/mainNavBarTenant/mainNavBarTenant';
import { formPropertySchema, uploadImageSchema } from '@/lib/schema';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import ProtectedRouteTenant from "@/components/auth/ProtectedRouteTenant";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AddAPhoto } from "@mui/icons-material";
import { useGetAPI, usePostApi, usePutApi } from "@/lib/service";
import { useNavigate } from 'react-router';
import { after } from 'node:test';
import { AuthContext } from '@/app/AuthContext';


// import { useNavigate } from 'react-router';
// import { after } from 'node:test';
// import { AuthContext } from '@/app/AuthContext';


const AddProperty: React.FC = () => {



  console.log("Proptery Adder");

  // const form = useForm({defaultValues: initialPropertyData, resolver: zodResolver(formPropertySchema)})
  const form = useForm({ resolver: zodResolver(formPropertySchema) })
  // const formUpload =useForm({resolver:zodResolver(uploadImageSchema)});
  const {id,token} = useContext(AuthContext);
  // const {reset} = useForm();
  // const form = {formState : formState, reset : reset, setValue : setValue, handleSubmit : handleSubmit, control : control}
  // const { isDirty, isValid } = formState;

  // const [propertyData, setPropertyData] = useState(initialPropertyData);
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (hiddenFileInput.current) hiddenFileInput.current.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFiles = files as FileList;
    form.setValue("file", selectedFiles[0]);
    // const fileValue = selectedFiles.length > 0 ? selectedFiles[0] : null;
    // form.setValue("file", fileValue!);
  };


  const config = {
    headers: {
      "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`
    },
  }


  const { mutate, isSuccess, isError } = usePostApi(`/api/propertyList`, config)
  // const { mutate:mutateImage, isSuccess:imageSuccess, isError:imageError } = usePostApi(`/api/propertyList/${id}`, config)

  const navigate = useNavigate();

  const onSubmit = async (values: any) => {
    // console.log(values);
    try {
      // Call the mutate function to make the POST request
      const formData = new FormData();
      formData.append("file", values.file);
      await mutate({ ...values });
      console.log(isSuccess, "inidia");

    }
    catch (error) {
      // Handle any errors that may occur during the API call
      console.error("Error posting property data:", error);
    } finally {

      console.log(isSuccess)
      console.log(isError)

    }

  }

  useEffect(() => {
    
    if (isSuccess) {
      form.reset();
      setTimeout(() => { navigate("/tenant") }, 50)
    }
  }, [isSuccess, isError])

  // const afterSubmit = () => {
  //   if (isSuccess) {
  //     console.log("loglog")
  //     setTimeout(() => { navigate("/tenant") }, 50)
  //   }
  // }

  return (
    <ProtectedRouteTenant>
      <>
        <MainNavBarTenant />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" encType="multipart/form-data">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Properti</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Properti Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Properti</FormLabel>
                  <FormControl>
                    <Input placeholder="Deskripsikan Properti Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilih Kategori Properti</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={""}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="1" />
                        <Label htmlFor="option-one">Villa</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="2" />
                        <Label htmlFor="option-two">Hotel</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="3" />
                        <Label htmlFor="option-two">Apartment</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Pilih Gambar Properti</FormLabel>
              <div className="flex mt-2">
                <Button type="button"
                  className="bg-slate-100 rounded-full shadow-2xl text-black px-6 font-normal text-md hover:bg-slate-200 "
                  onClick={() => handleClick()}
                >
                  <AddAPhoto fontSize="small" className="mr-2" />
                  Upload
                </Button>
              </div>
            </div>
            <FormField
              control={form.control}
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
            <Button type="submit" >Submit</Button>
          </form>
        </Form>
      </>
    </ProtectedRouteTenant>
  );
}

export default AddProperty;