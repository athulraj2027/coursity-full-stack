import Card3dDemo from "@/components/ui/dynamic-ui-card";
import React from "react";

const steps = [
  {
    step: "01",
    title: "Create a Live Lecture",
    description:
      "Teachers schedule live sessions inside a course. Each lecture gets a unique meeting room with role-based access.",
  },
  {
    step: "02",
    title: "Students Join in Real Time",
    description:
      "Students join through the platform — no external links. Presence is tracked using secure join and leave events.",
  },
  {
    step: "03",
    title: "Attendance Is Auto-Verified",
    description:
      "Attendance is calculated from actual participation time, not just joins. Late entries, early exits, and absences are handled automatically.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative w-full py-24 sm:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-7xl font-extrabold tracking-tight text-foreground">
            How it works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            A simple flow designed for real classrooms — not vanity metrics or
            fake engagement.
          </p>
        </div>

        {/* Main Content */}
        {/* Left: Steps */}
        <div className="flex flex-col lg:flex-row gap-8 mt-10">
          {steps.map((item) => (
            <Card3dDemo
              key={item.step}
              title={item.title}
              description={item.description}
              step={item.step}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
