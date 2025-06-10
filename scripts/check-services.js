import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rycurwdynoakdqzgjfww.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Y3Vyd2R5bm9ha2RxemdqZnd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTUyMTM1MCwiZXhwIjoyMDY1MDk3MzUwfQ.8VYcgGY_c3vccNwdtxBC5RPs3OqJY6X91FbK3BQmhrs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkServices() {
  // Get services for Beatriz
  const { data: services, error } = await supabase
    .from('professional_services')
    .select('*, services(*)')
    .eq('professional_id', '00000000-0000-0000-0000-000000000002')
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Services for Beatriz:')
    services.forEach(ps => {
      console.log(`- ${ps.service_id}: ${ps.services.name} (${ps.services.duration} min) - R$ ${ps.price}`)
    })
  }
}

checkServices()
