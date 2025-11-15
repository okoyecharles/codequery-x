"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuestionsStore } from "@/store/questions";
import { useAlertStore } from "@/store/alert";

type QuestionFormValues = {
  question: string;
};

export default function CreateQuestionDialog() {
  const [open, setOpen] = useState(false);
  const { askQuestion } = useQuestionsStore();
	const { trigger } = useAlertStore();

  const form = useForm<QuestionFormValues>({
    defaultValues: { question: "" },
  });

  const onSubmit: SubmitHandler<QuestionFormValues> = async (values) => {
    try {
      await askQuestion(values.question);
      setOpen(false);
      form.reset();
			trigger("Query submitted successfully");
    } catch (err: any) {
			trigger(err, "destructive");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Submit Query</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Question</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="question"
							rules={{
                required: "Question is required",
                minLength: {
                  value: 10,
                  message: "Question must be at least 10 characters",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your question" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
