'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

interface QualityRadarProps {
  score: {
    ontological_depth: { value: number };
    novelty: { value: number };
    viability: { value: number };
    zeitgeist_alignment: { value: number };
    generative_potential: { value: number };
    composite: number;
  };
}

export default function QualityRadar({ score }: QualityRadarProps) {
  const data = [
    { dimension: 'Ontological', value: score.ontological_depth.value },
    { dimension: 'Novelty', value: score.novelty.value },
    { dimension: 'Viability', value: score.viability.value },
    { dimension: 'Zeitgeist', value: score.zeitgeist_alignment.value },
    { dimension: 'Generative', value: score.generative_potential.value }
  ];

  return (
    <div className="card radar">
      <div className="radar-header">
        <h3 className="section-title">Quality Radar</h3>
        <span className="accent">Composite {score.composite.toFixed(2)}</span>
      </div>
      <div className="radar-chart">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="80%">
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis dataKey="dimension" stroke="#94a3b8" />
            <PolarRadiusAxis angle={30} domain={[0, 1]} tick={{ fill: '#94a3b8' }} />
            <Radar dataKey="value" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
