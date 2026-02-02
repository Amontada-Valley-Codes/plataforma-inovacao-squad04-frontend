"use client";

import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";

export default function RolloutTimeline() {
  const phases = [
    {
      id: "1",
      name: "Fase piloto",
      start: "2026-03-01",
      end: "2026-03-07",
    },
    {
      id: "2",
      name: "Expansão regional",
      start: "2026-03-08",
      end: "2026-03-20",
    },
    {
      id: "3",
      name: "Rollout completo",
      start: "2026-03-21",
      end: "2026-03-31",
    },
  ];

  return (
    <div
      className="
        rounded-xl border border-[#E5E7EB] dark:border-gray-800
        bg-white dark:bg-gray-900 
        p-4 shadow-sm
      "
    >
      
      {/* FullCalendar */}
      <div className="rounded-lg overflow-hidden">
        <FullCalendar
          plugins={[resourceTimelinePlugin, interactionPlugin]}
          initialView="resourceTimelineMonth"
          height={450}
          slotMinWidth={80}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right:
              "resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth",
          }}
          resources={phases.map((p) => ({
            id: p.id,
            title: p.name,
          }))}
          events={phases.map((p) => ({
            id: p.id,
            resourceId: p.id,
            title: p.name,
            start: p.start,
            end: p.end,
          }))}
          buttonText={{
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
          }}
          locale="pt-br"
        />
      </div>
    </div>
  );
}
