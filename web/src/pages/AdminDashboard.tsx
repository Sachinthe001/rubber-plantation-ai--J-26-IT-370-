import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

type Priority = 'URGENT' | 'REVIEW' | 'UNCERTAIN' | 'ROUTINE'
type ComponentType = 'YIELD' | 'DISEASE' | 'TPD' | 'QUALITY'

interface ActionItem {
  id: string
  priority: Priority
  component: ComponentType
  subject: string
  detail: string
  age: string
  link: string
  deadline?: string
}

const mockQueue: ActionItem[] = [
  {
    id: 'q1',
    priority: 'URGENT',
    component: 'TPD',
    subject: 'Tree #TR-4085',
    detail: '84% TPD Risk, dry-cut increasing rapidly',
    age: '15m',
    link: '/tpd'
  },
  {
    id: 'q2',
    priority: 'UNCERTAIN',
    component: 'YIELD',
    subject: 'Block C (Lowlands)',
    detail: 'Rain probability 45% at 5am. AI abstained.',
    age: '2h',
    link: '/yield',
    deadline: '4:00 AM'
  },
  {
    id: 'q3',
    priority: 'URGENT',
    component: 'QUALITY',
    subject: 'Tree #TR-2101',
    detail: 'Deep wound detected (cambium exposed)',
    age: '1h',
    link: '/tapping'
  },
  {
    id: 'q4',
    priority: 'REVIEW',
    component: 'DISEASE',
    subject: 'Tree #TR-992 (Block B)',
    detail: 'Corynespora detected, 68% severity',
    age: '4h',
    link: '/disease'
  },
  {
    id: 'q5',
    priority: 'REVIEW',
    component: 'QUALITY',
    subject: 'Tree #TR-881',
    detail: 'Poor slope angle (18°)',
    age: '5h',
    link: '/tapping'
  },
  {
    id: 'q6',
    priority: 'UNCERTAIN',
    component: 'DISEASE',
    subject: 'Tree #TR-102 (Block A)',
    detail: 'Low confidence (42%) anomaly detected',
    age: '6h',
    link: '/disease'
  },
]

export default function AdminDashboard() {
  const [filterPriority, setFilterPriority] = useState<Priority | 'ALL'>('ALL')
  const [filterComponent, setFilterComponent] = useState<ComponentType | 'ALL'>('ALL')

  const summary = useMemo(() => {
    return {
      urgent: mockQueue.filter(q => q.priority === 'URGENT').length,
      review: mockQueue.filter(q => q.priority === 'REVIEW').length,
      uncertain: mockQueue.filter(q => q.priority === 'UNCERTAIN').length,
    }
  }, [])

  const filteredQueue = useMemo(() => {
    return mockQueue.filter(item => {
      if (filterPriority !== 'ALL' && item.priority !== filterPriority) return false
      if (filterComponent !== 'ALL' && item.component !== filterComponent) return false
      return true
    }).sort((a, b) => {
      // Sort URGENT first, then UNCERTAIN, then REVIEW
      const pMap = { URGENT: 1, UNCERTAIN: 2, REVIEW: 3, ROUTINE: 4 }
      if (pMap[a.priority] !== pMap[b.priority]) {
        return pMap[a.priority] - pMap[b.priority]
      }
      return 0
    })
  }, [filterPriority, filterComponent])

  const priorityIcons = {
    URGENT: '🔴',
    REVIEW: '🟡',
    UNCERTAIN: '🔵',
    ROUTINE: '⚪'
  }

  const componentLabels = {
    YIELD: 'Yield & Tapping',
    DISEASE: 'Disease Cases',
    TPD: 'Panel Health & TPD',
    QUALITY: 'Tapping Quality'
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-stone-800 tracking-tight">Home Queue</h1>
        <p className="text-stone-500 mt-1 font-medium">Unified action center for Kegalle Estate.</p>
      </div>

      {/* Top Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => setFilterPriority(filterPriority === 'URGENT' ? 'ALL' : 'URGENT')}
          className={`bg-white border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
            filterPriority === 'URGENT' ? 'ring-2 ring-rose-500 border-transparent shadow-sm' : 'border-stone-200 hover:border-rose-300'
          }`}
        >
          <div>
            <div className="text-sm font-bold text-stone-500 mb-1">URGENT</div>
            <div className="text-3xl font-black text-rose-600">{summary.urgent}</div>
          </div>
          <div className="text-4xl">🚨</div>
        </div>

        <div 
          onClick={() => setFilterPriority(filterPriority === 'UNCERTAIN' ? 'ALL' : 'UNCERTAIN')}
          className={`bg-white border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
            filterPriority === 'UNCERTAIN' ? 'ring-2 ring-indigo-500 border-transparent shadow-sm' : 'border-stone-200 hover:border-indigo-300'
          }`}
        >
          <div>
            <div className="text-sm font-bold text-stone-500 mb-1">UNCERTAIN (AI Abstained)</div>
            <div className="text-3xl font-black text-indigo-600">{summary.uncertain}</div>
          </div>
          <div className="text-4xl">🤔</div>
        </div>

        <div 
          onClick={() => setFilterPriority(filterPriority === 'REVIEW' ? 'ALL' : 'REVIEW')}
          className={`bg-white border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
            filterPriority === 'REVIEW' ? 'ring-2 ring-amber-500 border-transparent shadow-sm' : 'border-stone-200 hover:border-amber-300'
          }`}
        >
          <div>
            <div className="text-sm font-bold text-stone-500 mb-1">NEEDS REVIEW</div>
            <div className="text-3xl font-black text-amber-600">{summary.review}</div>
          </div>
          <div className="text-4xl">👀</div>
        </div>
      </div>

      {/* Filters & Queue */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Filter Bar */}
        <div className="bg-stone-50/80 px-5 py-4 border-b border-stone-200 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 text-sm font-bold">
            <button 
              onClick={() => setFilterComponent('ALL')}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${filterComponent === 'ALL' ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'}`}
            >
              All Components
            </button>
            <button 
              onClick={() => setFilterComponent('YIELD')}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${filterComponent === 'YIELD' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'}`}
            >
              Yield Decisions
            </button>
            <button 
              onClick={() => setFilterComponent('TPD')}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${filterComponent === 'TPD' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'}`}
            >
              TPD Risk
            </button>
            <button 
              onClick={() => setFilterComponent('DISEASE')}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${filterComponent === 'DISEASE' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'}`}
            >
              Disease
            </button>
            <button 
              onClick={() => setFilterComponent('QUALITY')}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${filterComponent === 'QUALITY' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'}`}
            >
              Quality
            </button>
          </div>
          
          <div className="text-sm font-bold text-stone-400">
            Showing {filteredQueue.length} items
          </div>
        </div>

        {/* Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500 font-bold">
                <th className="p-4 w-10"></th>
                <th className="p-4">Component</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Detail</th>
                <th className="p-4 text-right">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredQueue.map(item => (
                <tr key={item.id} className="hover:bg-stone-50/80 transition-colors group">
                  <td className="p-4 text-center">
                    <span title={item.priority}>{priorityIcons[item.priority]}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-black bg-stone-100 text-stone-600 px-2 py-1 rounded-md border border-stone-200">
                      {componentLabels[item.component]}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-stone-800">
                    {item.subject}
                    {item.deadline && (
                      <span className="ml-2 text-xs font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        ⏱️ {item.deadline}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-stone-600 text-sm">
                    {item.detail}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-sm font-bold text-stone-400">{item.age}</span>
                      <Link 
                        to={item.link}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-600"
                      >
                        Review →
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredQueue.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-stone-400">
                    <div className="text-4xl mb-2">🎉</div>
                    <div className="font-bold">Inbox Zero</div>
                    <div className="text-sm mt-1">No items match the current filters.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}