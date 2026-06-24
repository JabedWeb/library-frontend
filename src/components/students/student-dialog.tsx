"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { toast } from "sonner";

import { createStudent, updateStudent } from "@/services/students";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  onSuccess: () => void;

  student?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
};

export function StudentDialog({
  open,
  onOpenChange,
  onSuccess,
  student,
}: Props) {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  useEffect(() => {
    setName(student?.name ?? "");
    setEmail(student?.email ?? "");
    setPhone(student?.phone ?? "");
  }, [student]);

  const handleSubmit = async () => {
    try {
      if (student) {
        await updateStudent(student.id, {
          name,
          email,
          phone,
        });

        toast.success("Student updated");
      } else {
        await createStudent({
          name,
          email,
          phone,
        });

        toast.success("Student created");
      }

      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Operation failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{student ? "Edit Student" : "Add Student"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Button className="w-full" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
