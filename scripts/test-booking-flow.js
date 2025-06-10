// Test the complete booking flow
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rycurwdynoakdqzgjfww.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Y3Vyd2R5bm9ha2RxemdqZnd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTUyMTM1MCwiZXhwIjoyMDY1MDk3MzUwfQ.8VYcgGY_c3vccNwdtxBC5RPs3OqJY6X91FbK3BQmhrs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testBookingFlow() {
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
  
  console.log('=== Testing Booking Flow ===\n')
  console.log(`Testing for date: ${dateStr}`)
  console.log('Professional: Beatriz Santos')
  
  // Step 1: Add availability for tomorrow
  console.log('\n1. Adding availability for tomorrow...')
  const { data: availData, error: availError } = await supabase
    .from('availability_settings')
    .upsert({
      professional_id: beatrizId,
      date: dateStr,
      is_available: true,
      custom_start_time: '10:00:00',
      custom_end_time: '18:00:00',
      reason: 'Test availability'
    }, {
      onConflict: 'professional_id,date'
    })
    .select()
  
  if (availError) {
    console.error('Error adding availability:', availError)
    return
  }
  console.log('✓ Availability added: 10:00 - 18:00')
  
  // Step 2: Check current bookings
  console.log('\n2. Checking existing bookings...')
  const { data: bookings, error: bookingError } = await supabase
    .from('bookings')
    .select('*')
    .eq('professional_id', beatrizId)
    .eq('date', dateStr)
  
  if (bookingError) {
    console.error('Error fetching bookings:', bookingError)
  } else {
    console.log(`✓ Current bookings for ${dateStr}: ${bookings.length}`)
    bookings.forEach(b => {
      console.log(`  - ${b.start_time} to ${b.end_time}: ${b.customer_name} (${b.status})`)
    })
  }
  
  // Step 3: Get professional data
  console.log('\n3. Fetching professional data...')
  const { data: professional, error: profError } = await supabase
    .from('professionals')
    .select('*, professional_working_hours(*)')
    .eq('id', beatrizId)
    .single()
  
  if (profError) {
    console.error('Error fetching professional:', profError)
  } else {
    console.log('✓ Professional data loaded')
    console.log('  Working hours:')
    professional.professional_working_hours.forEach(wh => {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      console.log(`  - ${dayNames[wh.day_of_week]}: ${wh.start_time} to ${wh.end_time}`)
    })
  }
  
  // Step 4: Test time slot availability
  console.log('\n4. Testing time slot availability...')
  const testSlots = ['09:00', '10:00', '12:00', '14:00', '16:00', '18:00', '19:00']
  
  for (const slot of testSlots) {
    const withinCustomHours = slot >= '10:00' && slot < '18:00'
    console.log(`  - ${slot}: ${withinCustomHours ? '✓ Should be available' : '✗ Outside working hours'}`)
  }
  
  console.log('\n=== Test Complete ===')
  console.log('\nTo test booking via UI:')
  console.log('1. Go to http://localhost:3003/agendamento?professional=' + beatrizId)
  console.log(`2. Select date: ${dateStr}`)
  console.log('3. Available slots should be: 10:00, 10:30, 11:00, ..., 17:30')
  console.log('4. Slots before 10:00 and after 17:30 should be unavailable')
}

testBookingFlow().catch(console.error)