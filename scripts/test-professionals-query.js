import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rycurwdynoakdqzgjfww.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Y3Vyd2R5bm9ha2RxemdqZnd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTUyMTM1MCwiZXhwIjoyMDY1MDk3MzUwfQ.8VYcgGY_c3vccNwdtxBC5RPs3OqJY6X91FbK3BQmhrs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase
    .from('professionals')
    .select('*, professional_working_hours(*), services_offered(*, services(*))')
    .eq('status', 'active')
    .eq('id', '00000000-0000-0000-0000-000000000002')
    .single()
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Professional:', data.name)
    console.log('Services offered:', data.services_offered?.length || 0)
    if (data.services_offered) {
      data.services_offered.forEach(so => {
        console.log(`- ${so.services.name} (${so.services.base_duration} min)`)
      })
    }
  }
}

test()
