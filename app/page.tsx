'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import GuestLecturerSection from '@/components/GuestLecturerSection';
import ClusterWorkshopSection from '@/components/ClusterWorkshopSection';
import EventPostersSection from '@/components/EventPostersSection';
import TeaserVideoSection from '@/components/TeaserVideoSection';
import EventsScheduleSection from '@/components/EventsScheduleSection';
import CommitteeSection from '@/components/CommitteeSection';
import LegacyGallerySection from '@/components/LegacyGallerySection';
import RegistrationSection from '@/components/RegistrationSection';
import Footer from '@/components/Footer';
import PolicyModals, { PolicyType } from '@/components/PolicyModals';
import { ClusterId } from '@/data/conferenceData';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedClusterForReg, setSelectedClusterForReg] = useState<ClusterId>('A');
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);
  const [hasPass, setHasPass] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return Boolean(localStorage.getItem('numescon_2026_pass'));
      } catch (e) {
        console.error(e);
      }
    }
    return false;
  });

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      const topOffset = elem.getBoundingClientRect().top + window.pageYOffset - 75;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  const handleSelectClusterForRegistration = (clusterId: ClusterId) => {
    setSelectedClusterForReg(clusterId);
    scrollToSection('registration');
  };

  const handleOpenPolicy = (type: 'terms' | 'integrity' | 'safety') => {
    if (type === 'terms') {
      window.open('/terms', '_blank', 'noopener,noreferrer');
      return;
    }
    // Keep your existing modal/logic for 'integrity' and 'safety'
    setActivePolicy(type);
  };

  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Top Bar Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenRegistration={() => scrollToSection('registration')}
        hasExistingPass={hasPass}
      />

      {/* Hero Section */}
      <div id="overview">
        <HeroSection
          onRegisterClick={() => scrollToSection('registration')}
          onTeaserClick={() => scrollToSection('teaser')}
        />
      </div>

      {/* Prominent Guest Lecturer Spotlight: Dr. Deepak Marwah */}
      <GuestLecturerSection
        onViewSchedule={() => scrollToSection('schedule')}
        onViewClusters={() => scrollToSection('clusters')}
      />

      {/* 3 Named Workshop Clusters (Dopamine Drive, Adrenaline Rush, Serotonin Surge) */}
      <ClusterWorkshopSection
        onSelectClusterForRegistration={handleSelectClusterForRegistration}
      />

      {/* Official Event Posters & Visual Releases */}
      <EventPostersSection />

      {/* Teaser Video Reel */}
      <TeaserVideoSection />

      {/* Registration Section with Responsive Form & Pass Generation */}
      <RegistrationSection
        key={selectedClusterForReg}
        initialClusterId={selectedClusterForReg}
        onPassGenerated={() => setHasPass(true)}
        onOpenPolicy={(policy) => setActivePolicy(policy)}
      />

      {/* 2-Day Academic Fest Schedule (28 & 29 Nov 2026) */}
      <EventsScheduleSection />

      {/* NBMC Leadership & Organizing Committee */}
      <CommitteeSection />

      {/* Legacy & Archival Moments from Previous NUMESCON */}
      <LegacyGallerySection />

      {/* Academic Footer with Policy Triggers and Overflow Protection */}
      <Footer
        onNavigate={scrollToSection}
        onOpenRegistration={() => scrollToSection('registration')}
        onOpenPolicy={handleOpenPolicy}
      />

      {/* Dedicated Policy Dialogs for North Bengal Medical College */}
      <PolicyModals
        activePolicy={activePolicy}
        onClose={() => setActivePolicy(null)}
      />
    </main>
  );
}
