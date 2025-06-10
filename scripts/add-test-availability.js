// Add test availability for today
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rycurwdynoakdqzgjfww.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Y3Vyd2R5bm9ha2RxemdqZnd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTUyMTM1MCwiZXhwIjoyMDY1MDk3MzUwfQ.8VYcgGY_c3vccNwdtxBC5RPs3OqJY6X91FbK3BQmhrs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function addTestAvailability() {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  // Add availability for Ana Silva for tomorrow with custom hours
  const anaId = '00000000-0000-0000-0000-000000000001'
  
  const { data, error } = await supabase
    .from('availability_settings')
    .upsert({
      professional_id: anaId,
      date: formatDate(tomorrow),
      is_available: true,
      custom_start_time: '14:00:00',
      custom_end_time: '20:00:00',
      reason: 'Horário especial de teste'
    }, {
      onConflict: 'professional_id,date'
    })
    .select()
  
  if (error) {
    console.error('Error adding availability:', error)
  } else {
    console.log('Successfully added availability for Ana Silva:')
    console.log(`- Date: ${formatDate(tomorrow)}`)
    console.log('- Hours: 14:00 - 20:00')
    console.log('- Reason: Horário especial de teste')
  }
}

addTestAvailability().catch(console.error)