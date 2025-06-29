import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sprout, Leaf, FlaskConical, Bug, Cloudy, AreaChart, Camera, Landmark } from 'lucide-react';

const features = [
  {
    title: 'AI Crop Advisor',
    description: 'Get recommendations for crops suitable for your farm.',
    href: '/crop-advisor',
    icon: Leaf,
  },
  {
    title: 'Fertilizer & Soil AI',
    description: 'Get advice on fertilizers and soil health.',
    href: '/fertilizer-soil',
    icon: FlaskConical,
  },
  {
    title: 'Pest & Disease AI',
    description: 'Identify threats and get preventative tips.',
    href: '/pest-disease',
    icon: Bug,
  },
  {
    title: 'Weather Watch',
    description: 'Receive weather alerts tailored for your crops.',
    href: '/weather-watch',
    icon: Cloudy,
  },
  {
    title: 'Market & Yield Forecast',
    description: 'Estimate crop yield and get market advice.',
    href: '/market-yield',
    icon: AreaChart,
  },
  {
    title: 'Plant Disease Detection',
    description: 'Upload an image to diagnose plant diseases.',
    href: '/disease-detection',
    icon: Camera,
  },
  {
    title: 'Govt. Schemes Advisor',
    description: 'Find relevant government subsidy schemes.',
    href: '/govt-schemes',
    icon: Landmark,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-6 rounded-lg bg-card border shadow-sm">
        <div className="flex items-center gap-4">
          <Sprout className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-primary font-headline">
              Welcome to AgriMitraAI
            </h1>
            <p className="text-muted-foreground">
              Your AI-powered farming companion for a richer harvest. Select a feature below to get started.
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.href} className="flex">
            <Card className="hover:border-primary hover:bg-primary/5 transition-all w-full flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <feature.icon className="w-8 h-8 text-primary" />
                <CardTitle className="font-headline">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
