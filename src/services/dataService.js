// Mock data service - Replace with actual API calls
class DataService {
  // Simulate API delay
  delay = () => new Promise(resolve => setTimeout(resolve, 300));

  async getDashboardStats() {
    await this.delay();
    return {
      totalFeedback: 2547,
      averageRating: 4.6,
      sentimentScore: 0.78,
      activeDrivers: 156,
      weeklyTrend: 12.5,
      monthlyGrowth: 8.3,
    };
  }

  async getDrivers(limit) {
    await this.delay();
    const drivers = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 123-4567',
        totalTrips: 847,
        rating: 4.9,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        joinDate: '2022-01-15',
        status: 'active',
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '+1 (555) 234-5678',
        totalTrips: 623,
        rating: 4.7,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        joinDate: '2022-03-22',
        status: 'active',
      },
      {
        id: '3',
        name: 'Emma Rodriguez',
        email: 'emma.r@email.com',
        phone: '+1 (555) 345-6789',
        totalTrips: 512,
        rating: 4.5,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        joinDate: '2022-06-10',
        status: 'active',
      },
      {
        id: '4',
        name: 'David Kim',
        email: 'david.kim@email.com',
        phone: '+1 (555) 456-7890',
        totalTrips: 421,
        rating: 4.2,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        joinDate: '2022-09-05',
        status: 'active',
      },
      {
        id: '5',
        name: 'Lisa Wang',
        email: 'lisa.w@email.com',
        phone: '+1 (555) 567-8901',
        totalTrips: 356,
        rating: 4.8,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        joinDate: '2023-01-12',
        status: 'active',
      },
    ];
    return limit ? drivers.slice(0, limit) : drivers;
  }

  async getFeedback(limit) {
    await this.delay();
    const feedback = [
      {
        id: '1',
        driverId: '1',
        passengerId: 'p1',
        rating: 5,
        comment: 'Excellent service! Driver was professional and courteous.',
        category: 'safety',
        sentiment: 'positive',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isPinned: true,
      },
      {
        id: '2',
        driverId: '2',
        passengerId: 'p2',
        rating: 4,
        comment: 'Good experience overall. A bit of traffic congestion.',
        category: 'communication',
        sentiment: 'positive',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        driverId: '3',
        passengerId: 'p3',
        rating: 3,
        comment: 'Car was not very clean. Driver was nice though.',
        category: 'cleanliness',
        sentiment: 'neutral',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        driverId: '4',
        passengerId: 'p4',
        rating: 2,
        comment: 'Driver seemed distracted and was on the phone.',
        category: 'driving',
        sentiment: 'negative',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        driverId: '5',
        passengerId: 'p5',
        rating: 5,
        comment: 'Amazing drive! Very comfortable and smooth.',
        category: 'comfort',
        sentiment: 'positive',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isPinned: true,
      },
    ];
    return limit ? feedback.slice(0, limit) : feedback;
  }

  async getSentimentTrend() {
    await this.delay();
    return [
      { date: 'Mon', positive: 240, neutral: 120, negative: 30, total: 390 },
      { date: 'Tue', positive: 290, neutral: 100, negative: 40, total: 430 },
      { date: 'Wed', positive: 320, neutral: 90, negative: 35, total: 445 },
      { date: 'Thu', positive: 280, neutral: 140, negative: 45, total: 465 },
      { date: 'Fri', positive: 350, neutral: 110, negative: 30, total: 490 },
      { date: 'Sat', positive: 380, neutral: 130, negative: 25, total: 535 },
      { date: 'Sun', positive: 360, neutral: 125, negative: 35, total: 520 },
    ];
  }

  async getDriverPerformance() {
    await this.delay();
    return [
      {
        driverId: '1',
        driverName: 'Sarah Johnson',
        averageRating: 4.9,
        totalFeedback: 156,
        sentiment: { positive: 148, neutral: 6, negative: 2 },
        topStrengths: ['Safety', 'Communication', 'Comfort'],
        areasForImprovement: [],
        month: 'February 2026',
      },
      {
        driverId: '2',
        driverName: 'Mike Chen',
        averageRating: 4.7,
        totalFeedback: 124,
        sentiment: { positive: 115, neutral: 7, negative: 2 },
        topStrengths: ['Professionalism', 'Cleanliness', 'Safety'],
        areasForImprovement: ['Communication'],
        month: 'February 2026',
      },
      {
        driverId: '3',
        driverName: 'Emma Rodriguez',
        averageRating: 4.5,
        totalFeedback: 98,
        sentiment: { positive: 85, neutral: 10, negative: 3 },
        topStrengths: ['Communication', 'Comfort'],
        areasForImprovement: ['Cleanliness'],
        month: 'February 2026',
      },
    ];
  }

  async getCategoryMetrics() {
    await this.delay();
    return [
      {
        category: 'Safety',
        score: 4.8,
        feedbackCount: 567,
        trend: 2.3,
        icon: 'shield-check',
      },
      {
        category: 'Cleanliness',
        score: 4.3,
        feedbackCount: 423,
        trend: 1.2,
        icon: 'sparkles',
      },
      {
        category: 'Communication',
        score: 4.6,
        feedbackCount: 389,
        trend: 3.1,
        icon: 'message-circle',
      },
      {
        category: 'Driving',
        score: 4.5,
        feedbackCount: 512,
        trend: -0.5,
        icon: 'steering-wheel',
      },
      {
        category: 'Comfort',
        score: 4.4,
        feedbackCount: 456,
        trend: 1.8,
        icon: 'armchair',
      },
    ];
  }
}

export const dataService = new DataService();
