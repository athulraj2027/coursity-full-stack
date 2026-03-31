import EnrollmentSuccess from "@/components/student/EnrollmentSuccess";

export default async function EnrolledPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <EnrollmentSuccess enrollmentId={id} />;
}
