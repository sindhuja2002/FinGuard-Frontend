'use client'

import { useEffect, useState } from 'react';
import { analyticsService, Analytics } from '@/lib/services/analytics';
import { categoryService, Category } from '@/lib/services/category';
import { AnalyticsCards } from '@/components/analytics/analytics-cards';
import { AnalyticsCharts } from '@/components/analytics/analytics-charts';
import { useToast } from '@/hooks/use-toast';
import { RecentTransactions } from '@/components/transaction/recent-transactions';
import { Alerts } from '@/components/notifications/notication-alerts';
import { notificationsService } from '@/lib/services/notification';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [analyticsData, categoriesData, alertsData] = await Promise.all([
          analyticsService.getAnalytics(),
          categoryService.getCategories(),
          notificationsService.getNotifications(),
        ]);
        setAnalytics(analyticsData);
        setCategories(categoriesData);
        setAlerts(alertsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch analytics data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || !analytics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Alerts alerts={alerts} />

      <AnalyticsCards 
        totalExpenses={analytics.total_expenses}
        categoryExpenses={analytics.category_expenses}
        categories={categories}
      />

      <AnalyticsCharts 
        data={analytics}
        categories={categories}
      />

      <RecentTransactions />
    </div>
  );
}