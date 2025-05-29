import type React from "react"

type Status = "Completed" | "Processing" | "Rejected"

interface DataItem {
  id: string
  name: string
  address: string
  date: string
  type: string
  status: Status
}

interface DataTableProps {
  data: DataItem[]
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Processing":
        return "bg-purple-100 text-purple-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              NAME
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              ADDRESS
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              DATE
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              TYPE
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
              STATUS
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.address}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.type}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-4 py-1.5 inline-flex text-sm leading-5 font-medium rounded-full ${getStatusColor(
                    item.status,
                  )}`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

