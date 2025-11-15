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

const loginSchema = z.object({
  username: z.string().min(3).max(25),
  password: z.string().min(8).max(25),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const signin = useAuthStore((state) => state.signin);
  const trigger = useAlertStore((state) => state.trigger);
	const router = useRouter();

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await signin(values.username, values.password);
      trigger("Logged In Successfully");
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
            <CardTitle className="text-center">Welcome Back</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form
              className="flex flex-col gap-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
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

              <Button type="submit">Log In</Button>
              <p className="text-sm text-gray-500 text-center">
                Don't have an account{" "}
                <Link
                  href="/auth/signup"
                  className="text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Create One
                </Link>
              </p>
            </form>
          </Form>
        </Card>
      </div>
    </Section>
  );
}
