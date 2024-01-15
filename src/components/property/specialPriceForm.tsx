import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePostApi } from "@/lib/service";
import { useParams } from "react-router";
import { AuthContext } from "@/app/AuthContext";
import { specialPriceSchema } from "@/lib/schema";
import { Label } from "@radix-ui/react-label";
import { Switch } from "@/components/ui/switch";
// import { DateRange } from '@mui/icons-material';

const initialFormValues = {
  percentage: 0,
  price: 0,
  date: new Date(),
};

const SpecialPriceForm: React.FC = () => {
  const form = useForm({ defaultValues: initialFormValues, resolver: zodResolver(specialPriceSchema) });
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const config = {
    headers: {
      Accept: "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

  const { mutate } = usePostApi(`/api/specialPrice/${id}`, config);

  const onSubmit = async (values: any) => {
    console.log(values);
    try {
      // Call the mutate function to make the POST request

      await mutate({ ...values });
    } catch (error) {
      // Handle any errors that may occur during the API call
      console.error("Error posting special price data:", error);
    }
  };
  const [date, setDate] = useState<Date>();
  const [select, setSelect] = useState(false);
  const [footerValue, setFooter] = useState("");

  useEffect(() => handleFooter(), [date]);
  useEffect(() => {
    form.reset();
  }, [select]);
  const handleFooter = () => {
    if (date) {
      setFooter(`You picked ${date.toString().substring(0, 15)}`);
    } else if (date === undefined) {
      setFooter("Pick a Date");
    }
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" encType="multipart/form-data">
          <FormField
            control={form.control}
            name="percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adjust Percentage</FormLabel>
                <FormControl>
                  <Input
                    placeholder="% Price Adjustments"
                    disabled={select}
                    {...field}
                    onChange={(e) => {
                      // Parse the input value as a float
                      const parsedValuePercent = parseFloat(e.target.value);
                      // Check if the parsing is successful and update the field value
                      if (!isNaN(parsedValuePercent)) {
                        field.onChange(parsedValuePercent);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adjust Nominal</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nominal Price Adjustments"
                    disabled={!select}
                    {...field}
                    onChange={(e) => {
                      // Parse the input value as a float
                      const parsedValuePrice = parseFloat(e.target.value);
                      // Check if the parsing is successful and update the field value
                      if (!isNaN(parsedValuePrice)) {
                        field.onChange(parsedValuePrice);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-2">
            <Switch
              id="nominal-mode"
              onClick={() => {
                setSelect(!select);
              }}
            />
            <Label htmlFor="nominal-mode">By Nominal</Label>
          </div>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pick a Date</FormLabel>
                <FormControl>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      // Update the date state
                      setDate(selectedDate as Date);
                      // Update the form field value
                      field.onChange(selectedDate);
                    }}
                    fromYear={1960}
                    toYear={2030}
                    disabled={(date) => new Date() > date}
                    className="right-0"
                    footer={footerValue}
                    // Add any other props or styles you need
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
};

export default SpecialPriceForm;
