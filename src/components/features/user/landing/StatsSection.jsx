'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { dashboardAPI } from '@/lib/api';

export default function StatsSection() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalUmkm: 0,
    totalPeserta: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getGeneralStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const statsData = [
    {
      value: stats.totalEvents,
      label: 'Event Terlaksana',
      suffix: '+',
    },
    {
      value: stats.totalPeserta,
      label: 'Peserta Aktif',
      suffix: '+',
    },
    {
      value: stats.totalUmkm,
      label: 'UMKM Binaan',
      suffix: '+',
    },
    {
      value: stats.totalUsers,
      label: 'Pengguna Terdaftar',
      suffix: '+',
    },
  ];

  return (
    <section className="bg-gradient-to-br from-[#174c4e] to-[#072526] py-20 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
            Pencapaian Kami
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            Membangun ekosistem kewirausahaan yang berkelanjutan
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mb-2 text-5xl font-bold text-[#fba635]">
                <CountUp end={stat.value} duration={2} />
                {stat.suffix}
              </div>
              <p className="text-lg text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Simple CountUp component
function CountUp({ end, duration }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return <span>{count}</span>;
}
