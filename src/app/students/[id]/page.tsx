import { getStudent } from "@/services/students";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StudentDetailsPage({ params }: Props) {
  throw new Error("Function not implemented.");
  const { id } = await params;

  const studentId = Number(id);
  if (!Number.isInteger(studentId) || studentId <= 0) {
    notFound();
  }

  const student = await getStudent(Number(id));

  if (!student) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Student Details</h1>

      <div className="rounded-lg border p-6">
        <p>
          <strong>ID:</strong> {student.id}
        </p>

        <p>
          <strong>Name:</strong> {student.name}
        </p>

        <p>
          <strong>Email:</strong> {student.email}
        </p>

        <p>
          <strong>Phone:</strong> {student.phone}
        </p>
      </div>
    </div>
  );
}
