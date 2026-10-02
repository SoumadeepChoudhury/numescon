import React, { useState } from 'react';
import { Calendar, Download, ExternalLink, Check, X, Clock, MapPin } from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendarModal({ isOpen, onClose }: CalendarModalProps) {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const eventDetails = {
    title: 'NUMESCON 2026 — Annual Medical Sciences Congress',
    description: 'National Undergraduate & Postgraduate Medical Sciences Congress (NUMESCON 2026). Tentative dates: 1st & 2nd December 2026. Focus: Clinical Excellence, Surgical Innovations, and Compassionate Patient Care. Full scientific schedule and venue updates to follow.',
    location: 'Academic Medical Convention Center (Tentative Announcement Pending)',
    startDate: '20261201T090000Z',
    endDate: '20261202T180000Z',
  };

  const handleDownloadIcs = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NUMESCON 2026 Secretariat//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:numescon-2026-${Date.now()}@numescon.org`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${eventDetails.startDate}`,
      `DTEND:${eventDetails.endDate}`,
      `SUMMARY:${eventDetails.title}`,
      `DESCRIPTION:${eventDetails.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${eventDetails.location}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-P7D',
      'ACTION:DISPLAY',
      'DESCRIPTION:NUMESCON 2026 is approaching in 1 week',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'NUMESCON_2026_Tentative_Dates.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3500);
  };

  const getGoogleCalendarUrl = () => {
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', eventDetails.title);
    url.searchParams.append('dates', `${eventDetails.startDate}/${eventDetails.endDate}`);
    url.searchParams.append('details', eventDetails.description);
    url.searchParams.append('location', eventDetails.location);
    return url.toString();
  };

  const getOutlookWebUrl = () => {
    const url = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
    url.searchParams.append('subject', eventDetails.title);
    url.searchParams.append('startdt', '2026-12-01T09:00:00Z');
    url.searchParams.append('enddt', '2026-12-02T18:00:00Z');
    url.searchParams.append('body', eventDetails.description);
    url.searchParams.append('location', eventDetails.location);
    return url.toString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg bg-[#FAFBF9] rounded-2xl border border-[#D8E4E0] shadow-2xl p-6 sm:p-8 text-[#1E2E2B]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#6D8A83] hover:text-[#1E2E2B] hover:bg-[#EBF3F0] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#E2EDE9] flex items-center justify-center text-[#2D6A5F] border border-[#C5DED7]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 id="calendar-modal-title" className="text-xl font-semibold text-[#183933] font-serif">
              Save Congress Dates
            </h3>
            <p className="text-xs text-[#5D7E77]">Advance notice placeholder for your calendar</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E3ECE8] mb-6 space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-[#2D6A5F] tracking-wide uppercase">Event</span>
            <span className="text-xs text-[#708B84]">Tentative Winter 2026</span>
          </div>
          <div className="text-base font-semibold text-[#183933]">
            NUMESCON 2026 Congress
          </div>

          <div className="pt-2 border-t border-[#EEF3F1] space-y-2 text-xs text-[#44625B]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#2D6A5F] shrink-0" />
              <span>1st & 2nd December 2026 · 09:00 AM – 06:00 PM (Daily)</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#2D6A5F] shrink-0" />
              <span>Academic Medical Convention Center (Tentative Announcement)</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleDownloadIcs}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#2D6A5F] hover:bg-[#23564D] text-white font-medium text-sm transition-all shadow-sm"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Downloaded Calendar File (.ics)</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download .ICS (Apple iCal / Outlook / Android)</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#D5E5E0] bg-white hover:bg-[#F2F7F5] text-xs font-medium text-[#254A42] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#2D6A5F]" />
              <span>Google Calendar</span>
            </a>

            <a
              href={getOutlookWebUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#D5E5E0] bg-white hover:bg-[#F2F7F5] text-xs font-medium text-[#254A42] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#2D6A5F]" />
              <span>Outlook Web</span>
            </a>
          </div>
        </div>

        <div className="mt-5 text-center">
          <p className="text-[11px] text-[#6E8A83]">
            * Dates are tentative and subject to scientific committee schedule finalization. Subscribers will receive instant calendar updates.
          </p>
        </div>
      </div>
    </div>
  );
}
