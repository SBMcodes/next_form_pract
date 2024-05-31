"use client";
import { zodResolver } from "@hookform/resolvers/zod";
// npm install zod react-hook-form @hookform/resolvers

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Note: Here we have done only client side validation & A server side validation is also required to make it secure
// We can do that using same schema formSchema.safeParse(object);

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create the form schema using zod
  const formSchema = z
    .object({
      firstName: z.string().min(2).max(120),
      lastName: z.string().min(2).max(120),
      email: z.string().email(),
      age: z.number().min(18, "Age>=18"),
      password: z.string().min(6).max(120),
      confirmPassword: z.string().min(6).max(120),
    })
    .refine(
      (data) => {
        return data.password === data.confirmPassword;
      },
      //   path attaches error to only confirmPassword field
      { message: "Passwords don't match", path: ["confirmPassword"] }
    );

  // Infer type from form
  type formSchemaType = z.infer<typeof formSchema>;

  //   Connect formSchema (zod) and useFormHook
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<formSchemaType>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  //   After validation this function will be called
  const submitData = async (data: formSchemaType) => {
    setIsSubmitting(true);
    console.log(data);
    // Post Data or call server action
    setTimeout(() => {
      setIsSubmitting(false);
      reset();
    }, 2000);
  };

  return (
    <div className="w-screen flex flex-col items-center mt-4">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitData)}>
        <div>
          <label>First Name: </label>
          <input
            type="text"
            {...register("firstName")}
            disabled={isSubmitting}
          />
          {errors.firstName && `${errors.firstName.message}`}
        </div>
        <div>
          <label>Last Name: </label>
          <input
            type="text"
            {...register("lastName")}
            disabled={isSubmitting}
          />
          {errors.lastName && `${errors.lastName.message}`}
        </div>
        <div>
          <label>Email: </label>
          <input type="email" {...register("email")} disabled={isSubmitting} />
          {errors.email && `${errors.email.message}`}
        </div>
        <div>
          <label>Age: </label>
          <input
            type="number"
            {...register("age", { valueAsNumber: true })}
            disabled={isSubmitting}
          />
          {errors.age && `${errors.age.message}`}
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            {...register("password")}
            disabled={isSubmitting}
          />
          {errors.password && `${errors.password.message}`}
        </div>
        <div>
          <label>Confirm Password: </label>
          <input
            type="password"
            {...register("confirmPassword")}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && `${errors.confirmPassword.message}`}
        </div>

        <input
          className="w-full mt-4 p-2 cursor-pointer active:bg-red-200"
          type="submit"
          disabled={isSubmitting}
          value={isSubmitting ? "Submitting..." : "Submit"}
        />
      </form>
    </div>
  );
};

export default RegisterForm;
