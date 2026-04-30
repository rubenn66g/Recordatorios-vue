import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://kbojujbhmvcpwcwgzlyl.supabase.co";
const supabasePublishableKey = "sb_publishable_CSa6oBNauJ5uF1WnSfAlgw_2Aa7Pcc4";

export const supabase = createClient(supabaseUrl, supabasePublishableKey)