import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
    ArrowRight,
    Car,
    Clock,
    Coins,
    MapPin,
    Search,
    Shield,
    Smartphone,
    Star,
    TrendingUp,
    Users
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: MapPin,
      title: "Real-time Parking Finder",
      description: "Find available parking spots near you with live availability updates"
    },
    {
      icon: Coins,
      title: "Earn Rewards",
      description: "Get coins for every parking visit and redeem them for benefits"
    },
    {
      icon: Shield,
      title: "Secure Check-ins",
      description: "GPS-verified check-ins ensure accurate parking visit tracking"
    },
    {
      icon: Clock,
      title: "24/7 Monitoring",
      description: "Round-the-clock parking space monitoring with AI-powered systems"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Optimized mobile experience for on-the-go parking management"
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Comprehensive insights for parking lot owners and administrators"
    }
  ];

  const stats = [
    { label: "Active Parking Lots", value: "500+", icon: Car },
    { label: "Daily Users", value: "10K+", icon: Users },
    { label: "Cities Covered", value: "25+", icon: MapPin },
    { label: "Coins Distributed", value: "1M+", icon: Coins }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">Smart Parking</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/search" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Find Parking
            </Link>
            <Link to="/map" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Interactive Map
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              How it Works
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">
              🚀 Advanced Parking Management System
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Smart Parking Made Simple
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find, book, and manage parking spaces with real-time availability, 
              GPS verification, and reward systems. The future of urban parking is here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                    <MapPin className="mr-2 h-5 w-5" />
                    View Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                    <Search className="mr-2 h-5 w-5" />
                    Find Parking Now
                  </Button>
                </Link>
              )}
              
              <Link to="/map">
                <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5">
                  <MapPin className="mr-2 h-5 w-5" />
                  Interactive Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Smart Parking
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From finding parking to managing facilities, our platform provides 
              comprehensive solutions for all your parking needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth bg-gradient-card border-border/50">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Smart Parking Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to revolutionize your parking experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground font-bold text-xl">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold">Find & Search</h3>
              <p className="text-muted-foreground">
                Use our smart search to find available parking spots near your location with real-time updates.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground font-bold text-xl">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold">Check-in & Park</h3>
              <p className="text-muted-foreground">
                GPS-verified check-ins ensure you're at the right location and automatically track your visit.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground font-bold text-xl">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold">Earn Rewards</h3>
              <p className="text-muted-foreground">
                Get coins for every verified parking visit and redeem them for discounts and benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-hero text-primary-foreground shadow-glow border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Parking Experience?
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Join thousands of users who have already discovered the convenience 
                of smart parking management.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg" variant="secondary" className="shadow-card">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button size="lg" variant="secondary" className="shadow-card">
                      <Star className="mr-2 h-5 w-5" />
                      Start Free Today
                    </Button>
                  </Link>
                )}
                
                <Link to="/search">
                  <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Explore Features
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gradient-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                  <Car className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold">Smart Parking</h3>
              </div>
              <p className="text-muted-foreground">
                Revolutionizing urban parking with smart technology and user-centric design.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/search" className="hover:text-foreground">Find Parking</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
                <li><Link to="/rewards" className="hover:text-foreground">Rewards</Link></li>
                <li><Link to="/analytics" className="hover:text-foreground">Analytics</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/help" className="hover:text-foreground">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-foreground">Contact Us</Link></li>
                <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
                <li><Link to="/status" className="hover:text-foreground">System Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-foreground">Careers</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Smart Parking System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};