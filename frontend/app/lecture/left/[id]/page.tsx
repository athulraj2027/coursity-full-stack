import LeftLectureComponent from "@/features/lecture/components/LeftLectureComponent";

export default async function LeftLecturePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <LeftLectureComponent id={id} />;
}
