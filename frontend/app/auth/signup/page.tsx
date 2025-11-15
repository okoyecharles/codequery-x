"use client";

import Section from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAlertStore } from "@/store/alert";
import { useAuthStore } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const loginSchema = z
  .object({
    name: z.string().min(5).max(100),
    username: z.string().min(3).max(25),
    password: z.string().min(8).max(25),
    confirm: z.string().min(8).max(25),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Signup() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirm: "",
    },
  });

  const signup = useAuthStore((state) => state.signup);
  const trigger = useAlertStore((state) => state.trigger);
	const router = useRouter();

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await signup(values.name, values.username, values.password);
      trigger("Account created successfully");
			router.replace("/submissions");
    } catch (err) {
      trigger(String(err), "destructive");
    }
  };

  return (
    <Section>
      <div className="min-h-screen grid place-items-center">
        <Card className="bg-white p-4 w-full max-w-[450px] border border-gray-300 rounded-md">
          <CardHeader className="flex flex-col gap-4 items-center">
            <Link href="/">
              <Image src={"/logo.svg"} alt="Logo" width={150} height={24} />
            </Link>
            <CardTitle className="text-center">Create an Account</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form
              className="flex flex-col gap-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Confirm password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Sign Up</Button>
              <p className="text-sm text-gray-500 text-center">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Log In
                </Link>
              </p>
            </form>
          </Form>
        </Card>
      </div>
    </Section>
  );
}
