"use client";

import { useState } from "react";

type Announcement = {
  id: number;
  title: string;
  description: string;
  date: string;
};

interface AnnouncementsProps {
  announcements: Announcement[];
}

const Announcements = ({ announcements }: AnnouncementsProps) => {
  const [showAll, setShowAll] = useState(false);

  const displayedAnnouncements = showAll ? announcements : announcements.slice(0, 3);

  const bgColors = ["bg-lamaSkyLight", "bg-lamaPurpleLight", "bg-lamaYellowLight"];

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-gray-400 hover:underline"
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {displayedAnnouncements.map((announcement, index) => (
          <div
            key={announcement.id}
            className={`${bgColors[index % bgColors.length]} rounded-md p-4`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{announcement.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(new Date(announcement.date))}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{announcement.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
