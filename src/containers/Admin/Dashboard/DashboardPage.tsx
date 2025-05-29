"use client"

import type React from "react"

import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { Fragment, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Cell, Pie, PieChart } from "recharts"
import OrdersChart from "../../../components/OrdersChart"
import RevenueChart from "../../../components/RevenueChart"
import { fetchOrderStatusCounts, fetchReports } from "../../../features/report/reportSlice"
import type { AppDispatch, RootState } from "../../../store"

const availableYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

// Modern color palette
const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"]

// Icons as SVG components for consistency
const Icons = {
  Calendar: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  ),
  Dollar: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  ShoppingCart: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  ),
  BarChart: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="3" height="10" x="3" y="10" rx="1" />
      <rect width="3" height="18" x="10" y="2" rx="1" />
      <rect width="3" height="14" x="17" y="6" rx="1" />
    </svg>
  ),
  Package: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 16 2 2 4-4" />
      <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
      <path d="M16.5 9.4 7.55 4.24" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" x2="12" y1="22" y2="12" />
    </svg>
  ),
  TrendingUp: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Check: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
}

// Status icons mapping
const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <Icons.Package />,
  PROCESSING: <Icons.TrendingUp />,
  SHIPPED: <Icons.ShoppingCart />,
  DELIVERED: <Icons.Check />,
  CANCELLED: <Icons.Package />,
  REFUNDED: <Icons.Dollar />,
}

const DashboardPage = () => {
  const dispatch: AppDispatch = useDispatch()
  const { reports, orderStatusCounts } = useSelector((state: RootState) => state.report)
  const [selectedYear, setSelectedYear] = useState(availableYears[0])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    dispatch(fetchReports(new Date().getFullYear()))
    dispatch(fetchOrderStatusCounts())
  }, [dispatch])

  const processedData = useMemo(() => {
    const filteredData = reports.filter((item) => item.year === selectedYear)
    return Array.from({ length: 12 }, (_, i) => {
      const monthData = filteredData.find((item) => item.month === i + 1)
      return (
        monthData || {
          month: i + 1,
          year: selectedYear,
          totalRevenue: 0,
          totalDiscountedRevenue: 0,
          totalOrders: 0,
        }
      )
    })
  }, [reports, selectedYear])

  const yearSummary = useMemo(() => {
    return processedData.reduce(
      (acc, curr) => ({
        totalRevenue: acc.totalRevenue + curr.totalRevenue,
        totalDiscountedRevenue: acc.totalDiscountedRevenue + curr.totalDiscountedRevenue,
        totalOrders: acc.totalOrders + curr.totalOrders,
      }),
      { totalRevenue: 0, totalDiscountedRevenue: 0, totalOrders: 0 },
    )
  }, [processedData])

  const totalOrders = orderStatusCounts.reduce((sum, item) => sum + item.orderCount, 0)

  const handlePieEnter = ({ data, index, e }: { data: any, index: number, e: React.MouseEvent }) => {
    setActiveIndex(index)
  }

  const handlePieLeave = () => {
    setActiveIndex(null)
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Dashboard Analytics
            </h1>
            <p className="text-slate-500">Overview of your business performance for {selectedYear}</p>
          </div>

          <div className="w-48">
            <Listbox value={selectedYear} onChange={setSelectedYear}>
              <div className="relative">
                <Listbox.Button className="relative w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all text-left">
                  <Icons.Calendar />
                  <span className="block truncate">{selectedYear}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDownIcon className="h-5 w-5 text-slate-500" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {availableYears.map((year) => (
                      <Listbox.Option
                        key={year}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors ${active ? "bg-indigo-50 text-indigo-900" : "text-gray-900"
                          }`
                        }
                        value={year}
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{year}</span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3">
              <h3 className="text-white flex items-center gap-2 text-lg font-medium">
                <Icons.Dollar />
                Revenue
              </h3>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold">${yearSummary.totalRevenue.toLocaleString()}</div>
              <p className="text-sm text-slate-500 mt-1">Net: ${yearSummary.totalDiscountedRevenue.toLocaleString()}</p>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3">
              <h3 className="text-white flex items-center gap-2 text-lg font-medium">
                <Icons.ShoppingCart />
                Orders
              </h3>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold">{yearSummary.totalOrders.toLocaleString()}</div>
              <p className="text-sm text-slate-500 mt-1">
                Avg: {(yearSummary.totalRevenue / (yearSummary.totalOrders || 1)).toFixed(2)} per order
              </p>
            </div>
          </div>

          {/* Conversion Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3">
              <h3 className="text-white flex items-center gap-2 text-lg font-medium">
                <Icons.BarChart />
                Conversion
              </h3>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold">
                {(
                  ((orderStatusCounts.find((s) => s.status === "DELIVERED")?.orderCount || 0) / (totalOrders || 1)) *
                  100
                ).toFixed(1)}
                %
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {orderStatusCounts.find((s) => s.status === "DELIVERED")?.orderCount || 0} completed orders
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Order Status Distribution */}
          <div className="lg:col-span-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-purple-500">
                  <Icons.Package />
                </span>
                Order Status Distribution
              </h3>
              <p className="text-sm text-slate-500 mt-1">Breakdown of orders by current status</p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="w-full max-w-[220px] aspect-square">

                <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                  <div className="relative">
                
                    <PieChart width={320} height={320}>
                      <Pie
                        data={orderStatusCounts}
                        cx="50%"
                        cy="50%"
                        startAngle={90}
                        endAngle={-270}
                        outerRadius={140}
                        innerRadius={0}
                        paddingAngle={0} // Loại bỏ khoảng cách giữa các phần
                        dataKey="orderCount"
                        animationDuration={500}
                      >
                        {orderStatusCounts.map((status, index) => (
                          <Cell
                            key={`cell-${status.status}`}
                            fill={COLORS[index % COLORS.length]}
                            stroke="none" // Bỏ đường viền
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>
                </div>
              </div>

              <div className="w-full space-y-2">
                {orderStatusCounts.map((status, index) => {
                  const total = orderStatusCounts.reduce((sum, item) => sum + item.orderCount, 0)
                  const percent = ((status.orderCount / total) * 100 || 0).toFixed(1)

                  return (
                    <div
                      key={status.status}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${activeIndex === index ? "bg-slate-100" : "hover:bg-slate-50"
                        }`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
                        >
                          <div className="text-slate-700">{STATUS_ICONS[status.status] || <Icons.Package />}</div>
                        </div>
                        <span className="text-sm font-medium text-slate-700 capitalize">
                          {status.status.toLowerCase().replace(/_/g, " ")}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="block text-sm font-semibold text-slate-900">{status.orderCount}</span>
                        <span className="block text-xs font-medium text-slate-500">{percent}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Revenue Trend */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-blue-500">
                  <Icons.TrendingUp />
                </span>
                Revenue Trend
              </h3>
              <p className="text-sm text-slate-500 mt-1">Monthly revenue performance for {selectedYear}</p>
            </div>
            <div className="h-[300px]">
              <RevenueChart data={processedData} />
            </div>
          </div>

          {/* Monthly Orders */}
          <div className="lg:col-span-12 bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-emerald-500">
                  <Icons.ShoppingCart />
                </span>
                Monthly Orders
              </h3>
              <p className="text-sm text-slate-500 mt-1">Order volume by month for {selectedYear}</p>
            </div>
            <div className="h-[300px]">
              <OrdersChart data={processedData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

