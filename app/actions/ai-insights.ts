// app/actions/ai-insights.ts
'use server'

import { db } from "@/lib/db";
import { sales, products, customers } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, and, gte, sql } from "drizzle-orm";

interface AIInsight {
  type: 'stat' | 'chart' | 'list' | 'text';
  title: string;
  data: unknown;
  insight: string;
}

function getDateRange(days: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
}

export async function getAIInsights(query: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };
  
  const businessId = session.user.businessId;
  const lowerQuery = query.toLowerCase();
  
  const insights: AIInsight[] = [];
  
  try {
    if (lowerQuery.includes('revenue') || lowerQuery.includes('sales')) {
      const { start: weekStart } = getDateRange(7);
      const { start: monthStart } = getDateRange(30);
      const { start: quarterStart } = getDateRange(90);
      
      const weekSales = await db.query.sales.findMany({
        where: and(eq(sales.businessId, businessId), gte(sales.createdAt, weekStart)),
      });
      const monthSales = await db.query.sales.findMany({
        where: and(eq(sales.businessId, businessId), gte(sales.createdAt, monthStart)),
      });
      const quarterSales = await db.query.sales.findMany({
        where: and(eq(sales.businessId, businessId), gte(sales.createdAt, quarterStart)),
      });
      
      const weekRevenue = weekSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
      const monthRevenue = monthSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
      const quarterRevenue = quarterSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
      
      insights.push({
        type: 'stat',
        title: 'Revenue Analysis',
        data: { week: weekRevenue, month: monthRevenue, quarter: quarterRevenue },
        insight: `Your revenue is ৳${monthRevenue.toFixed(2)} this month. ${weekRevenue > 0 ? `This week's revenue is ৳${weekRevenue.toFixed(2)}, showing ${((weekRevenue / monthRevenue) * 100).toFixed(1)}% of monthly revenue.` : 'No revenue recorded this week yet.'}`
      });
    }
    
    if (lowerQuery.includes('product') || lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
      const allProducts = await db.query.products.findMany({
        where: eq(products.businessId, businessId),
        orderBy: [desc(products.createdAt)],
      });
      
      const lowStock = allProducts.filter(p => p.stockQty <= p.lowStockThreshold);
      const outOfStock = allProducts.filter(p => p.stockQty === 0);
      const totalValue = allProducts.reduce((acc, p) => acc + (Number(p.costPrice) * p.stockQty), 0);
      
      insights.push({
        type: 'list',
        title: 'Inventory Status',
        data: { total: allProducts.length, lowStock, outOfStock, totalValue },
        insight: `You have ${allProducts.length} products. ${lowStock.length} items are running low on stock${outOfStock.length > 0 ? `, and ${outOfStock.length} are out of stock` : ''}. Total inventory value is ৳${totalValue.toFixed(2)}.`
      });
      
      if (outOfStock.length > 0) {
        insights.push({
          type: 'text',
          title: 'Urgent: Out of Stock',
          data: outOfStock.map(p => p.name),
          insight: `These products need immediate restocking: ${outOfStock.map(p => p.name).join(', ')}`
        });
      }
    }
    
    if (lowerQuery.includes('customer') || lowerQuery.includes('buyer')) {
      const allCustomers = await db.query.customers.findMany({
        where: eq(customers.businessId, businessId),
        orderBy: [desc(customers.totalSpent)],
      });
      
      const totalCustomers = allCustomers.length;
      const totalSpent = allCustomers.reduce((acc, c) => acc + Number(c.totalSpent), 0);
      const topCustomers = allCustomers.slice(0, 5);
      const avgSpent = totalCustomers > 0 ? totalSpent / totalCustomers : 0;
      
      insights.push({
        type: 'list',
        title: 'Customer Insights',
        data: { totalCustomers, avgSpent, topCustomers },
        insight: `You have ${totalCustomers} customers. Average customer spend is ৳${avgSpent.toFixed(2)}. ${topCustomers.length > 0 ? `Top customer: ${topCustomers[0].name} with ৳${Number(topCustomers[0].totalSpent).toFixed(2)} total spent.` : ''}`
      });
    }
    
    if (lowerQuery.includes('profit') || lowerQuery.includes('margin')) {
      const { start: monthStart } = getDateRange(30);
      const monthSales = await db.query.sales.findMany({
        where: and(eq(sales.businessId, businessId), gte(sales.createdAt, monthStart)),
      });
      
      const totalRevenue = monthSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
      const totalProfit = monthSales.reduce((acc, s) => acc + Number(s.profit), 0);
      const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
      
      insights.push({
        type: 'stat',
        title: 'Profit Analysis',
        data: { revenue: totalRevenue, profit: totalProfit, margin: profitMargin },
        insight: `This month's profit is ৳${totalProfit.toFixed(2)} with a ${profitMargin.toFixed(1)}% margin. ${profitMargin > 30 ? 'Great profit margin!' : profitMargin > 15 ? 'Healthy profit margin.' : 'Consider reviewing your pricing strategy.'}`
      });
    }
    
    if (lowerQuery.includes('trend') || lowerQuery.includes('comparison')) {
      const { start: weekStart } = getDateRange(7);
      const { start: prevWeekStart } = getDateRange(14);
      prevWeekStart.setDate(prevWeekStart.getDate() - 7);
      
      const weekSales = await db.query.sales.findMany({
        where: and(eq(sales.businessId, businessId), gte(sales.createdAt, weekStart)),
      });
      const prevWeekSales = await db.query.sales.findMany({
        where: and(
          eq(sales.businessId, businessId),
          gte(sales.createdAt, prevWeekStart),
          sql`${sales.createdAt} < ${weekStart}`
        ),
      });
      
      const weekRevenue = weekSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
      const prevWeekRevenue = prevWeekSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
      const change = prevWeekRevenue > 0 ? ((weekRevenue - prevWeekRevenue) / prevWeekRevenue) * 100 : 0;
      
      insights.push({
        type: 'stat',
        title: 'Week-over-Week Comparison',
        data: { currentWeek: weekRevenue, previousWeek: prevWeekRevenue, change },
        insight: `Revenue ${change >= 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}% compared to last week. ${change >= 0 ? 'Keep up the good work!' : 'Consider promotions to boost sales.'}`
      });
    }
    
    if (insights.length === 0) {
      insights.push({
        type: 'text',
        title: 'General Overview',
        data: null,
        insight: 'Try asking about: revenue, sales, products, inventory, stock, customers, profit, margins, or trends. I can provide insights on any of these topics.'
      });
    }
    
    return { success: true, insights };
  } catch (error) {
    console.error('AI Insights Error:', error);
    return { error: 'Failed to generate insights' };
  }
}
