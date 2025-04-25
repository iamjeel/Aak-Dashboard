type Props = {
    selectedDate: Date
    onDateChange: (date: Date) => void
  }
  
  export default function Calendar({ selectedDate, onDateChange }: Props) {
    // Later we can implement month navigation, scheduling modal, etc.
    return (
      <div className="bg-[#111] border border-red-600 rounded p-4">
        <h2 className="text-xl font-bold mb-2">Calendar (Coming Soon)</h2>
        <p>Selected Date: <span className="text-red-400">{selectedDate.toDateString()}</span></p>
      </div>
    )
  }
  