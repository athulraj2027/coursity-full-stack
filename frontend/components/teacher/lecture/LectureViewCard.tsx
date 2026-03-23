"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, BookOpen, Users } from "lucide-react";
import { useMyLectureQueryById } from "@/queries/lectures.queries";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";

const statusColorMap: Record<
  "NOT_STARTED" | "STARTED" | "COMPLETED" | "SCHEDULED" | "LIVE" | "CANCELLED",
  "secondary" | "default" | "outline" | "ghost" | "destructive" | "secondary"
> = {
  NOT_STARTED: "secondary",
  STARTED: "default",
  COMPLETED: "outline",
  SCHEDULED: "ghost",
  LIVE: "destructive",
  CANCELLED: "secondary",
};

const LectureViewCard = ({ lectureId }: { lectureId: string }) => {
  const { isLoading, error, data } = useMyLectureQueryById(lectureId);

  if (isLoading) return <Loading />;
  if (error || !data) return <Error />;

  const { title, startTime, status, createdAt, course, attendance } = data;

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      timeZone: userTimeZone,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          {/* Title + Status */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{course.title}</span>
              </div>
            </div>

            <Badge variant={statusColorMap[status]}>
              {status.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6 space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Scheduled Time</span>
              </div>
              <div className="text-sm font-semibold">
                {formatDateTime(startTime)}
              </div>
            </div>

            <div className="space-y-1 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Created</span>
              </div>
              <div className="text-sm font-semibold">
                {formatDateTime(createdAt)}
              </div>
            </div>

            <div className="space-y-1 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Attendance Records</span>
              </div>
              <div className="text-sm font-semibold">{attendance.length}</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Attendance Details</h3>
              <Badge variant="secondary">
                {attendance.length} Student{attendance.length !== 1 && "s"}
              </Badge>
            </div>

            {attendance.length === 0 ? (
              <div className="text-sm text-muted-foreground italic">
                No attendance records available for this lecture.
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <div className="grid grid-cols-4 bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
                  <span>Student</span>
                  <span>Duration</span>
                  <span>Status</span>
                  <span>Email</span>
                </div>

                {attendance.map((record) => (
                  <div
                    key={record.id}
                    className="grid grid-cols-4 items-center px-4 py-3 text-sm border-t"
                  >
                    <div className="font-medium">
                      {record.student?.name || "Unknown"}
                    </div>

                    <div>
                      {Math.floor(record.durationSec / 60)} min{" "}
                      {record.durationSec % 60}s
                    </div>

                    <div>
                      <Badge
                        variant={
                          record.status === "PRESENT"
                            ? "default"
                            : record.status === "LATE"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>

                    <div className="text-muted-foreground text-xs">
                      {record.student?.email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LectureViewCard;
