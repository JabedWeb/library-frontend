"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getStudents } from "@/services/students";
import { Student } from "@/types/student";
import { DeleteStudentDialog } from "@/components/students/delete-student-dialog";
import { StudentDialog } from "@/components/students/student-dialog";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();

  const loadStudents = async () => {
    try {
      const data = await getStudents();

      setStudents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Students Management</h1>

        <Button
          onClick={() => {
            setSelectedStudent(undefined);

            setDialogOpen(true);
          }}
        >
          Add Student
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>

                  <TableCell>{student.name}</TableCell>

                  <TableCell>{student.email}</TableCell>

                  <TableCell>{student.phone}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedStudent(student);

                          setDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedStudent(student);

                          setDeleteOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <StudentDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            student={selectedStudent}
            onSuccess={loadStudents}
          />

          {selectedStudent && (
            <DeleteStudentDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              studentId={selectedStudent.id}
              onSuccess={loadStudents}
            />
          )}
        </>
      )}
    </div>
  );
}
