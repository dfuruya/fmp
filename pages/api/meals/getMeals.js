import { supabase } from '../../../lib/initSupabase'

const getMeals = async (req, res) => {
  const { data } = await supabase
    .from("meals")
    .select("id, name, description, ingredients")
    .order("created_at", { ascending: false })

  return res.status(200).json(data)
}

export default getMeals
