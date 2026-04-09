// app/actions/ai-insights.ts
'use server'

import { db } from "@/lib/db";
import { sales, products, customers } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, and, gte } from "drizzle-orm";

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

async function getBusinessContext(businessId: string) {
  const { start: weekStart } = getDateRange(7);
  const { start: monthStart } = getDateRange(30);
  const { start: quarterStart } = getDateRange(90);

  const [weekSales, monthSales, quarterSales, allSales, allProducts, allCustomers] = await Promise.all([
    db.query.sales.findMany({
      where: and(eq(sales.businessId, businessId), gte(sales.createdAt, weekStart)),
    }),
    db.query.sales.findMany({
      where: and(eq(sales.businessId, businessId), gte(sales.createdAt, monthStart)),
    }),
    db.query.sales.findMany({
      where: and(eq(sales.businessId, businessId), gte(sales.createdAt, quarterStart)),
    }),
    db.query.sales.findMany({
      where: eq(sales.businessId, businessId),
      with: { items: { with: { product: true } } },
      orderBy: [desc(sales.createdAt)],
    }),
    db.query.products.findMany({
      where: eq(products.businessId, businessId),
      orderBy: [desc(products.createdAt)],
    }),
    db.query.customers.findMany({
      where: eq(customers.businessId, businessId),
      orderBy: [desc(customers.totalSpent)],
    }),
  ]);

  const weekRevenue = weekSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
  const monthRevenue = monthSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
  const quarterRevenue = quarterSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
  const yearRevenue = allSales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
  const totalProfit = allSales.reduce((acc, s) => acc + Number(s.profit), 0);

  const lowStock = allProducts.filter(p => p.stockQty <= p.lowStockThreshold);
  const outOfStock = allProducts.filter(p => p.stockQty === 0);
  const totalInventoryValue = allProducts.reduce((acc, p) => acc + (Number(p.costPrice) * p.stockQty), 0);

  const topCustomers = allCustomers.slice(0, 5);
  const avgCustomerSpent = allCustomers.length > 0 
    ? allCustomers.reduce((acc, c) => acc + Number(c.totalSpent), 0) / allCustomers.length 
    : 0;

  const categoryMap: Record<string, number> = {};
  allSales.forEach((sale) => {
    sale.items.forEach((item) => {
      const category = item.product?.category || 'Uncategorized';
      categoryMap[category] = (categoryMap[category] || 0) + Number(item.subtotal);
    });
  });

  const productMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  allSales.forEach((sale) => {
    sale.items.forEach((item) => {
      const productName = item.product?.name || 'Unknown';
      if (!productMap[item.productId]) {
        productMap[item.productId] = { name: productName, qty: 0, revenue: 0 };
      }
      productMap[item.productId].qty += item.qty;
      productMap[item.productId].revenue += Number(item.subtotal);
    });
  });
  const topProducts = Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    sales: {
      weekRevenue,
      monthRevenue,
      quarterRevenue,
      yearRevenue,
      totalProfit,
      weekOrders: weekSales.length,
      monthOrders: monthSales.length,
      yearOrders: allSales.length,
      profitMargin: yearRevenue > 0 ? (totalProfit / yearRevenue) * 100 : 0,
    },
    products: {
      total: allProducts.length,
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      totalValue: totalInventoryValue,
      lowStockItems: lowStock.map(p => ({ name: p.name, stock: p.stockQty })),
      outOfStockItems: outOfStock.map(p => p.name),
    },
    customers: {
      total: allCustomers.length,
      avgSpent: avgCustomerSpent,
      topCustomers: topCustomers.map(c => ({ name: c.name, totalSpent: Number(c.totalSpent), orders: c.orderCount })),
    },
    categories: Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value),
    topProducts,
  };
}

async function getAIResponse(prompt: string, context: ReturnType<typeof getBusinessContext> extends Promise<infer T> ? T : never) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    return null;
  }

  const systemPrompt = `You are a helpful AI assistant for a sales and inventory management dashboard called SalesPulse. 
You have access to the user's business data and can provide insights about their sales, inventory, customers, and overall business performance.

Be concise, friendly, and actionable in your responses. Use the provided data to give specific recommendations.

Available data:
${JSON.stringify(context, null, 2)}

Respond in a helpful, conversational manner. If the user asks about something you don't have data for, politely let them know and suggest what they could ask about instead.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://salespulse.app",
        "X-Title": "SalesPulse",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-haiku",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter API error:", error);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error("OpenRouter fetch error:", error);
    return null;
  }
}

export async function getAIInsights(query: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };
  
  const businessId = session.user.businessId;
  
  try {
    const context = await getBusinessContext(businessId);
    
    const aiResponse = await getAIResponse(query, context);
    
    if (aiResponse) {
      return {
        success: true,
        insights: [{
          type: 'text',
          title: 'AI Analysis',
          data: null,
          insight: aiResponse,
        }],
      };
    }
    
    const insights: AIInsight[] = [];
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('revenue') || lowerQuery.includes('sales')) {
      insights.push({
        type: 'stat',
        title: 'Revenue Analysis',
        data: context.sales,
        insight: `Your revenue breakdown: ৳${context.sales.weekRevenue.toFixed(2)} this week, ৳${context.sales.monthRevenue.toFixed(2)} this month, and ৳${context.sales.yearRevenue.toFixed(2)} this year. You have ${context.sales.yearOrders} total orders with a ${context.sales.profitMargin.toFixed(1)}% profit margin.`
      });
    }
    
    if (lowerQuery.includes('product') || lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
      insights.push({
        type: 'list',
        title: 'Inventory Status',
        data: context.products,
        insight: `You have ${context.products.total} products worth ৳${context.products.totalValue.toFixed(2)}. ${context.products.lowStock > 0 ? `${context.products.lowStock} items are running low on stock.` : 'All items are well stocked.'} ${context.products.outOfStock > 0 ? `${context.products.outOfStock} items are out of stock and need restocking!` : ''}`
      });
      
      if (context.products.outOfStockItems.length > 0) {
        insights.push({
          type: 'text',
          title: 'Urgent: Out of Stock',
          data: context.products.outOfStockItems,
          insight: `These products need immediate restocking: ${context.products.outOfStockItems.join(', ')}`
        });
      }
    }
    
    if (lowerQuery.includes('customer') || lowerQuery.includes('buyer')) {
      insights.push({
        type: 'list',
        title: 'Customer Insights',
        data: context.customers,
        insight: `You have ${context.customers.total} customers with an average spend of ৳${context.customers.avgSpent.toFixed(2)}. ${context.customers.topCustomers.length > 0 ? `Top customer: ${context.customers.topCustomers[0].name} with ৳${context.customers.topCustomers[0].totalSpent.toFixed(2)} total spent across ${context.customers.topCustomers[0].orders} orders.` : ''}`
      });
    }
    
    if (lowerQuery.includes('profit') || lowerQuery.includes('margin')) {
      insights.push({
        type: 'stat',
        title: 'Profit Analysis',
        data: { revenue: context.sales.yearRevenue, profit: context.sales.totalProfit, margin: context.sales.profitMargin },
        insight: `Total profit this year: ৳${context.sales.totalProfit.toFixed(2)} with a ${context.sales.profitMargin.toFixed(1)}% margin. ${context.sales.profitMargin > 30 ? 'Excellent profit margin!' : context.sales.profitMargin > 15 ? 'Healthy profit margin.' : 'Consider reviewing your pricing strategy to improve margins.'}`
      });
    }
    
    if (lowerQuery.includes('category') || lowerQuery.includes('product breakdown')) {
      insights.push({
        type: 'list',
        title: 'Sales by Category',
        data: context.categories.slice(0, 5),
        insight: context.categories.length > 0 
          ? `Top categories by revenue: ${context.categories.slice(0, 3).map(c => `${c.name} (৳${c.value.toFixed(2)})`).join(', ')}`
          : 'No category data available yet.'
      });
    }
    
    if (lowerQuery.includes('top product') || lowerQuery.includes('best selling')) {
      insights.push({
        type: 'list',
        title: 'Top Products',
        data: context.topProducts,
        insight: context.topProducts.length > 0
          ? `Your best performers: ${context.topProducts.slice(0, 3).map(p => `${p.name} (${p.qty} sold, ৳${p.revenue.toFixed(2)})`).join(', ')}`
          : 'No sales data available yet.'
      });
    }
    
    if (insights.length === 0) {
      insights.push({
        type: 'text',
        title: 'Overview',
        data: context,
        insight: `Here's your business summary: Revenue this month is ৳${context.sales.monthRevenue.toFixed(2)} from ${context.sales.monthOrders} orders. You have ${context.products.total} products (${context.products.lowStock} low stock) and ${context.customers.total} customers. Ask me about revenue, inventory, customers, profit, or any specific metrics!`
      });
    }
    
    return { success: true, insights };
  } catch (error) {
    console.error('AI Insights Error:', error);
    return { error: 'Failed to generate insights' };
  }
}
