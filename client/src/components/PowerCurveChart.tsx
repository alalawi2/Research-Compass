import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PowerCurveChartProps {
  testType: string;
  alpha: number;
  effectSize: number;
  calculatedSampleSize: number;
}

export function PowerCurveChart({ testType, alpha, effectSize, calculatedSampleSize }: PowerCurveChartProps) {
  // Generate power curve data
  const generatePowerCurve = () => {
    const data = [];
    const maxN = Math.ceil(calculatedSampleSize * 2);
    const step = Math.max(5, Math.floor(maxN / 20));

    for (let n = 10; n <= maxN; n += step) {
      // Simplified power calculation (approximation)
      // Real power depends on test type, but this gives a general curve
      const ncp = effectSize * Math.sqrt(n / 2); // Non-centrality parameter approximation
      const power = 1 - Math.exp(-Math.pow(ncp, 2) / 2) * (1 - alpha);
      const clampedPower = Math.min(0.999, Math.max(0.05, power));

      data.push({
        sampleSize: n,
        power: clampedPower,
      });
    }

    return data;
  };

  const data = generatePowerCurve();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistical Power Curve</CardTitle>
        <CardDescription>
          Relationship between sample size and statistical power for {testType}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="sampleSize" 
              label={{ value: 'Sample Size (n)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Statistical Power', angle: -90, position: 'insideLeft' }}
              domain={[0, 1]}
              ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
            />
            <Tooltip 
              formatter={(value: number) => [(value * 100).toFixed(1) + '%', 'Power']}
              labelFormatter={(label) => `Sample Size: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="power" 
              stroke="#2563eb" 
              strokeWidth={2}
              dot={false}
              name="Power"
            />
            {/* Reference line at 0.8 power */}
            <Line 
              type="monotone" 
              dataKey={() => 0.8} 
              stroke="#dc2626" 
              strokeDasharray="5 5"
              dot={false}
              name="Target Power (80%)"
            />
            {/* Vertical line at calculated sample size */}
            {data.map((point, idx) => {
              if (Math.abs(point.sampleSize - calculatedSampleSize) < 10) {
                return (
                  <Line 
                    key={idx}
                    type="monotone" 
                    dataKey={() => point.power} 
                    stroke="#16a34a" 
                    strokeDasharray="3 3"
                    dot={false}
                    name={`Calculated n=${calculatedSampleSize}`}
                  />
                );
              }
              return null;
            })}
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-semibold text-primary">Effect Size</div>
            <div className="text-2xl font-bold">{effectSize.toFixed(2)}</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-semibold text-primary">Alpha Level</div>
            <div className="text-2xl font-bold">{alpha.toFixed(3)}</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-semibold text-primary">Required n</div>
            <div className="text-2xl font-bold">{calculatedSampleSize}</div>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            <strong>Interpretation:</strong> The curve shows how statistical power increases with sample size. 
            The red dashed line represents the conventional 80% power threshold. The calculated sample size 
            (n={calculatedSampleSize}) achieves at least 80% power for detecting an effect size of {effectSize.toFixed(2)} 
            at α={alpha}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
