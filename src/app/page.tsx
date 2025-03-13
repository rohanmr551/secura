'use client';
import { useState, useRef, useEffect, forwardRef } from "react";
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import styles from '@/styles/Home.module.css';
import { PieChart, Pie, Cell } from 'recharts';

const ForwardedPieChart = forwardRef<SVGSVGElement, any>((props, ref) => (
  <PieChart {...props} ref={ref} />
));

export default function Home() {
  const [showGraph, setShowGraph] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showDetailedSurvey, setShowDetailedSurvey] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const data = [
    { name: "Technical Controls", value: 100, color: "#dc2626" }, 
    { name: "Data Security", value: 100, color: "#f87171" }, 
    { name: "Access Control", value: 100, color: "#fca5a5" }, 
    { name: "Governance", value: 100, color: "#fee2e2" }  
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowGraph(true);
    setShowDetailedSurvey(true); // Show Detailed Survey button after submit
  };

  useEffect(() => {
    if (showGraph) {
      setTimeout(convertSvgToImage, 1000); 
    }
  }, [showGraph]);

  const convertSvgToImage = () => {
    if (svgRef.current) {
      const svg = new XMLSerializer().serializeToString(svgRef.current);
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    }
  };

const renderCustomLabel = ({ cx, cy, outerRadius, name, index }: { 
  cx: number; 
  cy: number; 
  outerRadius: number; 
  name: string; 
  index: number; 
}) => {
  const labelOffsetX = 75;
  const labelOffsetY = 25;
  
  const ringRadii = [80, 70, 65, 50];
  const currentRadius = ringRadii[index];
  
  const y = cy - currentRadius + (index * labelOffsetY);
  const x = cx + currentRadius + labelOffsetX;

  return (
    <g>
      <line 
        x1={cx + currentRadius} 
        y1={y} 
        x2={x} 
        y2={y} 
        stroke="#000" 
        strokeWidth={1} 
      />
      <text 
        x={x} 
        y={y} 
        textAnchor="start" 
        fill="#000" 
        fontSize={10}
      >
        {name}
      </text>
    </g>
  );
};

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.mainContainer}>
        <Topbar />
        <div className={styles.contentLayout}>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            {[ 
              { title: "Products offered", options: ["Software services", "Financial services", "Healthcare", "Retail", "Manufacturing", "Other"] },
              { title: "Customers", options: ["B2B", "B2C", "B2G", "In-house", "Mixed (B2B and B2C)", "Other"] },
              { title: "Industry", options: ["Technology & Software", "Finance & Banking", "Healthcare & Biotech", "Retail & E-commerce", "Education", "Other"] },
              { title: "Sensitive data that you handle", options: ["Customer data - PII", "Financial Data", "Healthcare Data", "Intellectual Property", "Employee Data", "Other"] },
              { title: "Geography", options: ["North America", "Europe", "Asia", "South America", "Africa", "Australia"] }
            ].map(({ title, options }, index) => (
              <div key={index} className={styles.box}>
                <Dropdown title={title} options={options} />
              </div>
            ))}

            {!showDetailedSurvey && (
              <div className={styles.submitContainer}>
                <Button type="submit">Submit</Button>
              </div>
            )}

            {showDetailedSurvey && (
              <div className={styles.submitContainer}>
                <Button type="button">Detailed Survey</Button>
              </div>
            )}
          </form>

          <div className={styles.graphSection}>
            {showGraph && !imageUrl ? (
              <div className={styles.graphContainer}>
<ForwardedPieChart width={500} height={300} ref={svgRef}>
  {[120, 90, 60, 30].map((radius, index) => (
    <Pie 
      key={index} 
      data={[data[index]]} 
      cx={250} 
      cy={150} 
      startAngle={180} 
      endAngle={0} 
      outerRadius={radius} 
      innerRadius={radius - 50} 
      dataKey="value"
      label={(entry) => renderCustomLabel({ 
        ...entry, 
        index,
        outerRadius: radius 
      })}
      labelLine={false}
      isAnimationActive={false} 
    >
      <Cell fill={data[index].color} />
    </Pie>
  ))}
</ForwardedPieChart>
              </div>
            ) : imageUrl ? (
              <img src={imageUrl} alt="Pie Chart" className={styles.graphImage} />
            ) : (
              <div className={styles.placeholderGraph}></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}