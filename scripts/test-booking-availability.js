// Test booking availability
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rycurwdynoakdqzgjfww.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Y3Vyd2R5bm9ha2RxemdqZnd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTUyMTM1MCwiZXhwIjoyMDY1MDk3MzUwfQ.8VYcgGY_c3vccNwdtxBC5RPs3OqJY6X91FbK3BQmhrs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  const dateStr = formatDate(tomorrow)
  const beatrizId = '00000000-0000-0000-0000-000000000002'
  
  console.log(`\nChecking bookings for Beatriz on ${dateStr}:\n`)
  
  // Get existing bookings
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('professional_id', beatrizId)
    .eq('date', dateStr)
    .neq('status', 'cancelled')
    .order('start_time')
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  if (bookings.length === 0) {
    console.log('No bookings found for this date.')
  } else {
    console.log(`Found ${bookings.length} booking(s):`)
    bookings.forEach(b => {
      console.log(`- ${b.start_time.substring(0,5)} to ${b.end_time.substring(0,5)}: ${b.customer_name} (${b.status})`)
    })
  }
  
  // Test the availability API
  console.log('\nTesting availability API:')
  const response = await fetch(`http://localhost:3003/api/bookings?professionalId=${beatrizId}&date=${dateStr}`)
  const apiBookings = await response.json()
  
  console.log(`API returned ${apiBookings.length} bookings`)
  
  // Check if 14:00 slot should be blocked
  const has14Booking = bookings.some(b => {
    const start = b.start_time.substring(0,5)
    const end = b.end_time.substring(0,5)
    return start <= '14:00' && end > '14:00'
  })
  
  console.log(`\n14:00 slot should be: ${has14Booking ? 'BLOCKED' : 'AVAILABLE'}`)
}

test().catch(console.error)