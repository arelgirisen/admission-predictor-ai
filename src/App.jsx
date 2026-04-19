import React, { useMemo, useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { GraduationCap, Brain, BarChart3, Target, Award } from 'lucide-react'

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

function predict(base, profile) {
  let score = base
  score += (profile.gpa - 3.0) * 18
  score += (profile.sat - 1200) / 18
  score += (profile.ielts - 6.0) * 8
  score += profile.ec * 2.2
  score += profile.awards * 1.4
  if (profile.major === 'Computer Science') score -= 6
  return clamp(Math.round(score), 1, 99)
}

function scoreTier(value) {
  if (value >= 80) return 'Strong'
  if (value >= 60) return 'Competitive'
  if (value >= 40) return 'Reach'
  return 'Very Reach'
}

export default function App() {
  const [profile, setProfile] = useState({
    name: 'Arel',
    gpa: 3.82,
    sat: 1460,
    ielts: 7.5,
    ec: 8,
    awards: 5,
    major: 'Computer Science',
  })

  const schools = useMemo(() => {
    const list = [
      ['Georgia Tech', 32],
      ['UIUC', 42],
      ['Purdue', 52],
      ['University of Miami', 70],
      ['FIU', 82],
      ['Bocconi', 58],
    ]
    return list
      .map(([name, base]) => ({ name, chance: predict(base, profile) }))
      .sort((a, b) => b.chance - a.chance)
  }, [profile])

  const applicantScore = useMemo(() => {
    const val = (profile.gpa * 18 + profile.sat / 20 + profile.ielts * 8 + profile.ec * 4 + profile.awards * 3) / 3.2
    return clamp(Math.round(val), 1, 100)
  }, [profile])

  const radarData = [
    { metric: 'GPA', value: Math.round((profile.gpa / 4) * 100) },
    { metric: 'SAT', value: Math.round((profile.sat / 1600) * 100) },
    { metric: 'IELTS', value: Math.round((profile.ielts / 9) * 100) },
    { metric: 'ECs', value: profile.ec * 10 },
    { metric: 'Awards', value: profile.awards * 10 },
  ]

  const topSchool = schools[0]
  const improvementArea = profile.ec < 7 ? 'Extracurricular leadership' : profile.awards < 6 ? 'Awards and distinctions' : 'Application storytelling'

  return (
    <div className="page">
      <div className="container">
        <header className="hero">
          <div>
            <div className="pill">Portfolio Project</div>
            <h1>Admission Predictor AI</h1>
            <p>
              A hybrid admissions intelligence dashboard that estimates university acceptance chances using academic and extracurricular inputs.
            </p>
          </div>
          <div className="hero-card">
            <div className="hero-score-label">Applicant Score</div>
            <div className="hero-score">{applicantScore}</div>
            <div className="hero-score-sub">Overall profile strength</div>
          </div>
        </header>

        <main className="grid-layout">
          <section className="card form-card">
            <div className="card-title"><GraduationCap size={18} /> Applicant Profile</div>

            <label>
              <span>Name</span>
              <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </label>

            <label>
              <span>Intended Major</span>
              <select value={profile.major} onChange={(e) => setProfile({ ...profile, major: e.target.value })}>
                <option>Computer Science</option>
                <option>Data Science</option>
                <option>Mathematics</option>
                <option>Economics</option>
                <option>Engineering</option>
              </select>
            </label>

            <RangeField label="GPA" min={2.5} max={4.0} step={0.01} value={profile.gpa} onChange={(v) => setProfile({ ...profile, gpa: v })} />
            <RangeField label="SAT" min={1000} max={1600} step={10} value={profile.sat} onChange={(v) => setProfile({ ...profile, sat: v })} />
            <RangeField label="IELTS" min={5.5} max={9} step={0.5} value={profile.ielts} onChange={(v) => setProfile({ ...profile, ielts: v })} />
            <RangeField label="Extracurricular Strength" min={0} max={10} step={1} value={profile.ec} onChange={(v) => setProfile({ ...profile, ec: v })} suffix="/10" />
            <RangeField label="Awards" min={0} max={10} step={1} value={profile.awards} onChange={(v) => setProfile({ ...profile, awards: v })} suffix="/10" />
          </section>

          <section className="dashboard">
            <div className="stats-grid">
              <div className="card stat-card">
                <div className="card-title"><Brain size={18} /> Strongest Area</div>
                <div className="stat-value">Academics</div>
                <p>SAT + GPA profile is highly competitive.</p>
              </div>
              <div className="card stat-card">
                <div className="card-title"><Target size={18} /> Improvement Focus</div>
                <div className="stat-value">{improvementArea}</div>
                <p>Small improvements here can raise reach-school odds.</p>
              </div>
              <div className="card stat-card">
                <div className="card-title"><Award size={18} /> Best Current Match</div>
                <div className="stat-value">{topSchool.name}</div>
                <p>{topSchool.chance}% predicted chance · {scoreTier(topSchool.chance)}</p>
              </div>
            </div>

            <div className="charts-grid">
              <div className="card chart-card">
                <div className="card-title"><BarChart3 size={18} /> Profile Shape</div>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar dataKey="value" fillOpacity={0.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card chart-card">
                <div className="card-title"><Award size={18} /> Predicted Chances</div>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={schools} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="name" width={120} />
                      <Tooltip />
                      <Bar dataKey="chance" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="card results-card">
              <div className="card-title"><GraduationCap size={18} /> Admissions Results</div>
              <div className="results-list">
                {schools.map((school, index) => (
                  <div className="result-row" key={school.name}>
                    <div className="result-left">
                      <div className="rank-badge">#{index + 1}</div>
                      <div>
                        <div className="result-name">{school.name}</div>
                        <div className="result-tier">{scoreTier(school.chance)}</div>
                      </div>
                    </div>
                    <div className="result-right">
                      <div className="result-percent">{school.chance}%</div>
                      <div className="mini-bar"><span style={{ width: `${school.chance}%` }} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

function RangeField({ label, min, max, step, value, onChange, suffix = '' }) {
  return (
    <div className="range-field">
      <div className="range-head">
        <span>{label}</span>
        <strong>{value}{suffix}</strong>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  )
}
