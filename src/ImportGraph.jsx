import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function ImportGraph({ pending, imported, invalid }) {

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", () => setWidth(window.innerWidth));
    })

    const data = [
        { name: 'imported', value: imported },
        { name: 'invalid', value: invalid },
        { name: 'existing', value: pending - imported - invalid },
    ];

    const COLORS = ["var(--stats-green)", "var(--stats-red)", "var(--stats-yellow)"];

    return (
        <ResponsiveContainer height={width >= 600 ? 220 : 132}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={width >= 600 ? 100 : 60}
                    isAnimationActive={false}
                    stroke="var(--font)"
                    strokeWidth="2"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}

export default ImportGraph