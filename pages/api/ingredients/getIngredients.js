import { supabase } from '../../../lib/initSupabase'

// Example of how to verify and get user data server-side.
const getIngredients = async (req, res) => {
  const { data } = await supabase
    .from("ingredients")
    .select("id, name, created_at, updated_at, ndb_no, in_stock, tags")
    .order("updated_at", { ascending: false });
    // .select("id, name, created, modified, description, tags, ingredients");

  return res.status(200).json(data)
}

export default getIngredients
