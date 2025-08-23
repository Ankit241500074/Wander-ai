import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  MapPin, 
  Settings, 
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Download,
  Compass
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@shared/auth';

interface AdminStats {
  totalUsers: number;
  totalItineraries: number;
  totalRevenue: number;
  activeUsers: number;
}

interface ItineraryStats {
  id: string;
  destination: string;
  user: string;
  createdAt: string;
  budget: number;
  days: number;
  status: 'completed' | 'in-progress' | 'draft';
}

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Settings form state
  const [settings, setSettings] = useState({
    defaultCurrency: 'INR',
    apiRateLimit: '1000/hour',
    smtpServer: 'smtp.wanderai.com',
    fromEmail: 'noreply@wanderai.com'
  });

  // Mock data - in production this would come from APIs
  const [stats] = useState<AdminStats>({
    totalUsers: 1247,
    totalItineraries: 3856,
    totalRevenue: 124500,
    activeUsers: 342
  });

  const [itineraries] = useState<ItineraryStats[]>([
    {
      id: '1',
      destination: 'Paris, France',
      user: 'john@example.com',
      createdAt: '2024-01-15',
      budget: 1500,
      days: 5,
      status: 'completed'
    },
    {
      id: '2',
      destination: 'Tokyo, Japan',
      user: 'sarah@example.com',
      createdAt: '2024-01-14',
      budget: 2200,
      days: 7,
      status: 'completed'
    },
    {
      id: '3',
      destination: 'Mumbai, India',
      user: 'demo@example.com',
      createdAt: '2024-01-13',
      budget: 800,
      days: 4,
      status: 'in-progress'
    }
  ]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiSettings = () => {
    // In a real app, this would make an API call to save settings
    console.log('Saving API settings:', {
      defaultCurrency: settings.defaultCurrency,
      apiRateLimit: settings.apiRateLimit
    });
    // Show success message or handle response
  };

  const handleSaveEmailSettings = () => {
    // In a real app, this would make an API call to save settings
    console.log('Saving email settings:', {
      smtpServer: settings.smtpServer,
      fromEmail: settings.fromEmail
    });
    // Show success message or handle response
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-blue-100/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="bg-primary rounded-lg p-2">
                    <Compass className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      WanderAI Admin
                    </h1>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/api-status">
                  <Button variant="outline" size="sm">
                    API Status
                  </Button>
                </Link>
                <Link to="/api-setup">
                  <Button variant="outline" size="sm" className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100">
                    Setup Guide
                  </Button>
                </Link>
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">Admin</Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Itineraries Created</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalItineraries.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue (INR)</p>
                    <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-100 rounded-full p-3">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
                  </div>
                  <div className="bg-orange-100 rounded-full p-3">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>User Management</CardTitle>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add User
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading users...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Joined</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <div>
                                  <div className="font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-600">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Itineraries Tab */}
            <TabsContent value="itineraries">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Itinerary Management</CardTitle>
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Destination</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Budget (INR)</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Days</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itineraries.map((itinerary) => (
                          <tr key={itinerary.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4 font-medium text-gray-900">{itinerary.destination}</td>
                            <td className="py-4 px-4 text-sm text-gray-600">{itinerary.user}</td>
                            <td className="py-4 px-4 text-sm text-gray-600">₹{itinerary.budget.toLocaleString()}</td>
                            <td className="py-4 px-4 text-sm text-gray-600">{itinerary.days}</td>
                            <td className="py-4 px-4">
                              <Badge className={getStatusColor(itinerary.status)}>
                                {itinerary.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {new Date(itinerary.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Destinations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['Paris, France', 'Tokyo, Japan', 'Mumbai, India', 'London, UK', 'Dubai, UAE'].map((destination, index) => (
                        <div key={destination} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{destination}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${100 - index * 15}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{100 - index * 15}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Analytics charts would be implemented here</p>
                      <p className="text-sm text-gray-500 mt-2">Integration with charting library needed</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">API Configuration</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Default Currency</label>
                              <Input
                                value={settings.defaultCurrency}
                                onChange={(e) => setSettings(prev => ({ ...prev, defaultCurrency: e.target.value }))}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">API Rate Limit</label>
                              <Input
                                value={settings.apiRateLimit}
                                onChange={(e) => setSettings(prev => ({ ...prev, apiRateLimit: e.target.value }))}
                                className="mt-1"
                              />
                            </div>
                            <Button onClick={handleSaveApiSettings}>Save Changes</Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Email Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">SMTP Server</label>
                              <Input
                                value={settings.smtpServer}
                                onChange={(e) => setSettings(prev => ({ ...prev, smtpServer: e.target.value }))}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">From Email</label>
                              <Input
                                value={settings.fromEmail}
                                onChange={(e) => setSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                                className="mt-1"
                              />
                            </div>
                            <Button onClick={handleSaveEmailSettings}>Update Settings</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
}
